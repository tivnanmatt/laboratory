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
var SfHandlerConditionGenerator = /** @class */ (function (_super) {
    __extends(SfHandlerConditionGenerator, _super);
    function SfHandlerConditionGenerator(translations, formBuilder, stepConfiguration, stepList) {
        var _this = _super.call(this, translations, formBuilder, stepConfiguration, stepList) || this;
        _this.StepConfiguration.Options.IsNew = _this.StepConfiguration.IsNew;
        _this.ConditionDesigner = new SFConditionDesigner(_this.FormBuilder.RedNaoFormElements, _this.StepConfiguration.Options);
        _this.Width = 570;
        return _this;
    }
    SfHandlerConditionGenerator.prototype.InitializeScreen = function (container) {
        container.css('padding-left', '5px');
        container.css('padding-right', '5px');
        container.append('<h2 style="text-align: left">' + this.Translations[this.StepConfiguration.Label] + '</h2>');
        this.ConditionDesigner.SetAllowJavascript();
        container.append(this.ConditionDesigner.GetDesigner());
    };
    ;
    SfHandlerConditionGenerator.prototype.Exit = function () {
    };
    ;
    SfHandlerConditionGenerator.prototype.Commit = function () {
        if (this.ConditionDesigner.IsValid()) {
            var data = this.ConditionDesigner.GetData();
            this.StepConfiguration.Options.Conditions = data.Conditions;
            this.StepConfiguration.Options.CompiledCondition = data.CompiledCondition;
            return true;
        }
        return false;
    };
    ;
    return SfHandlerConditionGenerator;
}(SfConditionalStepBase));
window.SfHandlerConditionGenerator = SfHandlerConditionGenerator;
//# sourceMappingURL=SfHandlerConditionGenerator.js.map