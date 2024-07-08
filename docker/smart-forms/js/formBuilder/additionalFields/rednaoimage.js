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
    var rednaoimage = /** @class */ (function (_super) {
        __extends(rednaoimage, _super);
        function rednaoimage(options, serverOptions) {
            var _this = _super.call(this, options, serverOptions) || this;
            _this.IsDynamicField = true;
            if (_this.IsNew) {
                _this.Options.ClassName = 'rednaoimage';
                _this.Options.Label = "Image";
                _this.Options.ImageWidth = '';
                _this.Options.ImageHeight = '';
                _this.Options.ImageUrl = smartFormsPath + 'images/sflogo.jpg';
                _this.Options.CustomCSS = '';
            }
            return _this;
        }
        rednaoimage.prototype.GetValueString = function () {
        };
        rednaoimage.prototype.StoresInformation = function () {
            return false;
        };
        rednaoimage.prototype.HandleRefresh = function (propertyName, previousValue) {
            if (propertyName == 'ImageUrl') {
                var newImage = this.Options.ImageUrl;
                if (newImage != previousValue && newImage != null) {
                    var $control = this.JQueryElement.find('.redNaoControls');
                    var $previousImage_1 = $control.find('.rednaoImageImg');
                    var $loading_1 = rnJQuery("<img src=\"" + smartFormsPath + "images/wait.gif\" style=\"position: absolute;top:calc(50% - 9px);left:calc(50% - 9px);border:none;opacity: 0;\"/>");
                    $control.append($loading_1);
                    $previousImage_1.velocity({ 'opacity': .5 }, 300, "easeInExp");
                    $loading_1.velocity({ 'opacity': 1 }, 300, "easeInExp");
                    var $newImage_1 = rnJQuery("<img style=\"opacity: 0;position:absolute;\" src=\"" + newImage + "\"/>");
                    $newImage_1.load(function () {
                        var newImageWidth = $newImage_1.width();
                        var newImageHeight = $newImage_1.height();
                        var oldImageWidth = $previousImage_1.width();
                        var oldImageHeight = $previousImage_1.height();
                        $loading_1.velocity({ 'opacity': 0 }, 300, "easeInExp", function () { $loading_1.remove(); });
                        $previousImage_1.velocity({ 'opacity': 0 }, 300, "easeInExp", function () {
                            $newImage_1.css('position', 'static');
                            $previousImage_1.remove();
                            $newImage_1.css('width', oldImageWidth);
                            $newImage_1.css('height', oldImageHeight);
                            $newImage_1.addClass('rednaoImageImg');
                            $newImage_1.velocity({ 'opacity': 1, width: newImageWidth, height: newImageHeight }, 300, "easeInExp");
                        });
                    });
                    $control.append($newImage_1);
                }
                return true;
            }
            return false;
        };
        rednaoimage.prototype.SetData = function (data) {
        };
        rednaoimage.prototype.IsValid = function () {
            return true;
        };
        rednaoimage.prototype.GenerationCompleted = function ($element) {
            if (this.Options.ImageWidth)
                this.JQueryElement.find('.rednaoImageImg').css('width', this.Options.ImageWidth);
            if (this.Options.ImageHeight)
                this.JQueryElement.find('.rednaoImageImg').css('height', this.Options.ImageHeight);
        };
        rednaoimage.prototype.GenerateInlineElement = function () {
            if (this.Options.Label != '') {
                return '<div class="rednao_label_container col-sm-3"><label class="rednao_control_label" for="textarea">' + RedNaoEscapeHtml(this.Options.Label) + '</label></div>' +
                    '<div class="redNaoControls col-sm-9">' +
                    ("<img class=\"rednaoImageImg\" src=\"" + this.Options.ImageUrl + "\"/>") +
                    '</div>';
            }
            else {
                return '<div class="redNaoControls col-sm-12">' +
                    ("<img class=\"rednaoImageImg\" src=\"" + this.Options.ImageUrl + "\"/>") +
                    '</div>';
            }
        };
        rednaoimage.prototype.CreateProperties = function () {
            this.Properties.push(new PropertyContainer('general', 'General').AddProperties([
                new SimpleTextProperty(this, this.Options, "Label", "Label", { ManipulatorType: 'basic' }),
                new SimpleTextProperty(this, this.Options, "ImageUrl", "Image Url", { ManipulatorType: 'basic' })
            ]));
            this.Properties.push(new PropertyContainer('icons', 'Icons and Tweaks').AddProperties([
                new SimpleTextProperty(this, this.Options, "ImageWidth", "Image Width", { ManipulatorType: 'basic' }),
                new SimpleTextProperty(this, this.Options, "ImageHeight", "Image Height", { ManipulatorType: 'basic' })
            ]));
            this.Properties.push(new PropertyContainer('advanced', 'Advanced').AddProperties([
                new CustomCSSProperty(this, this.Options)
            ]));
        };
        return rednaoimage;
    }(sfFormElementBase));
    SmartFormsFields.rednaoimage = rednaoimage;
})(SmartFormsFields || (SmartFormsFields = {}));
//# sourceMappingURL=rednaoimage.js.map