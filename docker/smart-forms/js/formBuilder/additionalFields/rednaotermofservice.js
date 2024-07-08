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
    var rednaotermofservice = /** @class */ (function (_super) {
        __extends(rednaotermofservice, _super);
        function rednaotermofservice(options, serverOptions) {
            var _this = _super.call(this, options, serverOptions) || this;
            _this.IsDynamicField = true;
            if (_this.IsNew) {
                _this.Options.ClassName = 'rednaotermofservice';
                _this.Options.LinkType = "PopUp";
                _this.Options.PopUpTitle = "Term of service";
                _this.Options.PopUpText = "<p>Term of service content.</p>";
                _this.Options.LinkURL = "";
                _this.Options.Label = "Term of service";
                _this.Options.Text = "I agree to the $$Term of Services$$";
                _this.Options.CustomCSS = '';
            }
            return _this;
        }
        rednaotermofservice.prototype.GetValueString = function () {
            return {
                LinkType: this.Options.LinkType,
                PopUpText: this.Options.PopUpText,
                PopUpTitle: this.Options.PopUpTitle,
                Text: this.Options.Text
            };
        };
        rednaotermofservice.prototype.StoresInformation = function () {
            return true;
        };
        rednaotermofservice.prototype.SetData = function (data) {
        };
        rednaotermofservice.prototype.IsValid = function () {
            if (!this.JQueryElement.find('.redNaoInputCheckBox').is(':checked'))
                this.AddError('root', this.InvalidInputMessage);
            else
                this.RemoveError('root');
            return this.InternalIsValid();
        };
        rednaotermofservice.prototype.GenerationCompleted = function ($element) {
            var _this = this;
            var links = $element.find('a');
            if (smartFormsDesignMode) {
                for (var _i = 0, links_1 = links; _i < links_1.length; _i++) {
                    var currentLink = links_1[_i];
                    currentLink.addEventListener('click', function (e) {
                        e.preventDefault();
                    });
                }
                return;
            }
            for (var _a = 0, links_2 = links; _a < links_2.length; _a++) {
                var currentLink = links_2[_a];
                if (this.Options.LinkType == "OpenLink")
                    return;
                currentLink.setAttribute('target', '_blank');
                currentLink.addEventListener('click', function (e) {
                    e.preventDefault();
                    var $dialog = rnJQuery("<div class=\"modal fade\"  tabindex=\"-1\">\n                         <div class=\"modal-dialog\">\n                         <div class=\"modal-content\">\n                         <div class=\"modal-header\">\n                         <h4 style=\"display: inline\" class=\"modal-title\">" + RedNaoEscapeHtml(_this.Options.PopUpTitle) + "</h4>\n                         </div>\n                         <div class=\"modal-body\">\n                            " + _this.Options.PopUpText + "\n                         </div>\n                         <div class=\"modal-footer\">\n                         <button type=\"button\" class=\"btn btn-success\">Close</button>\n                         </div>\n                         </div>\n                         </div>\n                         </div>");
                    var container = rnJQuery('<div class="bootstrap-wrapper"></div>');
                    container.append($dialog);
                    rnJQuery('body').append(container);
                    $dialog.modal('show');
                    $dialog.on('hidden.bs.modal', function () {
                        $dialog.remove();
                    });
                    $dialog.find(".btn-success").click(function () {
                        $dialog.modal('hide');
                    });
                });
            }
        };
        rednaotermofservice.prototype.GenerateInlineElement = function () {
            var id = this.Options.FormId + this.Id;
            var label = '';
            var text = this.Options.Text;
            var startIndex = text.indexOf('$$');
            var endIndex = 0;
            if (startIndex >= 0) {
                endIndex = text.indexOf('$$', startIndex + 2);
            }
            var textToReplace = '';
            if (endIndex >= 0) {
                textToReplace = text.substring(startIndex, endIndex + 2);
            }
            if (textToReplace != '') {
                var linkLabel = textToReplace.replace(/\$\$/g, '');
                var linkURL = '#';
                if (this.Options.LinkType == "OpenLink")
                    linkURL = this.Options.LinkURL;
                var link = '<a target="_blank" href="' + linkURL + '">' + RedNaoEscapeHtml(linkLabel) + '</a>';
                text = text.replace(textToReplace, link);
            }
            if (this.Options.Label.trim() != '')
                label = '<div class="rednao_label_container col-sm-3"><label class="rednao_control_label">' + RedNaoEscapeHtml(this.Options.Label) + '</label></div>';
            return label + "<div class=\"redNaoControls col-sm-9\">    \n                    <div class=\"checkbox-inline\" style=\"display: flex;align-items: center;\">\n                        <input type=\"checkbox\" class=\"redNaoInputCheckBox\" id=\"" + id + "\" name=\"" + this.Id + "\"  value=\"1\"/>\n                        <label style=\"padding-left: 18px !important;margin:0\" class=\"redNaoCheckBox redNaoCheckBox-inline\" for=\"" + id + "\">&nbsp;</label>\n                        <label style=\"margin:0\">" + text + "</label>\n                    </div>\n                </div>";
        };
        rednaotermofservice.prototype.CreateProperties = function () {
            var _this = this;
            var properties = [
                new SimpleTextProperty(this, this.Options, "Label", "Label", { ManipulatorType: 'basic' }),
                new SimpleTextProperty(this, this.Options, "Text", "Text", { ManipulatorType: 'basic', RefreshFormData: true, MultipleLine: true, Notes: 'Surround the link with <span style="color:red">$$</span> e.g. <span style="color:red">$$Term of Services$$</span>' }),
            ];
            properties.push(new ComboBoxProperty(this, this.Options, "LinkType", "LinkType", { ManipulatorType: 'basic',
                Values: [
                    { label: 'Open Link', value: 'OpenLink' },
                    { label: 'Popup', value: 'PopUp' }
                ],
                ChangeCallBack: function (newValue, oldValue) {
                    _this.Properties = [];
                    _this.CreateProperties();
                    SmartFormsAddNewVar.FormBuilder.FillPropertiesPanel(_this);
                } }));
            if (this.Options.LinkType == "PopUp") {
                properties.push(new SimpleTextProperty(this, this.Options, "PopUpTitle", "PopUp Title", { ManipulatorType: 'basic' }));
                properties.push(new TinyMCEProperty(this, this.Options, "PopUpText", "PopUp Text", { ManipulatorType: 'basic' }));
            }
            else {
                properties.push(new SimpleTextProperty(this, this.Options, "LinkURL", "Link URL", { ManipulatorType: 'basic' }));
            }
            this.Properties.push(new PropertyContainer('general', 'General').AddProperties(properties));
            this.Properties.push(new PropertyContainer('advanced', 'Advanced').AddProperties([
                new CustomCSSProperty(this, this.Options)
            ]));
        };
        return rednaotermofservice;
    }(sfFormElementBase));
    SmartFormsFields.rednaotermofservice = rednaotermofservice;
})(SmartFormsFields || (SmartFormsFields = {}));
//# sourceMappingURL=rednaotermofservice.js.map