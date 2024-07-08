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
    var rednaotimepicker = /** @class */ (function (_super) {
        __extends(rednaotimepicker, _super);
        function rednaotimepicker(options, serverOptions) {
            var _this = _super.call(this, options, serverOptions) || this;
            _this.IsDynamicField = true;
            if (_this.IsNew) {
                _this.Options.ClassName = 'rednaotimepicker';
                _this.Options.Label = "Time";
                _this.Options.MinuteStep = 1;
                _this.Options.MaxTime = 86340000;
                _this.Options.MinTime = 0;
                _this.Options.Value = '';
                _this.Options.Mode = "24hrs";
                _this.Options.CustomCSS = '';
                _this.Options.Icon = { ClassName: '' };
                _this.Options.Placeholder = '';
                _this.Options.ReadOnly = 'n';
                _this.Options.Placeholder_Icon = { ClassName: '', Orientation: '' };
            }
            else {
                _this.SetDefaultIfUndefined('ReadOnly', 'n');
            }
            return _this;
        }
        rednaotimepicker.prototype.GetValueString = function () {
            var $input = this.JQueryElement.find('.rednaotimepickerinput');
            return { value: $input.val(), numericalValue: this.TimeToMilliseconds() };
        };
        rednaotimepicker.prototype.StoresInformation = function () {
            return true;
        };
        rednaotimepicker.prototype.SetData = function (data) {
            this.SetTime(data.numericalValue);
        };
        rednaotimepicker.prototype.IsValid = function () {
            if (this.Options.IsRequired == "y" && this.JQueryElement.find('.rednaotimepickerinput').val() == '') {
                this.JQueryElement.addClass('has-error');
                this.AddError('root', this.InvalidInputMessage);
            }
            else
                this.RemoveError('root');
            return this.InternalIsValid();
        };
        rednaotimepicker.prototype.GenerationCompleted = function ($element) {
            var _this = this;
            var $input = $element.find('input');
            var value;
            if (this.Options.Value == '' || this.Options.Value == '-1')
                value = false;
            var timePickerOptions = {
                appendWidgetTo: '#sf' + this.GetFormId(),
                explicitMode: true,
                snapToStep: true,
                minuteStep: Number(this.Options.MinuteStep),
            };
            if (value == false)
                timePickerOptions.defaultTime = value;
            timePickerOptions.showMeridian = this.Options.Mode != "24hrs";
            $input.timepicker(timePickerOptions);
            if (value != false)
                this.SetTime(this.Options.Value);
            $input.on('focus', function () {
                $input.timepicker('showWidget');
            });
            $input.on('changeTime.timepicker', function (e) {
                var selectedTime = _this.TimeToMilliseconds();
                if (_this.Options.MaxTime < selectedTime)
                    _this.SetTime(_this.Options.MaxTime.toString());
                if (_this.Options.MinTime > selectedTime)
                    _this.SetTime(_this.Options.MinTime.toString());
                _this.FirePropertyChanged();
            });
            if (this.Options.Placeholder_Icon.ClassName != '') {
                this.LoadPlaceHolderIcon(this.JQueryElement.find('.rednaotimepickerinput'), null, null, this.Options.Placeholder_Icon);
            }
        };
        rednaotimepicker.prototype.TimeToMilliseconds = function () {
            var $input = this.JQueryElement.find('.rednaotimepickerinput');
            var milliseconds = 0;
            milliseconds += ($input.data().timepicker.hour + ($input.data().timepicker.meridian == 'PM' ? 12 : 0)) * 60 * 60 * 1000;
            milliseconds += $input.data().timepicker.minute * 60 * 1000;
            milliseconds += $input.data().timepicker.second * 1000;
            return milliseconds;
        };
        rednaotimepicker.prototype.GenerateInlineElement = function () {
            var startOfInput = '';
            var endOfInput = '';
            if (this.Options.Icon.ClassName != '') {
                startOfInput = '<div class="rednao-input-prepend input-group"><span class="redNaoPrepend input-group-addon prefix ' + RedNaoEscapeHtml(this.Options.Icon.ClassName) + ' "></span>';
                endOfInput = '</div>';
            }
            return "<div class=\"rednao_label_container col-sm-3\"><label class=\"rednao_control_label\" for=\"textarea\">" + RedNaoEscapeHtml(this.Options.Label) + "</label></div>\n                        <div class=\"redNaoControls col-sm-9\">\n                        " + startOfInput + "\n                        <input " + (this.Options.ReadOnly == 'y' ? 'disabled="disabled"' : '') + "  type=\"text\" class=\"rednaotimepickerinput form-control input-small\" placeholder=\"" + RedNaoEscapeHtml(this.Options.Placeholder) + "\" />\n                        " + endOfInput + "                      \n                    </div>";
        };
        rednaotimepicker.prototype.CreateProperties = function () {
            this.Properties.push(new PropertyContainer('general', 'General').AddProperties([
                new SimpleTextProperty(this, this.Options, "Label", "Label", { ManipulatorType: 'basic' }),
                new CheckBoxProperty(this, this.Options, "IsRequired", "Required", { ManipulatorType: 'basic' }),
                new TimePickerProperty(this, this.Options, "Value", "Default Value", { ManipulatorType: 'basic' }),
            ]));
            this.Properties.push(new PropertyContainer('icons', 'Icons and Tweaks').AddProperties([
                new SimpleTextProperty(this, this.Options, "Placeholder", "Placeholder", { ManipulatorType: 'basic', IconOptions: { Type: 'leftAndRight' } }),
                new ComboBoxProperty(this, this.Options, 'Mode', "Mode", { ManipulatorType: 'basic' })
                    .AddOption('24hrs', '24hrs')
                    .AddOption('AM/PM', 'AM/PM'),
                new SimpleNumericProperty(this, this.Options, "MinuteStep", "Minute Step", { ManipulatorType: 'basic' }),
                new TimePickerProperty(this, this.Options, "MinTime", "Min Time", { ManipulatorType: 'basic' }),
                new TimePickerProperty(this, this.Options, "MaxTime", "Max Time", { ManipulatorType: 'basic' }),
                new IconProperty(this, this.Options, 'Icon', 'Icon', { ManipulatorType: 'basic' })
            ]));
            this.Properties.push(new PropertyContainer('advanced', 'Advanced').AddProperties([
                new CheckBoxProperty(this, this.Options, "ReadOnly", "Read Only", { ManipulatorType: 'basic' }),
                new IdProperty(this, this.Options),
                new CustomCSSProperty(this, this.Options)
            ]));
        };
        rednaotimepicker.prototype.SetTime = function (value) {
            if (isNaN(Number(value)) || value == '')
                return;
            var milliseconds = parseInt(value);
            this.JQueryElement.find('.rednaotimepickerinput').timepicker('setTime', new Date(new Date().setHours(0, 0, 0, milliseconds)));
        };
        return rednaotimepicker;
    }(sfFormElementBase));
    SmartFormsFields.rednaotimepicker = rednaotimepicker;
})(SmartFormsFields || (SmartFormsFields = {}));
//# sourceMappingURL=rednaotimepicker.js.map