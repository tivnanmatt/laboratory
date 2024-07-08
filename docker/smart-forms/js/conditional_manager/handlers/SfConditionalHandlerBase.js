"use strict";
var SfConditionalHandlerBase = /** @class */ (function () {
    function SfConditionalHandlerBase(options) {
        this._remote = null;
        this.PreviousActionWas = -1;
        if (options == null) {
            this.Options = {};
            SfConditionalHandlerBase.ConditionId++;
            this.Options.Id = SfConditionalHandlerBase.ConditionId;
            this.IsNew = true;
        }
        else
            this.Options = options;
        this.Id = this.Options.Id;
    }
    SfConditionalHandlerBase.prototype.GetOptionsToSave = function () {
        this.Options.Label = this.Options.GeneralInfo.Name;
        return this.Options;
    };
    ;
    SfConditionalHandlerBase.prototype.SubscribeCondition = function (condition, initialData) {
        var self = this;
        //this.ConditionFunction=new Function('formData','return '+condition.CompiledCondition);
        var fieldsInCondition = [];
        if (condition.Mode == 'Formula') {
            for (var _i = 0, _a = condition.Formula.FieldsUsed; _i < _a.length; _i++) {
                var field = _a[_i];
                fieldsInCondition.push(field);
            }
        }
        else
            for (var i = 0; i < condition.Conditions.length; i++) {
                fieldsInCondition.push(condition.Conditions[i].Field);
                if (typeof condition.Conditions[i].Formula != 'undefined' && condition.Conditions[i].Formula.RowMode == "Formula") {
                    for (var _b = 0, _c = condition.Conditions[i].Formula.Formula.FieldsUsed; _b < _c.length; _b++) {
                        var fieldInFormula = _c[_b];
                        fieldsInCondition.push(fieldInFormula);
                    }
                }
            }
        RedNaoEventManager.Subscribe('ProcessConditionsAfterValueChanged', function (data) {
            if (fieldsInCondition.indexOf(data.FieldName) > -1) {
                var action = self.ProcessCondition(data.Data);
                if (action != null)
                    data.Actions.push(action);
            }
        });
    };
    ;
    SfConditionalHandlerBase.prototype.GetRemote = function () {
        if (this._remote == null)
            this._remote = new SmartFormsRemote();
        return this._remote;
    };
    SfConditionalHandlerBase.prototype.ProcessCondition = function (data) {
        var _this = this;
        if (this.IsRepeaterCondition()) {
            return this.ProcessRepeaterCondition(data);
        }
        var result = RedNaoEventManager.Publish('CalculateCondition', { Condition: this.Condition, Values: data, Instance: this });
        if (result instanceof Promise) {
            this.ExecutingPromise();
            return result.then(function (result) { return _this.ProcessResult(result, null); });
        }
        else
            return new Promise(function (resolve) { resolve(_this.ProcessResult(result, null)); });
    };
    ;
    SfConditionalHandlerBase.prototype.ProcessResult = function (result, index) {
        var _this = this;
        if (index === void 0) { index = null; }
        if (result) //this.ConditionFunction(data))
         {
            if (this.PreviousActionWas != 1 || index !== null) {
                return {
                    ActionType: 'show',
                    Execute: function () {
                        _this.PreviousActionWas = 1;
                        _this.ExecuteTrueAction(index);
                    }
                };
            }
        }
        else if (this.PreviousActionWas != 0 || index !== null) {
            return {
                ActionType: 'hide',
                Execute: function () {
                    _this.PreviousActionWas = 0;
                    _this.ExecuteFalseAction(null, index);
                }
            };
        }
        return null;
    };
    SfConditionalHandlerBase.prototype.IsRepeaterCondition = function () {
        return this.Options.FieldPicker != null &&
            this.Options.FieldPicker.AffectedItems != null &&
            this.Options.FieldPicker.AffectedItems.some(function (x) { return x.indexOf('.') >= 0; });
    };
    SfConditionalHandlerBase.prototype.ProcessRepeaterCondition = function (data) {
        var _this = this;
        var multiple = new MultipleActions();
        var resolvedCount = 0;
        return new Promise(function (resolve) {
            var finishedExecutingAction = function () {
                resolvedCount++;
                if (resolvedCount == repeaterField.DynamicItems.length)
                    resolve(multiple);
            };
            var repeaterId = _this.Options.FieldPicker.AffectedItems[0].split('.')[0];
            var repeaterField = _this.Form.FormElements.find(function (x) { return x.Options.Id == repeaterId; });
            if (repeaterField == null) {
                throw new Error("invalid repeater field " + repeaterId);
            }
            var _loop_1 = function (i) {
                var result = RedNaoEventManager.Publish('CalculateCondition', { Condition: _this.Condition, Values: data, Instance: _this, Current: i });
                if (result instanceof Promise) {
                    _this.ExecutingPromise();
                    result.then(function (result) {
                        multiple.Actions.push(_this.ProcessResult(result, i));
                        finishedExecutingAction();
                    });
                }
                else {
                    multiple.Actions.push(_this.ProcessResult(result, i));
                    finishedExecutingAction();
                }
            };
            for (var i = 0; i < repeaterField.DynamicItems.length; i++) {
                _loop_1(i);
            }
        });
    };
    SfConditionalHandlerBase.ConditionId = 0;
    return SfConditionalHandlerBase;
}());
var MultipleActions = /** @class */ (function () {
    function MultipleActions() {
        this.Actions = [];
    }
    MultipleActions.prototype.Execute = function () {
        for (var _i = 0, _a = this.Actions; _i < _a.length; _i++) {
            var action = _a[_i];
            action.Execute();
        }
    };
    return MultipleActions;
}());
window.SfConditionalHandlerBase = SfConditionalHandlerBase;
//# sourceMappingURL=SfConditionalHandlerBase.js.map