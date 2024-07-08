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
var SmartFormsFields;
(function (SmartFormsFields) {
    var rednaogrouppanel = /** @class */ (function (_super) {
        __extends(rednaogrouppanel, _super);
        function rednaogrouppanel(options, serverOptions) {
            var _this = _super.call(this, options, serverOptions) || this;
            _this.IsFieldContainer = true;
            _this.IsDynamicField = true;
            if (_this.IsNew) {
                _this.Options.ClassName = 'rednaogrouppanel';
                _this.Options.Label = "Group Panel";
                _this.Options.CustomCSS = '';
            }
            return _this;
        }
        rednaogrouppanel.prototype.GetValueString = function () {
        };
        rednaogrouppanel.prototype.StoresInformation = function () {
            return false;
        };
        rednaogrouppanel.prototype.SetData = function (data) {
        };
        rednaogrouppanel.prototype.IsValid = function () {
            return true;
        };
        rednaogrouppanel.prototype.GenerationCompleted = function ($element) {
            for (var _i = 0, _a = this.Fields; _i < _a.length; _i++) {
                var field = _a[_i];
                // field.GenerationCompleted(field.JQueryElement);
            }
        };
        rednaogrouppanel.prototype.GenerateInlineElement = function () {
            if (smartFormsDesignMode) {
                return "<div style=\"position: relative\">\n                            <div class=\"fieldContainerOfFields\">                                                                                                     \n                            </div>\n                            <span style=\"left:0;background-color: #99CC99;color: white;padding-left: 2px;padding-right: 2px;position: absolute;top: -8px;-webkit-border-radius: 5px;-moz-border-radius: 5px;border-radius: 5px;\">Group Panel</span>\n                            \n                        </div>";
            }
            else {
                return "<div style=\"position: relative\">\n                            <div class=\"fieldContainerOfFields\">                                                                                                     \n                            </div>                                                        \n                        </div>";
            }
        };
        rednaogrouppanel.prototype.CreateProperties = function () {
            this.Properties.push(new PropertyContainer('advanced', 'Advanced').AddProperties([
                new IdProperty(this, this.Options),
                new CustomCSSProperty(this, this.Options)
            ]));
        };
        return rednaogrouppanel;
    }(sfFormElementBase));
    SmartFormsFields.rednaogrouppanel = rednaogrouppanel;
})(SmartFormsFields || (SmartFormsFields = {}));
//# sourceMappingURL=rednaogrouppanel.js.map