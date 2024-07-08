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
var SfShowStepHandler = /** @class */ (function (_super) {
    __extends(SfShowStepHandler, _super);
    function SfShowStepHandler(options) {
        var _this = _super.call(this, options) || this;
        _this.$StepList = [];
        _this.Options.Type = "SfShowStepHandler";
        _this.Fields = "";
        _this.FormElements = null;
        return _this;
    }
    SfShowStepHandler.prototype.ExecutingPromise = function () {
    };
    SfShowStepHandler.prototype.GetConditionalSteps = function () {
        if (this.IsNew) {
            this.Options.GeneralInfo = {};
            this.Options.StepPicker = {};
            this.Options.Condition = {};
        }
        return [
            { Type: "SfNamePicker", Label: 'HowDoYouWantToName', Options: this.Options.GeneralInfo, Id: this.Id },
            { Type: "SfStepPicker", Label: 'SelectTheStepsToBeShow', Options: this.Options.StepPicker },
            { Type: "SfHandlerConditionGenerator", Label: 'WhenDoYouWantToDisplay', Options: this.Options.Condition }
        ];
    };
    ;
    SfShowStepHandler.prototype.Initialize = function (form, data) {
        var _this = this;
        this.Form = form;
        var stepPickerOptions = this.Options.StepPicker;
        this.Form.JQueryForm.find('.rnMLStep').each(function (index, value) {
            if (stepPickerOptions.StepsToShow.find(function (x) { return x == rnJQuery(value).data('step-id'); }))
                _this.$StepList.push({ $element: rnJQuery(value), id: rnJQuery(value).data('step-id') });
        });
        this.PreviousActionWas = -1;
        this.Condition = this.Options.Condition;
        this.SubscribeCondition(this.Options.Condition, data);
        this.ProcessCondition(data).then(function (result) { if (result != null)
            result.Execute(); });
    };
    ;
    SfShowStepHandler.prototype.GetFormElements = function () {
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
    SfShowStepHandler.prototype.ExecuteTrueAction = function (index) {
        if (index === void 0) { index = null; }
        var _loop_1 = function (step) {
            if (typeof step.OriginalWidth == "undefined")
                return "continue";
            this_1.Form.MultipleStepsManager.UnIgnoreStep(step.id);
            step.$element.css('display', 'block');
            step.$element.velocity({ width: step.OriginalWidth, 'padding-left': 30, 'padding-right': 20 }, 200, 'easeInExp', function () { step.$element.css('width', ''); });
        };
        var this_1 = this;
        for (var _i = 0, _a = this.$StepList; _i < _a.length; _i++) {
            var step = _a[_i];
            _loop_1(step);
        }
        if (this.Form != null && this.Form.MultipleStepsManager != null)
            this.Form.MultipleStepsManager.RefreshNextButtonText();
    };
    ;
    SfShowStepHandler.prototype.ExecuteFalseAction = function (from, index) {
        if (index === void 0) { index = null; }
        var _loop_2 = function (step) {
            this_2.Form.MultipleStepsManager.IgnoreStep(step.id);
            step.OriginalWidth = step.$element.width();
            step.$element.velocity({ width: 0, 'padding-left': 0, 'padding-right': 0 }, 200, 'easeOutExp', function () { step.$element.css('display', 'none'); });
        };
        var this_2 = this;
        for (var _i = 0, _a = this.$StepList; _i < _a.length; _i++) {
            var step = _a[_i];
            _loop_2(step);
        }
        if (this.Form != null && this.Form.MultipleStepsManager != null)
            this.Form.MultipleStepsManager.RefreshNextButtonText();
    };
    ;
    return SfShowStepHandler;
}(SfConditionalHandlerBase));
window.SfShowStepHandler = SfShowStepHandler;
//# sourceMappingURL=SfShowStepHandler.js.map