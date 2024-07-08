var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SfShowConditionalHandler = /** @class */ (function (_super) {
    __extends(SfShowConditionalHandler, _super);
    function SfShowConditionalHandler(options) {
        var _this = _super.call(this, options) || this;
        _this.Options.Type = "SfShowConditionalHandler";
        _this.Fields = "";
        _this.FormElements = null;
        return _this;
    }
    SfShowConditionalHandler.prototype.ExecutingPromise = function () {
    };
    SfShowConditionalHandler.prototype.GetConditionalSteps = function () {
        if (this.IsNew) {
            this.Options.GeneralInfo = {};
            this.Options.FieldPicker = {};
            this.Options.Condition = {};
        }
        return [
            { Type: "SfNamePicker", Label: 'HowDoYouWantToName', Options: this.Options.GeneralInfo, Id: this.Id },
            { Type: "SfHandlerFieldPicker", Label: 'typeOrSelectFieldsToBeShown', Options: this.Options.FieldPicker },
            { Type: "SfHandlerConditionGenerator", Label: 'WhenDoYouWantToDisplay', Options: this.Options.Condition }
        ];
    };
    ;
    SfShowConditionalHandler.prototype.Initialize = function (form, data) {
        this.Form = form;
        this.PreviousActionWas = -1;
        this.Condition = this.Options.Condition;
        this.SubscribeCondition(this.Options.Condition, data);
        this.ProcessCondition(data).then(function (result) { if (result != null)
            result.Execute(); });
    };
    ;
    SfShowConditionalHandler.prototype.HideFields = function () {
        this.Form.JQueryForm.find(this.GetFieldIds()).css('display', 'none');
        var formElements = this.GetFormElements();
        for (var i = 0; i < formElements.length; i++)
            formElements[i].Ignore();
    };
    ;
    SfShowConditionalHandler.prototype.GetFieldIds = function () {
        if (this.Fields == "")
            for (var i = 0; i < this.Options.FieldPicker.AffectedItems.length; i++) {
                if (i > 0)
                    this.Fields += ",";
                this.Fields += '#' + this.Options.FieldPicker.AffectedItems[i];
            }
        return this.Fields;
    };
    ;
    SfShowConditionalHandler.prototype.GetFormElements = function () {
        if (this.FormElements == null) {
            this.FormElements = [];
            for (var i = 0; i < this.Options.FieldPicker.AffectedItems.length; i++) {
                var fieldId = this.Options.FieldPicker.AffectedItems[i];
                for (var t = 0; t < this.Form.FormElements.length; t++)
                    if (this.Form.FormElements[t].Id == fieldId)
                        this.FormElements.push(this.Form.FormElements[t]);
            }
        }
        return this.FormElements;
    };
    ;
    SfShowConditionalHandler.prototype.ExecuteTrueAction = function (index) {
        if (index === void 0) { index = null; }
        var formElements = null;
        if (index === null)
            formElements = this.GetFormElements();
        else {
            formElements = this.GetRepeaterElements(index);
        }
        for (var i = 0; i < formElements.length; i++)
            formElements[i].Show(this.Options.Id);
    };
    ;
    SfShowConditionalHandler.prototype.ExecuteFalseAction = function (form, index) {
        if (index === void 0) { index = null; }
        var formElements = null;
        if (index === null)
            formElements = this.GetFormElements();
        else {
            formElements = this.GetRepeaterElements(index);
        }
        for (var i = 0; i < formElements.length; i++)
            formElements[i].Hide(this.Options.Id);
    };
    ;
    SfShowConditionalHandler.prototype.GetRepeaterElements = function (index) {
        var fields = [];
        for (var i = 0; i < this.Options.FieldPicker.AffectedItems.length; i++) {
            var fieldId = this.Options.FieldPicker.AffectedItems[i];
            var repeaterId = fieldId.split('.')[0];
            var repeaterFieldId = fieldId.split('.')[1];
            for (var t = 0; t < this.Form.FormElements.length; t++)
                if (this.Form.FormElements[t].Id == repeaterId) {
                    for (var _i = 0, _a = this.Form.FormElements[t].DynamicItems; _i < _a.length; _i++) {
                        var item = _a[_i];
                        for (var _b = 0, _c = item.Fields; _b < _c.length; _b++) {
                            var field = _c[_b];
                            if (field.Id == repeaterFieldId + '_row_' + index)
                                fields.push(field);
                        }
                    }
                }
        }
        return fields;
    };
    return SfShowConditionalHandler;
}(SfConditionalHandlerBase));
window.SfShowConditionalHandler = SfShowConditionalHandler;
//# sourceMappingURL=SfShowConditionalHandler.js.map