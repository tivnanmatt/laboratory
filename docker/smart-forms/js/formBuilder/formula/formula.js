var RedNaoFormula = /** @class */ (function () {
    function RedNaoFormula(formElement, formula) {
        this.FormElement = formElement;
        this.Formula = formula;
    }
    RedNaoFormula.prototype.GetRemote = function () {
        if (this._remote == null)
            this._remote = new SmartFormsRemote();
        return this._remote;
    };
    RedNaoFormula.prototype.FieldUsedInFormula = function (fieldName) {
        if (this.FormElement._parentId == fieldName)
            return false;
        for (var i = 0; i < this.Formula.FieldsUsed.length; i++) {
            if (fieldName == this.Formula.FieldsUsed[i])
                return true;
        }
        if (this.FormElement.FieldContainer != null && typeof this.Formula.SubFieldsUsed != 'undefined')
            for (var i = 0; i < this.Formula.SubFieldsUsed.length; i++) {
                var subField = this.Formula.SubFieldsUsed[i];
                var index = subField.Index.toString().trim();
                if (index == 'current')
                    index = this.FormElement.RowIndex;
                if (fieldName == subField.Id + '_row_' + index)
                    return true;
            }
        return false;
    };
    ;
    RedNaoFormula.prototype.UpdateFieldWithValue = function (value) {
        var _this = this;
        try {
            var calculatedValue = this.GetValueFromFormula(value);
            if (calculatedValue instanceof Promise) {
                this.FormElement.ShowLoadingBox();
                calculatedValue.then(function (result) { _this.FormElement.HideLoadingBox(); _this.ProcessResult(result); });
            }
            else {
                this.ProcessResult(calculatedValue);
            }
        }
        catch (exception) {
        }
    };
    ;
    RedNaoFormula.prototype.GetValueFromFormula = function (values) {
        return RedNaoEventManager.Publish('CalculateFormula', { FormulaInstance: this, Formula: this.Formula, Values: values });
    };
    RedNaoFormula.prototype.ProcessResult = function (calculatedValue) {
        if (typeof calculatedValue == 'number' && isNaN(calculatedValue))
            calculatedValue = 0;
        var previousValue = RedNaoBasicManipulatorInstance.GetValue(this.FormElement.Options, this.Formula.PropertyName, this.Formula.additionalInformation);
        RedNaoBasicManipulatorInstance.SetValue(this.FormElement.Options, this.Formula.PropertyName, calculatedValue, this.Formula.additionalInformation);
        this.FormElement.RefreshElement(this.Formula.PropertyName, previousValue);
        this.FormElement.FirePropertyChanged();
    };
    return RedNaoFormula;
}());
function RNFRound(value, decimals) {
    return value.toFixed(decimals);
}
function RNUserName() {
    return smartFormsUserName;
}
function RNFirstName() {
    return smartFormsFirstName;
}
function RNLastName() {
    return smartFormsLastName;
}
function RNEmail() {
    return smartFormsEmail;
}
function RNIf(condition, trueValue, falseValue) {
    if (condition)
        return trueValue;
    return falseValue;
}
function RNMinutesDiff(timePicker1, timePicker2) {
    if (typeof (timePicker1.numericalValue) != 'undefined' && typeof timePicker2 != 'undefined') {
        var time1 = timePicker1.numericalValue;
        var time2 = timePicker2.numericalValue;
        var timeDif = time2 - time1;
        return timeDif / 60 / 1000;
    }
    return 0;
}
function RNDateDiff(date1, date2) {
    var value1 = date1.numericalValue;
    var value2 = date2.numericalValue;
    if (value1 == 0 || value2 == 0)
        return 0;
    date1 = new Date(value1);
    date2 = new Date(value2);
    var result = date2 - date1;
    if (result == 0)
        return 0;
    return Math.round(result / 1000 / 60 / 60 / 24);
}
var SmartFormsRemote = /** @class */ (function () {
    function SmartFormsRemote() {
    }
    SmartFormsRemote.prototype.Post = function (url, args) {
        return this.Execute('post', url, args);
    };
    SmartFormsRemote.prototype.Get = function (url, args) {
        return this.Execute('get', url, args);
    };
    SmartFormsRemote.prototype.Execute = function (name, url, args) {
        var _this = this;
        if (args instanceof window.SmartFormBasicDataStore) {
            args = Object.assign({}, args);
        }
        var createdPromise = new Promise(function (resolve) {
            var id = _this.GenerateRequestId(url, args);
            var cachedResult = SmartFormsRemote.cache.find(function (x) { return x.Id == id; });
            if (cachedResult != null && cachedResult.Result != undefined) {
                resolve(cachedResult.Result);
            }
            else {
                if (cachedResult != null) {
                    cachedResult.Pending.push(resolve);
                }
                else {
                    cachedResult = { Result: undefined, Id: id, Pending: [] };
                    cachedResult.Pending.push(resolve);
                    SmartFormsRemote.cache.push(cachedResult);
                    SmartFormsRemote.cache.push({ Id: id, Result: undefined, Pending: [resolve] });
                    rnJQuery[name](url, args)
                        .done(function (result) {
                        if (_this.lastPromise != createdPromise)
                            return;
                        try {
                            result = JSON.parse(result);
                        }
                        catch (exception) {
                        }
                        var cachedResult = SmartFormsRemote.cache.find(function (x) { return x.Id == id; });
                        cachedResult.Result = result;
                        var callback = cachedResult.Pending.pop();
                        while (callback != null) {
                            callback(cachedResult.Result);
                            callback = cachedResult.Pending.pop();
                        }
                    })
                        .fail(function (e) {
                        console.log('An error ocurred processing the json request', e);
                    });
                }
            }
        });
        return this.lastPromise = createdPromise;
    };
    SmartFormsRemote.prototype.GenerateRequestId = function (url, args) {
        var parsedArgs = '';
        if (args != null) {
            try {
                parsedArgs = JSON.stringify(args);
            }
            catch (ex) {
                parsedArgs = args.toString();
            }
        }
        return url + '@@' + parsedArgs;
    };
    SmartFormsRemote.cache = [];
    return SmartFormsRemote;
}());
function RNPMT(rate, nper, pv, fv, type) { if (!fv)
    fv = 0; if (!type)
    type = 0; if (rate == 0)
    return -(pv + fv) / nper; var pvif = Math.pow(1 + rate, nper); var pmt = rate / (pvif - 1) * -(pv * pvif + fv); if (type == 1) {
    pmt /= (1 + rate);
} ; return pmt; }
;
function RNIPMT(pv, pmt, rate, per) { var tmp = Math.pow(1 + rate, per); return 0 - (pv * tmp * rate + pmt * (tmp - 1)); }
;
function RNPPMT(rate, per, nper, pv, fv, type) { if (per < 1 || (per >= nper + 1))
    return null; var pmt = RNPMT(rate, nper, pv, fv, type); var ipmt = RNIPMT(pv, pmt, rate, per - 1); return pmt - ipmt; }
