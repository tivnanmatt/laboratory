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
    var rednaosignature = /** @class */ (function (_super) {
        __extends(rednaosignature, _super);
        function rednaosignature(options, serverOptions) {
            var _this = _super.call(this, options, serverOptions) || this;
            _this.IsDynamicField = true;
            _this.amount = 0;
            if (_this.IsNew) {
                _this.Options.ClassName = 'rednaosignature';
                _this.Options.Label = 'Signature';
                _this.Options.CustomCSS = '';
                _this.Options.Height = 150;
            }
            rnJQuery(window).resize(function () {
                _this.ExecuteResize();
            });
            return _this;
        }
        rednaosignature.prototype.GetValueString = function () {
            if (this.IsIgnored())
                return { value: '', native: '', image: '' };
            var result = this.JQueryElement.find('.signatureContainer').jSignature('getData', 'svgbase64');
            if (result == null || result.length == null)
                result = '';
            else
                result = result[1];
            var base30 = this.JQueryElement.find('.signatureContainer').jSignature('getData', 'base30');
            if (base30 == null || base30.length == null)
                base30 = '';
            else
                base30 = base30[1];
            var image = this.JQueryElement.find('.signatureContainer').jSignature('getData', 'image');
            if (image != null && image.length > 1)
                image = image[1];
            return { value: result, native: base30, image: image, tok: new Date().getTime() + '_' + Math.random() };
        };
        rednaosignature.prototype.SetData = function (data) {
            if (typeof data.native != 'undefined' && data.native != '') {
                this.JQueryElement.find('.signatureContainer').jSignature('setData', "data:image/jsignature;base30," + data.native);
            }
        };
        rednaosignature.prototype.IsValid = function () {
            if (this.Options.IsRequired == 'y' && typeof rnJQuery('.signatureContainer').jSignature('getData', 'native')[0] == 'undefined') {
                rnJQuery('#' + this.Id).addClass('has-error');
                this.AddError('root', this.InvalidInputMessage);
            }
            else
                this.RemoveError('root');
            return this.InternalIsValid();
        };
        rednaosignature.prototype.ExecuteResize = function () {
            var width = this.JQueryElement.find('.redNaoControls').width();
            var data = this.JQueryElement.find('.signatureContainer').jSignature('getData', 'base30');
            this.JQueryElement.find('.signatureContainer').empty().jSignature({ width: width, height: this.Options.Height });
            this.JQueryElement.find('.signatureContainer').jSignature('setData', "data:image/jsignature;base30," + data[1]);
        };
        rednaosignature.prototype.GenerationCompleted = function ($element) {
            var _this = this;
            var width = this.JQueryElement.find('.redNaoControls').width();
            this.JQueryElement.find('.signatureContainer').jSignature({ width: width, height: this.Options.Height });
            this.JQueryElement.find('.sfClearSignature').click(function () {
                _this.JQueryElement.find('.signatureContainer').jSignature('reset');
            });
            rnJQuery(function () {
                var width = _this.JQueryElement.find('.redNaoControls').width();
                if (_this.JQueryElement.find('.signatureContainer').children().length == 0)
                    _this.JQueryElement.find('.signatureContainer').jSignature({ width: width, height: _this.Options.Height });
            });
        };
        rednaosignature.prototype.GenerateInlineElement = function () {
            var select = "<div class=\"rednao_label_container col-sm-3\">\n                            <label class=\"rednao_control_label \" >" + RedNaoEscapeHtml(this.Options.Label) + "</label>\n                         </div>\n                         <div class=\"redNaoControls col-sm-9\">\n                            <div class=\"signatureAndClearContainer\">\n                                 <a href=\"#\" class=\"btn btn-danger sfClearSignature\"><span class=\"glyphicon glyphicon-trash\" title=\"Clear\"></span></a>\n                                 <div class=\"signatureContainer\"></div>\n                            </div>\n                        </div>\n                        ";
            return select;
        };
        rednaosignature.prototype.CreateProperties = function () {
            this.Properties.push(new PropertyContainer('general', 'General').AddProperties([
                new SimpleTextProperty(this, this.Options, "Label", "Label", { ManipulatorType: 'basic' }),
                new CheckBoxProperty(this, this.Options, "IsRequired", "Required", { ManipulatorType: 'basic' })
            ]));
            this.Properties.push(new PropertyContainer('icons', 'Icons and Tweaks').AddProperties([
                new SimpleTextProperty(this, this.Options, "Height", "Height", { ManipulatorType: 'basic' })
            ]));
            this.Properties.push(new PropertyContainer('advanced', 'Advanced').AddProperties([
                new CustomCSSProperty(this, this.Options)
            ]));
        };
        return rednaosignature;
    }(sfFormElementBase));
    SmartFormsFields.rednaosignature = rednaosignature;
})(SmartFormsFields || (SmartFormsFields = {}));
//# sourceMappingURL=rednaosignature.js.map