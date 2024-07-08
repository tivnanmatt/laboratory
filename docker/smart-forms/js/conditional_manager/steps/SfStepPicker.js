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
var SfStepPicker = /** @class */ (function (_super) {
    __extends(SfStepPicker, _super);
    function SfStepPicker(translations, formBuilder, stepConfiguration, stepList) {
        return _super.call(this, translations, formBuilder, stepConfiguration, stepList) || this;
    }
    SfStepPicker.prototype.InitializeScreen = function (container) {
        this.$container = container;
        container.css('text-align', 'left');
        container.css('padding-left', '5px');
        container.css('padding-right', '5px');
        container.append('<h2 style="text-align: left">' + this.Translations[this.StepConfiguration.Label] + '</h2>');
        var count = 0;
        if (SmartFormsAddNewVar.FormBuilder.MultipleStepsDesigner != null) {
            var _loop_1 = function (step) {
                var checked = '';
                if (!this_1.StepConfiguration.IsNew) {
                    if (this_1.StepConfiguration.Options.StepsToShow.find(function (x) { return x == step.Id; }) != null)
                        checked = 'checked="checked"';
                }
                count++;
                var icon = void 0;
                if (step.Icon == 'def')
                    icon = '<span style="margin-left: 3px" class="badge badge-info">' + count + '</span> ';
                else
                    icon = '<span class="' + step.Icon + '"></span> ';
                container.append("<div class=\"row\" style=\"padding-left:20px;display: flex;vertical-align: middle;align-items: center;\">\n                            <input " + checked + " class=\"stepItem\" type=\"checkbox\" value=\"" + step.Id + "\" style=\"margin:0\"/>\n                            " + icon + "<span style=\"margin-left: 3px;font-size: 15px;\" >" + step.Text + "</span>\n                         </div>");
            };
            var this_1 = this;
            for (var _i = 0, _a = SmartFormsAddNewVar.FormBuilder.MultipleStepsDesigner.Options.Steps; _i < _a.length; _i++) {
                var step = _a[_i];
                _loop_1(step);
            }
        }
        var name = 'Invalid value';
    };
    ;
    SfStepPicker.prototype.Exit = function () {
    };
    ;
    SfStepPicker.prototype.Commit = function () {
        var _this = this;
        this.StepConfiguration.Options.StepsToShow = [];
        this.$container.find('.stepItem:checked').each(function (index, value) {
            _this.StepConfiguration.Options.StepsToShow.push(rnJQuery(value).val());
        });
        if (this.StepConfiguration.Options.StepsToShow.length == 0) {
            alert('Please select at least one step');
            return false;
        }
        return true;
    };
    return SfStepPicker;
}(SfConditionalStepBase));
window.SfStepPicker = SfStepPicker;
//# sourceMappingURL=SfStepPicker.js.map