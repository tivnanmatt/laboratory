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
    var rednaoimageupload = /** @class */ (function (_super) {
        __extends(rednaoimageupload, _super);
        function rednaoimageupload(options, serverOptions) {
            var _this = _super.call(this, options, serverOptions) || this;
            _this.IsDynamicField = true;
            _this.Title = "Currency";
            if (_this.IsNew) {
                _this.Options.ClassName = "rednaoimageupload";
                _this.Options.Label = "Image Upload";
                _this.Options.Placeholder = "Drag or click here to upload an image";
                _this.Options.AllowMultipleFiles = 'n';
                _this.Options.AllowedExtensions = '.png, .jpeg, jpg';
            }
            else {
            }
            return _this;
        }
        rednaoimageupload.prototype.CreateProperties = function () {
            this.Properties.push(new PropertyContainer('general', 'Common').AddProperties([
                new SimpleTextProperty(this, this.Options, "Label", "Label", { ManipulatorType: 'basic' }),
                new SimpleTextProperty(this, this.Options, "Placeholder", "Placeholder", { ManipulatorType: 'basic' }),
                new SimpleTextProperty(this, this.Options, "AllowedExtensions", "Allowed Extensions", { ManipulatorType: 'basic' }),
                new CheckBoxProperty(this, this.Options, "IsRequired", "Required", { ManipulatorType: 'basic' }),
                new CheckBoxProperty(this, this.Options, "AllowMultipleFiles", "Allow multiple", { ManipulatorType: 'basic' }),
            ]));
            this.Properties.push(new PropertyContainer('advanced', 'Advanced').AddProperties([
                new IdProperty(this, this.Options),
                new CustomCSSProperty(this, this.Options)
            ]));
        };
        rednaoimageupload.prototype.GenerateInlineElement = function () {
            return "<div class=\"rednao_label_container col-sm-3\"><label class=\"rednao_control_label\" >" + this.Options.Label + "</label></div>\n                <div class=\"redNaoControls col-sm-9\">\n                   <table style=\"width:100%\">\n                        <tbody class=\"rendaoFileContainer\">\n                        \n                        </tbody>\n                   </table>\n               </div>\n           ";
        };
        rednaoimageupload.prototype.GetDataStore = function () {
            return new SmartFormCurrencyDataStore('numericalValue');
        };
        rednaoimageupload.prototype.GetValueString = function () {
            var data = [];
            var count = 1;
            var self = this;
            if (this.IsIgnored())
                return [];
            this.JQueryElement.find('.rednaoFileUpload').each(function () {
                var jqueryFileElement = rnJQuery(this);
                if (rnJQuery.trim(jqueryFileElement.val()) != "") {
                    var fieldName = "sfufn" + "@" + self.Id + "@" + count.toString();
                    jqueryFileElement.attr('name', fieldName);
                    data.push({ path: fieldName });
                    count++;
                }
                else
                    jqueryFileElement.removeAttr('name');
            });
            return data;
        };
        rednaoimageupload.prototype.SetData = function (data) {
            this.JQueryElement.find('.redNaoInputText').val(data.value);
        };
        rednaoimageupload.prototype.GetValuePath = function () {
            return 'formData.' + this.Id + '.value';
        };
        rednaoimageupload.prototype.IsValid = function () {
            if (this.Options.IsRequired == 'n') {
                this.RemoveError('root');
                return this.InternalIsValid();
            }
            var isValid = false;
            this.JQueryElement.find('.rednaoFileUpload').each(function () {
                if (rnJQuery(this).val() != "") {
                    isValid = true;
                }
            });
            if (isValid) {
                this.RemoveError('root');
                return this.InternalIsValid();
            }
            var self = this;
            this.JQueryElement.find('.rednaoFileUpload').each(function () {
                if (rnJQuery(this).val() == "") {
                    rnJQuery('#' + self.Id).addClass('has-error');
                    self.AddError('root', self.InvalidInputMessage);
                    return self.InternalIsValid();
                }
            });
            this.AddError('root', this.InvalidInputMessage);
            return this.InternalIsValid();
        };
        rednaoimageupload.prototype.GenerationCompleted = function (jQueryElement) {
            this.AppendElement(jQueryElement);
        };
        rednaoimageupload.prototype.TextChanged = function () {
            var text = this.GetUnFormattedAmount(this.JQueryElement.find('.redNaoInputText').val());
            this.JQueryElement.find('.redNaoInputText').val(this.GetFormattedAmount(text));
            this.FirePropertyChanged();
        };
        rednaoimageupload.prototype.GetFormattedAmount = function (amount) {
            if (isNaN(amount))
                amount = 0;
            var text = amount.toFixed(this.Options.NumberOfDecimals);
            var x = text.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            if (this.Options.ThousandSeparator != '') {
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + this.Options.ThousandSeparator + '$2');
                }
            }
            if (x2.length > 0) {
                x2 = x2.slice(1);
                x2 = this.Options.DecimalSeparator + x2;
            }
            text = x1 + x2;
            if (this.Options.CurrencyPosition == 'left')
                return this.Options.CurrencySymbol + text;
            if (this.Options.CurrencyPosition == 'left-space')
                return this.Options.CurrencySymbol + ' ' + text;
            if (this.Options.CurrencyPosition == 'right')
                return text + this.Options.CurrencySymbol;
            if (this.Options.CurrencyPosition == 'right-space')
                return text + ' ' + this.Options.CurrencySymbol;
        };
        rednaoimageupload.prototype.GetUnFormattedAmount = function (text) {
            while (text.indexOf(this.Options.ThousandSeparator) > 0) {
                text = text.replace(this.Options.ThousandSeparator, '');
            }
            text = text.replace(this.Options.DecimalSeparator, '.');
            text = text.replace(this.Options.CurrencySymbol, '');
            var val = parseFloat(text);
            if (isNaN(val))
                return 0;
            return val;
        };
        rednaoimageupload.prototype.AppendElement = function (jQueryElement) {
            var _this = this;
            var $element = rnJQuery("<tr class=\"rendaoFileItem\">\n                <td style=\"border: none;padding:0;\">\n                    <div style=\"padding:5px;border:1px dashed;cursor: pointer;flex-grow: 1\" class=\"rednaoFileContainer\">\n                        " + this.Options.Placeholder + "\n                    </div>\n                    <input style=\"display: none;\" type=\"file\" class=\"rednaoFileUpload\">\n                </td>\n                <td style=\"border: none;width:25px;\">  \n                    <div style=\"margin-left: 5px\">   \n                        <span  class=\"rednaoDeleteButton fa fa-minus-circle\" style=\"font-size: 18px;display: none;cursor: pointer;\"/>\n                    </div>               \n                </td>\n            </tr>");
            jQueryElement.find('.rendaoFileContainer').append($element);
            if (smartFormsDesignMode) {
                return;
            }
            $element.find('.rednaoFileUpload').attr('accept', this.Options.AllowedExtensions);
            $element.find('.rednaoFileUpload').change(function (e) {
                _this.FileSelected($element, e.currentTarget.files);
            });
            $element.find('.rednaoFileContainer').click(function () {
                $element.find('.rednaoFileUpload').click();
            });
            $element.find('.rednaoDeleteButton').click(function () {
                $element.find('.rednaoFileUpload').val('').change();
            });
            $element.find('.rednaoFileContainer').on('dragenter', function (e) {
                e.preventDefault();
                $element.find('.rednaoFileContainer').addClass('highlight');
            });
            $element.find('.rednaoFileContainer').on('dragleave', function (e) {
                e.preventDefault();
                $element.find('.rednaoFileContainer').removeClass('highlight');
            });
            $element.find('.rednaoFileContainer').on('dragover', function (e) {
                e.preventDefault();
                $element.find('.rednaoFileContainer').addClass('highlight');
            });
            $element.find('.rednaoFileContainer').on('drop', function (e) {
                e.preventDefault();
                $element.find('.rednaoFileContainer').removeClass('highlight');
                var file = e.originalEvent.dataTransfer.files;
                $element.find('.rednaoFileUpload')[0].files = file;
                if (file.length > 0) {
                    var name_1 = file[0].name;
                    name_1 = name_1.toLowerCase().trim();
                    var extensions = _this.Options.AllowedExtensions.trim().split(',');
                    if (extensions.length > 0) {
                        if (!extensions.some(function (x) { return name_1.endsWith(x.toLowerCase().trim()); })) {
                            alert('Invalid file type');
                            return;
                        }
                    }
                }
                _this.FileSelected($element, file);
            });
        };
        rednaoimageupload.prototype.FileSelected = function ($element, files) {
            $element.find('.rednaoDeleteButton').css('display', files.length == 0 ? 'none' : 'block');
            if (files.length > 0 && this.Options.AllowedExtensions.trim() != '') {
                var extensions = this.Options.AllowedExtensions.split(',').map(function (x) { return x.toLowerCase().replace(',', '').replace('.', '').trim(); });
                var file = files[0];
                var index = files[0].name.lastIndexOf('.');
                var extension_1 = '';
                if (index >= 0) {
                    extension_1 = files[0].name.substring(index + 1).toLowerCase();
                }
                if (!extensions.some(function (x) { return x == extension_1; })) {
                    $element.find('input').val('');
                    alert('Invalid file type');
                }
            }
            if (files.length == 0) {
                $element.remove();
                if (this.JQueryElement.find('.rendaoFileItem').length == 0)
                    this.AppendElement(this.JQueryElement);
            }
            else {
                try {
                    if (!files[0].type.startsWith('image')) {
                        throw "Invalid image file type";
                    }
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $element.find('.rednaoFileContainer').css('border-style', 'none');
                        $element.find('.rednaoFileContainer').empty();
                        $element.find('.rednaoFileContainer').append("<div style=\"padding:10px;border:1px solid black;display: inline-block;margin:-5px\">\n                                        <img style=\"max-height: 200px\" src=\"" + e.target.result + "\"/>\n                                      </div>");
                    };
                    reader.readAsDataURL(files[0]);
                }
                catch (error) {
                    $element.find('.rednaoFileContainer').css('border-style', 'solid');
                    $element.find('.rednaoFileContainer').empty().append(files[0].name);
                }
                if (this.Options.AllowMultipleFiles == 'y') {
                    var files_2 = this.JQueryElement.find('.rednaoFileUpload');
                    var found = false;
                    for (var _i = 0, files_1 = files_2; _i < files_1.length; _i++) {
                        var currentFile = files_1[_i];
                        if (currentFile.files.length == 0)
                            found = true;
                    }
                    if (!found)
                        this.AppendElement(this.JQueryElement);
                }
            }
            this.FirePropertyChanged();
        };
        return rednaoimageupload;
    }(sfFormElementBase));
    SmartFormsFields.rednaoimageupload = rednaoimageupload;
})(SmartFormsFields || (SmartFormsFields = {}));
//# sourceMappingURL=rednaoimageupload.js.map