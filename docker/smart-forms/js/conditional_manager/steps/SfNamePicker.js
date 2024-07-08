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
var SfNamePicker = /** @class */ (function (_super) {
    __extends(SfNamePicker, _super);
    function SfNamePicker(translations, formBuilder, stepConfiguration, stepList) {
        return _super.call(this, translations, formBuilder, stepConfiguration, stepList) || this;
    }
    SfNamePicker.prototype.InitializeScreen = function (container) {
        container.css('text-align', 'left');
        container.css('padding-left', '5px');
        container.css('padding-right', '5px');
        container.append('<h2 style="text-align: left">' + this.Translations[this.StepConfiguration.Label] + '</h2>');
        var name = this.Translations["MyNewCondition"] + " " + this.StepConfiguration.Id;
        if (!this.StepConfiguration.IsNew) {
            name = this.StepConfiguration.Options.Name;
        }
        this.Title = rnJQuery('<input type="text" style="width: 100%;height: 40px;font-size: 20px;padding: 10px;">');
        this.Title.val(name);
        container.append(this.Title);
    };
    ;
    SfNamePicker.prototype.Exit = function () {
    };
    ;
    SfNamePicker.prototype.Commit = function () {
        if (this.Title.val().trim() == "") {
            alert(this.Translations["TheTitleCantBeEmpty"]);
            return false;
        }
        this.StepConfiguration.Options.Name = this.Title.val();
        return true;
    };
    ;
    return SfNamePicker;
}(SfConditionalStepBase));
window.SfNamePicker = SfNamePicker;
//# sourceMappingURL=SfNamePicker.js.map