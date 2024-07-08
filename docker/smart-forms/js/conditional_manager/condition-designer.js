var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var SFConditionDesigner = /** @class */ (function () {
    function SFConditionDesigner(FormElements, Options) {
        this.FormElements = FormElements;
        this.Options = Options;
        this.AllowJavascript = false;
        this.Mode = "Builder";
        this.Table = null;
        this.Options = Options;
        this.Conditions = [];
        if (typeof this.Options.Mode == "undefined")
            this.Options.Mode = "Builder";
    }
    SFConditionDesigner.prototype.SetAllowJavascript = function () {
        this.AllowJavascript = true;
        return this;
    };
    SFConditionDesigner.prototype.GetDesigner = function () {
        var _this = this;
        if (this.$Designer == null) {
            this.$Designer = rnJQuery("<div style=\"width:100%\">\n                    <div style=\"width: 100%;\" class=\"conditionalTab\"></div>\n                    <div style=\"width: 100%\" class=\"conditionContainer\">\n                        <div class=\"conditionBuilderContainer\" style=\"width;100%\"></div>\n                        <div class=\"conditionFormulaContainer\" style=\"width;100%;display:none;\">\n                            <textarea  style=\"width: 100%;height:130px;cursor: pointer;\" readonly=\"readonly\" class=\"form-control formulaTextArea\"></textarea>\n                            <div>\n                                <button class=\"formulaButton btn btn-primary\" style=\"margin-top:1px;\"><span class=\"fa fa-calculator\"></span> Open Formula Editor</button>\n                            </div>                            \n                        </div>\n                    </div>\n                 </div>");
            this.Table = rnJQuery("<table><tr>" +
                "<th>(</th>" +
                "<th>Field</th>" +
                "<th>Operation</th>" +
                "<th>Value</th>" +
                "<th>)</th>" +
                "<th>Join</th>" +
                "<th></th>" +
                "<th></th>" +
                "</tr></table>");
            this.$Designer.find('.formulaButton').click(function (e) { _this.OpenFormulaEditor(); e.preventDefault(); });
            this.$Designer.find('.conditionBuilderContainer').append(this.Table);
            if (typeof this.Options.Conditions != 'undefined' && this.Options.Conditions.length > 0)
                this.FillDefaultValues();
            else
                this.CreateConditionalRow(null);
            if (this.AllowJavascript) {
                this.$Designer.find('.conditionalTab').append("<div style=\"width: 100%;\">\n                                <div style=\"width:100%;text-align: center;\">\n                                    <span class=\"conditionalMode conditionalBuilder conditionalSelected\"  data-value=\"Builder\"><span class=\"fa fa-wrench\"></span> Condition Builder</span>\n                                    <span>|</span>\n                                    <span  class=\"conditionalMode conditionalFormula\" data-value=\"Formula\"><span class=\"fa fa-calculator\"></span> Formula</span>\n                                </div>                                \n                            </div>");
                this.$Designer.find('.conditionalMode').click(function (e) {
                    _this.SetMode(rnJQuery(e.currentTarget).data('value'));
                });
            }
            this.$Designer.find('.formulaTextArea').click(function () { _this.OpenFormulaEditor(); });
        }
        this.SetMode(this.Options.Mode);
        return this.$Designer;
    };
    ;
    SFConditionDesigner.prototype.FillDefaultValues = function () {
        var conditions = this.Options.Conditions;
        for (var i = 0; i < conditions.length; i++) {
            var row = this.CreateConditionalRow(conditions[i].Formula);
            var formElements = this.FormElements;
            for (var h = 0; h < formElements.length; h++)
                if (formElements[h].Id == conditions[i].Field)
                    row.find('.rnConditionField').val(h.toString()).change();
            row.find('.rnConditionOper').val(conditions[i].Op);
            row.find('.operType').val(conditions[i].OpType);
            if (typeof conditions[i].SerializationType != 'undefined')
                row.find('.serializationType').val(conditions[i].SerializationType);
            if (conditions[i].OpType == "date")
                row.find('.rnConditionVal').datepicker('setDate', conditions[i].Value);
            if (conditions[i].OpType == "text")
                row.find('.rnConditionVal').val(conditions[i].Value);
            else
                row.find('.rnConditionVal').select2('val', conditions[i].Value);
            if (conditions[i].IsOpeningPar == 'y')
                row.find('.leftPar').attr('checked', 'checked');
            if (conditions[i].IsClosingPar == 'y')
                row.find('.rightPar').attr('checked', 'checked');
            row.find('.conditionJoin').val(conditions[i].Join);
        }
        this.RefreshFormulaText();
    };
    ;
    SFConditionDesigner.prototype.CreateConditionalRow = function (formulaOptions) {
        var condition = {};
        this.Conditions.push(condition);
        var row = rnJQuery('<tr class="sfConditionRow">' +
            '   <td><input class="leftPar" type="checkbox" name="condition' + this.Table.find('tr').length + '"/></td>' +
            '   <td><select class="rnConditionField" style="width: 130px;">' + this.GetFieldItems() + '</select></td>' +
            '   <td><select class="rnConditionOper" style="width: 100px;"></select><input type="hidden" class="operType"/><input type="hidden" class="serializationType"/></td>' +
            '   <td class="tdValue"><input class="rnConditionVal" type="text" style="width: 139px;"/></td>' +
            '   <td><input  class="rightPar" type="checkbox" name="condition' + this.Table.find('tr').length + '"/></td>' +
            '   <td><select class="conditionJoin"><option></option><option value="and">And</option><option value="or">Or</option></select></td>' +
            '   <td><button class="conditionAdd" value="+">+</button></td>' +
            (this.Table.find('tr').length > 1 ? '   <td><button class="conditionRemove" value="-">-</button></td>' : '') +
            '</tr>');
        var self = this;
        row.find('.leftPar').change(function () {
            if (rnJQuery(this).is(':checked'))
                row.find('.rightPar').removeAttr('checked');
        });
        row.find('.rightPar').change(function () {
            if (rnJQuery(this).is(':checked'))
                row.find('.leftPar').removeAttr('checked');
        });
        row.find('.conditionAdd').click(function (e) {
            e.preventDefault();
            if (row.find('.conditionJoin').val() == '')
                row.find('.conditionJoin').val('and');
            self.CreateConditionalRow(null);
        });
        row.find('.conditionRemove').click(function (e) {
            e.preventDefault();
            row.remove();
        });
        row.find('.rnConditionField').change(function () {
            self.FieldSelected(row, rnJQuery(this).val(), condition);
        });
        if (typeof formulaOptions == "undefined" || formulaOptions == null)
            formulaOptions = { RowMode: "FixedValue" };
        row.data('ConditionFormulaOptions', formulaOptions);
        if (this.AllowJavascript) {
            this.AddFormulaButton(row);
        }
        this.Table.append(row);
        return row;
    };
    ;
    SFConditionDesigner.prototype.FieldSelected = function (row, selectedField, condition) {
        row.find('.rnConditionOper').empty();
        if (selectedField == -1) {
            condition.Field = "";
            return;
        }
        selectedField = this.FormElements[selectedField];
        condition.Field = selectedField.Id;
        var options = "";
        if (selectedField.Options.ClassName == 'rednaodatepicker') {
            row.find('.operType').val('date');
            row.find('.serializationType').val('date');
            options =
                "<option value='eq'>equal</option>" +
                    "<option value='neq'>not equal</option>" +
                    "<option value='gt'>Greater than</option>" +
                    "<option value='get'>Greater or equal than</option>" +
                    "<option value='lt'>Less than</option>" +
                    "<option value='let'>Less or equal than</option>";
            var datePicker = rnJQuery('<input class="rnConditionVal" type="text" style="width: 139px;"/>');
            row.find('.tdValue .rnConditionVal').remove();
            row.find('.tdValue').prepend(datePicker);
            datePicker.datepicker({
                dateFormat: 'yy-mm-dd',
                beforeShow: function () {
                    rnJQuery('#ui-datepicker-div').wrap('<div class="smartFormsSlider"></div>');
                },
                onClose: function () {
                    rnJQuery('#ui-datepicker-div').unwrap();
                }
            });
        }
        else if (typeof selectedField.Options.Options == 'undefined') {
            row.find('.operType').val('text');
            if (selectedField.Options.ClassName == "rednaodatepicker")
                row.find('.serializationType').val('date');
            else
                row.find('.serializationType').val('text');
            options =
                "<option value='eq'>equal</option>" +
                    "<option value='neq'>not equal</option>" +
                    "<option value='contains'>contains</option>" +
                    "<option value='ncontains'>not contains</option>" +
                    "<option value='gt'>Greater than</option>" +
                    "<option value='get'>Greater or equal than</option>" +
                    "<option value='lt'>Less than</option>" +
                    "<option value='let'>Less or equal than</option>";
            /*+
                 "<option value='empty'>Is Empty</option>"+
                 "<option value='nempty'>Is Not Empty</option>"*/
            row.find('.tdValue .rnConditionVal').remove();
            row.find('.tdValue').prepend('<input class="rnConditionVal" type="text" style="width: 139px;"/>');
        }
        else {
            row.find('.operType').val('list');
            row.find('.serializationType').val('list');
            if (selectedField.Options.ClassName == "rednaomultiplecheckboxes")
                row.find('.serializationType').val('list');
            options = "<option value='contains'>contains</option>" +
                "<option value='ncontains'>not contains</option>" /*+
     "<option value='empty'>Is Empty</option>"+
     "<option value='nempty'>Is Not Empty</option>"*/;
            var fieldAvailableOptions = "";
            for (var i = 0; i < selectedField.Options.Options.length; i++) {
                fieldAvailableOptions += "<option value='" + RedNaoEscapeHtml(selectedField.Options.Options[i].label) + "'>" + RedNaoEscapeHtml(selectedField.Options.Options[i].label) + "</option>";
            }
            var select = rnJQuery('<select class="rnConditionVal" multiple="multiple" style="width: 139px;">' + fieldAvailableOptions + '</select>');
            row.find('.tdValue .rnConditionVal').remove();
            row.find('.tdValue').prepend(select);
            select.select2();
        }
        row.find('.rnConditionOper').append(options);
        this.UpdateValueFieldStatus(row);
    };
    ;
    SFConditionDesigner.prototype.GetFieldItems = function () {
        var formElements = this.FormElements;
        var options = "<option value='-1'></option>";
        for (var i = 0; i < formElements.length; i++)
            if (formElements[i].StoresInformation() && !formElements[i].IsHandledByAnotherField() && !formElements[i].IsFieldContainer)
                options += "<option value='" + i.toString() + "'>" + formElements[i].GetFriendlyName() + "</option>";
        return options;
    };
    ;
    SFConditionDesigner.prototype.CompileCondition = function (conditions) {
        conditions = this.GetRowsData();
        var conditionTxt = "";
        var header = '';
        var footer = '';
        var variableCount = 0;
        for (var i = 0; i < conditions.length; i++) {
            var variableName = null;
            if (conditions[i].Formula.RowMode == "Formula") {
                variableName = 'result' + variableCount;
                var formula = conditions[i].Formula.Formula.CompiledFormula;
                if (formula.length > 0 && formula[formula.length - 1] == ';')
                    formula = formula.substring(0, formula.length - 1);
                header += formula + ".then(function(" + variableName + "){";
                variableCount++;
                footer += '})';
            }
            var formElement = null;
            for (var h = 0; h < this.FormElements.length; h++) {
                if (this.FormElements[h].Id == conditions[i].Field)
                    formElement = this.FormElements[h];
            }
            if (formElement == null)
                continue;
            if (conditions[i].IsOpeningPar == 'y')
                conditionTxt += '(';
            if (conditions[i].OpType == 'list') {
                conditionTxt += (conditions[i].Op == "contains" ? "" : "!") + "RedNaoListContainsValue(" + (variableName != null ? variableName : JSON.stringify(conditions[i].Value)) + ",formData." + formElement.Id + ") ";
            }
            else {
                var amount = parseFloat(conditions[i].Value);
                if (isNaN(amount))
                    amount = 0;
                if (conditions[i].OpType == 'date') {
                    amount = rnJQuery.datepicker.parseDate('yy-mm-dd', conditions[i].Value).getTime();
                    if (variableName != null)
                        amount = variableName;
                    switch (conditions[i].Op) {
                        case 'eq':
                            conditionTxt += formElement.GetNumericalValuePath() + "==" + amount.toString() + " && " + formElement.GetNumericalValuePath() + "!=0";
                            break;
                        case 'neq':
                            conditionTxt += formElement.GetNumericalValuePath() + "!=" + amount.toString();
                            break;
                        case 'gt':
                            conditionTxt += formElement.GetNumericalValuePath() + ">" + amount.toString() + " && " + formElement.GetNumericalValuePath() + "!=0";
                            break;
                        case 'get':
                            conditionTxt += formElement.GetNumericalValuePath() + ">=" + amount.toString() + " && " + formElement.GetNumericalValuePath() + "!=0";
                            break;
                        case 'lt':
                            conditionTxt += formElement.GetNumericalValuePath() + "<" + amount.toString() + " && " + formElement.GetNumericalValuePath() + "!=0";
                            break;
                        case 'let':
                            conditionTxt += formElement.GetNumericalValuePath() + "<=" + amount.toString() + " && " + formElement.GetNumericalValuePath() + "!=0";
                            break;
                    }
                }
                else {
                    var stringValue = conditions[i].Value.toLowerCase();
                    if (variableName != null) {
                        stringValue = variableName;
                        amount = variableName;
                    }
                    else {
                        stringValue = "'" + stringValue + "'";
                    }
                    switch (conditions[i].Op) {
                        case 'eq':
                            conditionTxt += formElement.GetLabelPath() + ".toLowerCase()==" + stringValue + " ";
                            break;
                        case 'neq':
                            conditionTxt += formElement.GetLabelPath() + ".toLowerCase()!=" + stringValue + " ";
                            break;
                        case 'contains':
                            conditionTxt += formElement.GetLabelPath() + ".toLowerCase().indexOf(" + stringValue + ")>-1 ";
                            break;
                        case 'ncontains':
                            conditionTxt += formElement.GetLabelPath() + ".toLowerCase().indexOf(" + stringValue + ")==-1 ";
                            break;
                        case 'gt':
                            conditionTxt += formElement.GetNumericalValuePath() + ">" + amount.toString() + " ";
                            break;
                        case 'get':
                            conditionTxt += formElement.GetNumericalValuePath() + ">=" + amount.toString() + " ";
                            break;
                        case 'lt':
                            conditionTxt += formElement.GetNumericalValuePath() + "<" + amount.toString() + " ";
                            break;
                        case 'let':
                            conditionTxt += formElement.GetNumericalValuePath() + "<=" + amount.toString() + " ";
                            break;
                    }
                }
            }
            if (conditions[i].IsClosingPar == 'y')
                conditionTxt += ") ";
            if (conditions.length - 1 > i)
                conditionTxt += ' ' + (conditions[i].Join == 'and' ? '&&' : '||') + ' ';
        }
        return "new Promise(function(sfInternalResolve){\n            " + header + "\n                sfInternalResolve(" + conditionTxt + ");\n            " + footer + "\n        });";
        // alert(conditionTxt);
    };
    ;
    SFConditionDesigner.prototype.IsValid = function () {
        if (this.Mode == "Formula")
            return true;
        var data = this.GetRowsData();
        var openPar = 0;
        var closePar = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i].Field.trim() == "" || data[i].Op.trim() == "" || data[i].OpType.trim() == "" || (data[i].OpType == "list" && data[i].Value.length <= 0 && data[i].Formula.RowMode == "FixedValue") ||
                (i < (data[i].length - 1) && data[i].Join.trim() == "" && data[i].Formula.RowMode == "FixedValue")) {
                alert('Please fill all fields');
                return false;
            }
            if (data[i].IsOpeningPar == 'y')
                openPar++;
            if (data[i].IsClosingPar == 'y') {
                if (closePar >= openPar) {
                    alert('You are closing one parenthesis when there is no open parenthesis');
                    return false;
                }
                closePar++;
            }
        }
        if (openPar != closePar) {
            alert('The open parenthesis count doesn\'t match the close parenthesis count');
            return false;
        }
        return true;
    };
    ;
    SFConditionDesigner.prototype.GetRowsData = function () {
        var rows = this.Table.find('.sfConditionRow');
        var data = [];
        for (var i = 0; i < rows.length; i++) {
            var row = rnJQuery(rows[i]);
            data.push({
                Field: (row.find('.rnConditionField').val() >= 0 ? this.FormElements[row.find('.rnConditionField').val()].Id : ""),
                Op: row.find('.rnConditionOper').val(),
                OpType: row.find('.operType').val(),
                Value: (row.find('.operType').val() == 'list' ? row.find('.rnConditionVal').select2('val') : row.find('.rnConditionVal').val()),
                IsOpeningPar: (row.find('.leftPar').is(':checked') ? 'y' : 'n'),
                IsClosingPar: (row.find('.rightPar').is(':checked') ? 'y' : 'n'),
                Join: row.find('.conditionJoin').val(),
                SerializationType: row.find('.serializationType').val(),
                Formula: rnJQuery(rows[i]).data('ConditionFormulaOptions')
            });
        }
        return data;
    };
    ;
    SFConditionDesigner.prototype.GetData = function () {
        var rowData = this.GetRowsData();
        return {
            Conditions: rowData,
            CompiledCondition: this.CompileCondition(rowData)
        };
    };
    SFConditionDesigner.prototype.AddFormulaButton = function ($row) {
        var _this = this;
        var $img = rnJQuery("<img style=\"width: 15px;height: 20px;vertical-align: top;margin:2px 0 0 2px;cursor: pointer;\"></img>");
        $row.find('.tdValue').append($img);
        var conditionOptions = $row.data('ConditionFormulaOptions');
        if (conditionOptions.RowMode == "Formula")
            $img.attr('src', smartFormsRootPath + 'images/formula_used.png');
        else
            $img.attr('src', smartFormsRootPath + 'images/formula.png');
        $img.click(function () {
            RedNaoFormulaWindowVar.OpenFormulaEditor(SmartFormsAddNewVar.FormBuilder.RedNaoFormElements, { 'Formulas': conditionOptions }, 'Formula', {}, $img, function (formula) {
                if (typeof conditionOptions.Formula == "undefined")
                    _this.SetRowMode($row, "FixedValue");
                else {
                    _this.SetRowMode($row, "Formula");
                    _this.UpdatePlaceholderWithFormula($row);
                }
            });
        });
    };
    SFConditionDesigner.prototype.SetRowMode = function ($row, mode) {
        var conditionFormulaRowOption = $row.data('ConditionFormulaOptions');
        if (conditionFormulaRowOption.RowMode == mode)
            return;
        conditionFormulaRowOption.RowMode = mode;
        this.UpdateValueFieldStatus($row);
    };
    SFConditionDesigner.prototype.UpdateValueFieldStatus = function ($row) {
        var conditionRowOption = $row.data('ConditionFormulaOptions');
        if (conditionRowOption.RowMode == "Formula") {
            $row.find('.rnConditionVal ').attr('disabled', 'disabled');
            $row.find('.rnConditionVal ').css('background-color', '#eee');
            $row.find('.rnConditionVal ').css('border-color', '#ccc');
            $row.find('.rnConditionVal ').val('');
            if ($row.find('.rnConditionVal ').is('select')) {
                $row.find('.rnConditionVal ').val('');
            }
        }
        else {
            $row.find('.rnConditionVal ').removeAttr('disabled');
            $row.find('.rnConditionVal ').css('background-color', '');
            $row.find('.rnConditionVal ').css('border-color', '');
            $row.find('.rnConditionVal ').val('');
            $row.find('.rnConditionVal ').attr('placeholder', '');
            $row.find('.rnConditionVal').data('placeholder', '');
            $row.find('select.rnConditionVal').select2();
        }
        this.UpdatePlaceholderWithFormula($row);
    };
    SFConditionDesigner.prototype.UpdatePlaceholderWithFormula = function ($row) {
        var conditionRowOption = $row.data('ConditionFormulaOptions');
        var formula = '';
        if (conditionRowOption.RowMode == "Formula")
            formula = this.GetFriendlyFormula(conditionRowOption.Formula.Value);
        $row.find('.rnConditionVal ').attr('placeholder', formula);
        if ($row.find('.rnConditionVal ').is('select')) {
            $row.find('.rnConditionVal').data('placeholder', formula);
            $row.find('select.rnConditionVal').select2();
        }
    };
    SFConditionDesigner.prototype.GetFriendlyFormula = function (formula) {
        var re = /\[field ([^\]]*)\]/g;
        var m;
        while (m = re.exec(formula)) {
            var label = m[1];
            for (var _i = 0, _a = this.FormElements; _i < _a.length; _i++) {
                var formElement = _a[_i];
                if (formElement.Id == m[1]) {
                    label = formElement.Options.Label.trim();
                    if (label == '')
                        label = formElement.Id;
                }
            }
            formula = formula.replace(m[0], '[' + label + ']');
            re.lastIndex = 0;
            //text=text.replace(,this.CreateFieldTag(label,id));
        }
        return formula;
    };
    SFConditionDesigner.prototype.SetMode = function (mode) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.Mode == mode)
                    return [2 /*return*/];
                this.Options.Mode = mode;
                this.$Designer.find('.conditionalMode.conditionalSelected').removeClass('conditionalSelected');
                this.$Designer.find('.conditional' + mode).addClass('conditionalSelected');
                this.Mode = mode;
                if (this.Mode == "Formula") {
                    this.SwitchContainer(this.$Designer.find('.conditionFormulaContainer'), this.$Designer.find('.conditionBuilderContainer'));
                    if (typeof this.Options.Formula == "undefined" || typeof this.Options.Formula.Value == "undefined" || this.Options.Formula.Value.trim() == '')
                        this.OpenFormulaEditor();
                }
                else {
                    this.SwitchContainer(this.$Designer.find('.conditionBuilderContainer'), this.$Designer.find('.conditionFormulaContainer'));
                    this.Table.velocityAsync({ opacity: 1 }, 200, "easeInExp");
                }
                return [2 /*return*/];
            });
        });
    };
    SFConditionDesigner.prototype.SwitchContainer = function ($containerToShow, $containerToHide) {
        return __awaiter(this, void 0, void 0, function () {
            var $conditionContainer, previousHeight, newHeight;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, $containerToHide.velocityAsync({ opacity: 0 }, 200, "easeOutExp")];
                    case 1:
                        _a.sent();
                        $conditionContainer = this.$Designer.find('.conditionContainer');
                        previousHeight = $conditionContainer.outerHeight() + 'px';
                        $containerToHide.css('display', 'none');
                        $containerToShow.css({ opacity: 0, display: 'block' });
                        newHeight = $containerToShow.outerHeight() + 'px';
                        $containerToShow.height(0);
                        rnJQuery.Velocity.hook($containerToShow, 'height', 0);
                        rnJQuery.Velocity.hook($conditionContainer, 'height', previousHeight);
                        $containerToShow.velocityAsync({ height: [0, newHeight], opacity: 1 }, 200, "easeInExp");
                        return [4 /*yield*/, $conditionContainer.velocityAsync({ height: [newHeight, previousHeight] }, 200, "easeInExp")];
                    case 2:
                        _a.sent();
                        $containerToShow.css('height', '');
                        $conditionContainer.css('height', '');
                        return [2 /*return*/];
                }
            });
        });
    };
    SFConditionDesigner.prototype.OpenFormulaEditor = function () {
        var _this = this;
        RedNaoFormulaWindowVar.OpenFormulaEditor(SmartFormsAddNewVar.FormBuilder.RedNaoFormElements, { 'Formulas': this.Options }, 'Formula', {}, rnJQuery('<img></img>'), function (formula) {
            _this.RefreshFormulaText();
        });
    };
    SFConditionDesigner.prototype.RefreshFormulaText = function () {
        if (typeof this.Options.Formula == "undefined" || typeof this.Options.Formula.Value == "undefined")
            this.$Designer.find('.formulaTextArea').val('');
        else
            this.$Designer.find('.formulaTextArea').val(this.GetFriendlyFormula(this.Options.Formula.Value));
    };
    return SFConditionDesigner;
}());
//# sourceMappingURL=condition-designer.js.map