function RNXNPV(rate, values, dates) {
    var result = 0;
    for (var i = 0; i < values.length; i++) {
        result += values[i] / Math.pow(1 + rate, RNDateDiff(dates[i], dates[0]) / 365);
    }
    return result;
}
;
function RNXIRR(values, guess) {
    if (!guess)
        guess = 0.1;
    var x1 = 0.0;
    var x2 = guess;
    var f1 = RNXNPV(x1, values, null);
    var f2 = RNXNPV(x2, values, null);
    for (var i = 0; i < 100; i++) {
        if ((f1 * f2) < 0.0)
            break;
        if (Math.abs(f1) < Math.abs(f2)) {
            f1 = RNXNPV(x1 += 1.6 * (x1 - x2), values, null);
        }
        else {
            f2 = RNXNPV(x2 += 1.6 * (x2 - x1), values, null);
        }
    }
    ;
    if ((f1 * f2) > 0.0)
        return null;
    var f = RNXNPV(x1, values, null);
    if (f < 0.0) {
        var rtb = x1;
        var dx = x2 - x1;
    }
    else {
        var rtb = x2;
        var dx = x1 - x2;
    }
    ;
    for (var i = 0; i < 100; i++) {
        dx *= 0.5;
        var x_mid = rtb + dx;
        var f_mid = RNXNPV(x_mid, values, null);
        if (f_mid <= 0.0)
            rtb = x_mid;
        if ((Math.abs(f_mid) < 1.0e-6) || (Math.abs(dx) < 1.0e-6))
            return x_mid;
    }
    ;
    return null;
}
function RNFV(rate, nper, pmt, pv, type) {
    var pow = Math.pow(1 + rate, nper), fv;
    if (rate) {
        fv = (pmt * (1 + rate * type) * (1 - pow) / rate) - pv * pow;
    }
    else {
        fv = -1 * (pv + pmt * nper);
    }
    return fv.toFixed(2);
}
//# sourceMappingURL=formula.js.map