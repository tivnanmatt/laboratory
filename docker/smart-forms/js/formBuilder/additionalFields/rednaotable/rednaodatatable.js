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
var Handsontable;
var SmartFormsFields;
(function (SmartFormsFields) {
    var rednaodatatable = /** @class */ (function (_super) {
        __extends(rednaodatatable, _super);
        function rednaodatatable(options, serverOptions) {
            var _this = _super.call(this, options, serverOptions) || this;
            _this.IsFieldContainer = true;
            if (_this.IsNew) {
                _this.Options.ClassName = 'rednaodatatable';
                _this.Options.Label = "Table";
                _this.Options.CustomCSS = '';
            }
            return _this;
        }
        rednaodatatable.prototype.CreateProperties = function () {
            this.Properties.push(new SimpleTextProperty(this, this.Options, "Label", "Label", { ManipulatorType: 'basic' }));
            this.Properties.push(new SimpleTextProperty(this, this.Options, "ImageUrl", "Image Url", { ManipulatorType: 'basic' }));
            this.Properties.push(new SimpleTextProperty(this, this.Options, "ImageWidth", "Image Width", { ManipulatorType: 'basic' }));
            this.Properties.push(new SimpleTextProperty(this, this.Options, "ImageHeight", "Image Height", { ManipulatorType: 'basic' }));
            this.Properties.push(new CustomCSSProperty(this, this.Options));
        };
        rednaodatatable.prototype.GetValueString = function () {
            return 1;
        };
        rednaodatatable.prototype.SetData = function (data) {
        };
        rednaodatatable.prototype.IsValid = function () {
            return undefined;
        };
        rednaodatatable.prototype.GenerationCompleted = function ($element) {
            this.dg = new Handsontable($element.find('.redNaoTable')[0], {
                data: [
                    ["a", "Ford", "Volvo", "Toyota", "Honda"],
                    ["2014", 10, 11, 12, 13],
                    ["2015", 20, 11, 14, 13],
                    ["2016", 30, 15, 12, 13]
                ],
                minSpareRows: 1,
                rowHeaders: true,
                colHeaders: true,
                contextMenu: true,
                stretchH: 'all',
            });
            if ($element.is('.velocity-animating')) {
                this.RefreshAfterAnimation($element);
            }
        };
        rednaodatatable.prototype.GenerateInlineElement = function () {
            if (this.Options.Label != '') {
                return '<div class="rednao_label_container col-sm-3"><label class="rednao_control_label" for="textarea">' + RedNaoEscapeHtml(this.Options.Label) + '</label></div>' +
                    '<div class="redNaoControls col-sm-9">' +
                    ("<div class=\"redNaoTable\" src=\"" + this.Options.ImageUrl + "\" style=\"min-width: 300px;min-height:200px;\" ></div>") +
                    '</div>';
            }
            else {
                return '<div class="redNaoControls col-sm-12">' +
                    "<div class=\"redNaoTable\"></div>" +
                    '</div>';
            }
        };
        rednaodatatable.prototype.RefreshAfterAnimation = function ($element) {
            var _this = this;
            setTimeout(function () {
                if ($element.is('.velocity-animating')) {
                    _this.RefreshAfterAnimation($element);
                }
                else
                    _this.dg.render();
            }, 100);
        };
        return rednaodatatable;
    }(sfFormElementBase));
    SmartFormsFields.rednaodatatable = rednaodatatable;
})(SmartFormsFields || (SmartFormsFields = {}));
//# sourceMappingURL=rednaodatatable.js.map