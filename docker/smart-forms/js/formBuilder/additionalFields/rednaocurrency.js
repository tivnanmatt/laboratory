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
    var rednaocurrency = /** @class */ (function (_super) {
        __extends(rednaocurrency, _super);
        function rednaocurrency(options, serverOptions) {
            var _this = _super.call(this, options, serverOptions) || this;
            _this.IsDynamicField = true;
            _this.Title = "Currency";
            if (_this.IsNew) {
                _this.Options.ClassName = "rednaocurrency";
                _this.Options.Label = "Currency";
                _this.Options.Placeholder = "";
                _this.Options.Value = "";
                _this.Options.ReadOnly = 'n';
                _this.Options.Width = "";
                _this.Options.Icon = { ClassName: '' };
                _this.Options.CustomCSS = '';
                _this.Options.CurrencySymbol = '$';
                _this.Options.CurrencyPosition = 'left';
                _this.Options.DecimalSeparator = '.';
                _this.Options.ThousandSeparator = ',';
                _this.Options.NumberOfDecimals = '2';
                _this.Options.Placeholder_Icon = { ClassName: '', Orientation: '' };
            }
            else {
                _this.SetDefaultIfUndefined('Value', '');
                _this.SetDefaultIfUndefined('ReadOnly', 'n');
                _this.SetDefaultIfUndefined('Width', '');
                _this.SetDefaultIfUndefined('Icon', { ClassName: '' });
                _this.SetDefaultIfUndefined('CustomCSS', '');
                _this.SetDefaultIfUndefined('Placeholder_Icon', { ClassName: '' });
            }
            return _this;
        }
        rednaocurrency.prototype.CreateProperties = function () {
            this.Properties.push(new PropertyContainer('general', 'Common').AddProperties([
                new SimpleTextProperty(this, this.Options, "Label", "Label", { ManipulatorType: 'basic' }),
                new CheckBoxProperty(this, this.Options, "IsRequired", "Required", { ManipulatorType: 'basic' }),
                new SimpleTextProperty(this, this.Options, "Value", "Default Value", { ManipulatorType: 'basic', RefreshFormData: true }).SetEnableFormula(),
                new SimpleTextProperty(this, this.Options, "CurrencySymbol", "Symbol", { ManipulatorType: 'basic', RefreshFormData: true }),
                new ComboBoxProperty(this, this.Options, 'CurrencyPosition', "Position", { ManipulatorType: 'basic' })
                    .AddOption('Left ($99.99)', 'left')
                    .AddOption('Left with space ($ 99.99)', 'left-space')
                    .AddOption('Right (99.99$)', 'right')
                    .AddOption('Right with space (99.99 $)', 'right-space'),
                new SimpleTextProperty(this, this.Options, "DecimalSeparator", "Decimal Separator", { ManipulatorType: 'basic', RefreshFormData: true }),
                new SimpleTextProperty(this, this.Options, "ThousandSeparator", "Thousand Separator", { ManipulatorType: 'basic', RefreshFormData: true }),
                new SimpleNumericProperty(this, this.Options, "NumberOfDecimals", "Number of Decimals", { ManipulatorType: 'basic', RefreshFormData: true })
            ]));
            this.Properties.push(new PropertyContainer('icons', 'Icons and Tweaks').AddProperties([
                new SimpleTextProperty(this, this.Options, "Placeholder", "Placeholder", { ManipulatorType: 'basic', IconOptions: { Type: 'leftAndRight' } }),
                new SimpleNumericProperty(this, this.Options, "Width", "Width", { ManipulatorType: 'basic' }),
                new IconProperty(this, this.Options, 'Icon', 'Icon', { ManipulatorType: 'basic' })
            ]));
            this.Properties.push(new PropertyContainer('advanced', 'Advanced').AddProperties([
                new CheckBoxProperty(this, this.Options, "ReadOnly", "Read Only", { ManipulatorType: 'basic' }),
                new IdProperty(this, this.Options),
                new CustomCSSProperty(this, this.Options)
            ]));
        };
        rednaocurrency.prototype.GenerateInlineElement = function () {
            var additionalStyle = '';
            if (!isNaN(parseFloat(this.Options.Width)))
                additionalStyle = 'width:' + this.Options.Width + 'px' + ' !important;';
            var startOfInput = '';
            var endOfInput = '';
            if (this.Options.Icon.ClassName != '') {
                startOfInput = '<div class="rednao-input-prepend input-group"><span class="redNaoPrepend input-group-addon prefix ' + RedNaoEscapeHtml(this.Options.Icon.ClassName) + ' "></span>';
                endOfInput = '</div>';
            }
            return '<div class="rednao_label_container col-sm-3"><label class="rednao_control_label" >' + RedNaoEscapeHtml(this.Options.Label) + '</label></div>' +
                '<div class="redNaoControls col-sm-9">' +
                startOfInput +
                '<input style="' + additionalStyle + '" ' + (this.Options.ReadOnly == 'y' ? 'disabled="disabled"' : "") + ' name="' + this.GetPropertyName() + '" type="text" placeholder="' + RedNaoEscapeHtml(this.Options.Placeholder) + '" class="form-control redNaoInputText ' + (this.Options.ReadOnly == 'y' ? 'redNaoDisabledElement' : "") + '" value="' + RedNaoEscapeHtml(this.GetFormattedAmount(parseFloat(this.Options.Value))) + '">' +
                endOfInput +
                '</div>';
        };
        rednaocurrency.prototype.GetDataStore = function () {
            return new SmartFormCurrencyDataStore('numericalValue');
        };
        rednaocurrency.prototype.GetValueString = function () {
            if (this.IsIgnored())
                return { value: '', numericalValue: 0 };
            var numValue = this.GetUnFormattedAmount(this.JQueryElement.find('.redNaoInputText').val());
            return { value: this.GetFormattedAmount(numValue), numericalValue: numValue };
        };
        rednaocurrency.prototype.SetData = function (data) {
            this.JQueryElement.find('.redNaoInputText').val(data.value);
        };
        rednaocurrency.prototype.GetValuePath = function () {
            return 'formData.' + this.Id + '.value';
        };
        rednaocurrency.prototype.IsValid = function () {
            if (this.JQueryElement.find('.redNaoInputText').val() == "" && this.Options.IsRequired == 'y')
                this.AddError('root', this.InvalidInputMessage);
            else
                this.RemoveError('root');
            return this.InternalIsValid();
        };
        rednaocurrency.prototype.GenerationCompleted = function (jQueryElement) {
            var self = this;
            this.JQueryElement.find('.redNaoInputText').change(function () { self.TextChanged(); });
            if (this.Options.Placeholder_Icon.ClassName != '') {
                this.LoadPlaceHolderIcon(jQueryElement.find('.redNaoInputText'), null, null, this.Options.Placeholder_Icon);
            }
        };
        rednaocurrency.prototype.TextChanged = function () {
            var text = this.GetUnFormattedAmount(this.JQueryElement.find('.redNaoInputText').val());
            this.JQueryElement.find('.redNaoInputText').val(this.GetFormattedAmount(text));
            this.FirePropertyChanged();
        };
        rednaocurrency.prototype.GetFormattedAmount = function (amount) {
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
        rednaocurrency.prototype.GetUnFormattedAmount = function (text) {
            while (text.indexOf(this.Options.ThousandSeparator) > 0) {
                text = text.replace(this.Options.ThousandSeparator, '');
            }
            if (this.Options.DecimalSeparator != '')
                text = text.replace(this.Options.DecimalSeparator, '.');
            text = text.replace(this.Options.CurrencySymbol, '');
            var val = parseFloat(text);
            if (isNaN(val))
                return 0;
            return val;
        };
        return rednaocurrency;
    }(sfFormElementBase));
    SmartFormsFields.rednaocurrency = rednaocurrency;
})(SmartFormsFields || (SmartFormsFields = {}));
//# sourceMappingURL=rednaocurrency.js.map