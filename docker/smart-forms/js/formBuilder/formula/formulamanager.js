var RedNaoFormulaManager = /** @class */ (function () {
    function RedNaoFormulaManager() {
        this.Formulas = [];
        this.RefreshAllFormulas = function () {
            for (var i = 0; i < this.Formulas.length; i++)
                this.Formulas[i].UpdateFieldWithValue(this.Data);
        };
        this.Formulas = [];
        this.Data = {};
        var self = this;
        RedNaoEventManager.Subscribe('formPropertyChanged', function (data) {
            self.PropertyChanged(data);
        });
        RedNaoEventManager.Subscribe('CalculateFormula', function (data) {
            return self.CalculateFormula(data.FormulaInstance, data.Formula, data.Values);
        });
    }
    RedNaoFormulaManager.prototype.CalculateFormula = function (instance, formula, values) {
        return (function () {
            var Remote = instance.GetRemote();
            formula = new Function('formData,Remote,current', 'return ' + formula.CompiledFormula);
            return formula(values, Remote, instance.FormElement);
        })();
    };
    RedNaoFormulaManager.prototype.PropertyChanged = function (data) {
        this.SetFormulaValue(data.Field, data.FieldName, data.Value);
        this.UpdateFormulaFieldsIfNeeded(data.FieldName, data.SubField);
        RedNaoEventManager.Publish('FormValueChanged', { FieldName: data.FieldName, Data: this.Data });
        var actionData = { FieldName: data.FieldName, Data: this.Data, Actions: [] };
        RedNaoEventManager.Publish('ProcessConditionsAfterValueChanged', actionData);
        actionData = actionData.Actions;
        var i;
        for (i = 0; i < actionData.length; i++) {
            this.ExecuteAfterComplete(actionData[i], "hide");
        }
        for (i = 0; i < actionData.length; i++) {
            this.ExecuteAfterComplete(actionData[i], "show");
        }
    };
    ;
    RedNaoFormulaManager.prototype.ExecuteAfterComplete = function (actionData, type) {
        actionData.then(function (result) {
            if (result == null)
                return;
            if (typeof result.Actions != 'undefined' && Array.isArray(result.Actions))
                for (var _i = 0, _a = result.Actions; _i < _a.length; _i++) {
                    var current = _a[_i];
                    current.Execute();
                }
            else if (result.ActionType == type)
                result.Execute();
        });
    };
    RedNaoFormulaManager.prototype.SetFormulaValue = function (field, fieldName, data) {
        var fieldData = field.GetDataStore();
        fieldData.OriginalValues = data;
        fieldData.numericalValue = 0;
        if (typeof data.value != 'undefined')
            fieldData.value = data.value;
        if (typeof data.selectedValues != 'undefined')
            fieldData.selectedValues = data.selectedValues;
        if (typeof data.amount != 'undefined') {
            fieldData.amount = data.amount;
            fieldData.numericalValue = data.amount;
        }
        if (RedNaoPathExists(fieldData, 'value')) {
            fieldData.label = fieldData.value.toString();
            if (fieldData.value == '')
                fieldData.value = 0;
            else if (!isNaN(fieldData.value)) {
                fieldData.value = parseFloat(data.value);
                fieldData.numericalValue = data.value;
            }
            if (typeof data.numericalValue != 'undefined')
                fieldData.numericalValue = data.numericalValue;
        }
        else {
            if (typeof fieldData.selectedValues != 'undefined') {
                fieldData.label = "";
                for (var i = 0; i < fieldData.selectedValues.length; i++) {
                    fieldData.label += ";" + fieldData.selectedValues[i].label;
                }
                if (fieldData.label.length > 0)
                    fieldData.label = fieldData.label.substring(1);
            }
            else {
                fieldData.label = '';
                fieldData.numericalValue = 0;
            }
        }
        this.Data[fieldName] = fieldData;
    };
    RedNaoFormulaManager.prototype.UpdateFormulaFieldsIfNeeded = function (fieldName, subField) {
        for (var i = 0; i < this.Formulas.length; i++) {
            if (this.Formulas[i].FieldUsedInFormula(fieldName) && (!this.Formulas[i].FormElement.IsInternal || (this.Formulas[i].FormElement.IsInternal && this.Formulas[i].FormElement.OriginalId != subField)))
                this.Formulas[i].UpdateFieldWithValue(this.Data);
        }
    };
    RedNaoFormulaManager.prototype.AddFormula = function (formElement, formula) {
        this.Formulas.push(new RedNaoFormula(formElement, formula));
    };
    return RedNaoFormulaManager;
}());
window.RedNaoFormulaManagerVar = new RedNaoFormulaManager();
//# sourceMappingURL=formulamanager.js.map