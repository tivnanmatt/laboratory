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
    var rednaorecaptcha2 = /** @class */ (function (_super) {
        __extends(rednaorecaptcha2, _super);
        function rednaorecaptcha2(options, serverOptions) {
            var _this = _super.call(this, options, serverOptions) || this;
            _this.IsDynamicField = true;
            sfFormElementBase.call(_this, options, serverOptions);
            _this.Title = "Title";
            _this.paper = null;
            _this.captchaId = "";
            if (_this.IsNew) {
                _this.Options.ClassName = "rednaorecaptcha2";
                _this.Options.Label = "Captcha";
                _this.Options.SiteKey = "";
                _this.ServerOptions.SecretKey = "";
            }
            _this.Options.Id = "captcha2";
            _this.Id = "captcha2";
            _this.RecaptchaAlreadyLoaded = false;
            return _this;
        }
        rednaorecaptcha2.prototype.SetData = function (data) {
        };
        rednaorecaptcha2.prototype.CreateProperties = function () {
            this.Properties.push(new SimpleTextProperty(this, this.Options, "Label", "Label", { ManipulatorType: 'basic' }));
            this.Properties.push(new SimpleTextProperty(this, this.Options, "SiteKey", "Site Key", {
                ManipulatorType: 'basic',
                'Tooltip': {
                    Text: 'Please check tutorial to know how to generate these keys: <a target="_blank" href="https://smartforms.rednao.com/configuring-recaptcha-2">https://smartforms.rednao.com/configuring-recaptcha-2</a>',
                    HideDelay: 3000
                }
            }));
            this.Properties.push(new SimpleTextProperty(this, this.ServerOptions, "SecretKey", "Secret Key", {
                ManipulatorType: 'basic',
                Tooltip: {
                    Text: 'Please check tutorial to know how to generate these keys: <a target="_blank" href="https://smartforms.rednao.com/configuring-recaptcha-2">https://smartforms.rednao.com/configuring-recaptcha-2</a>',
                    HideDelay: 3000
                }
            }));
        };
        ;
        rednaorecaptcha2.prototype.GenerateInlineElement = function () {
            var html = '';
            if (this.Options.SiteKey == '') {
                html = '<div class="rednao_label_container col-sm-3"><label class="rednao_control_label" >' + this.Options.Label + '</label></div>\
            <div class="redNaoControls col-sm-9 smartFormsSlider">To use captcha you need to configure a site key and secret key <a target="_blank" href="https://smartforms.rednao.com/?p=3822&preview=true">Learn how to get them here (its free and you can get them in less than 1 minute)</a></div>';
            }
            else {
                html = '<div class="rednao_label_container col-sm-3"><label class="rednao_control_label" >' + this.Options.Label + '</label></div>\
            <div class="redNaoControls col-sm-9 smartFormsSlider"></div>';
            }
            return html;
        };
        ;
        //used in smart forms
        //noinspection JSUnusedGlobalSymbols
        rednaorecaptcha2.prototype.GenerationCompleted = function (jQueryElement) {
            if (jQueryElement.parent().hasClass('component')) {
                jQueryElement.find('.redNaoControls').empty();
                jQueryElement.find('.redNaoControls').append('<img src="' + smartFormsRootPath + 'images/recaptcha2.png"></img>');
                return;
            }
            if (this.Options.SiteKey == '')
                return;
            var self = this;
            this.RecaptchaAlreadyLoaded = false;
            var siteKey = self.Options.SiteKey;
            if (siteKey == "")
                siteKey = "asdfdsaf";
            var callBack = function () {
                var timeOut = setInterval(function () {
                    if (typeof grecaptcha != 'undefined' && typeof grecaptcha.render != 'undefined') {
                        jQueryElement = self.JQueryElement; //this is needed because the jqueryelement parameter my not be the one that is shown in the form when the library finished loading
                        if (self.RecaptchaAlreadyLoaded) {
                            clearInterval(timeOut);
                            return;
                        }
                        jQueryElement.find('#rc2' + self.Id).remove();
                        var $recaptchaControl = rnJQuery('<div id="rc2' + self.Id + '"></div>');
                        if (smartFormsDesignMode)
                            $recaptchaControl.css('pointer-events', 'none');
                        jQueryElement.find('.redNaoControls').append($recaptchaControl);
                        self.RecaptchaAlreadyLoaded = true;
                        clearInterval(timeOut);
                        self.captchaId = grecaptcha.render($recaptchaControl[0], { sitekey: siteKey });
                    }
                }, 10);
            };
            callBack = callBack.bind(this);
            var count = 1;
            while (typeof (window['sfRecatchaCallBack' + count]) != 'undefined')
                count++;
            window['sfRecatchaCallBack' + count] = callBack;
            rnJQuery.RNLoadLibrary(['https://www.google.com/recaptcha/api.js?onload=sfRecatchaCallBack' + count], [], callBack);
        };
        rednaorecaptcha2.prototype.interpolate = function (start, end, smilePercentage) {
            return (start + ((end - start) * smilePercentage)).toString();
        };
        //used in smart forms
        //noinspection JSUnusedGlobalSymbols
        rednaorecaptcha2.prototype.GetValueString = function () {
            if (this.IsIgnored())
                return { value: '' };
            return { value: this.JQueryElement.find('.sfSlider').slider('option', 'value') };
        };
        ;
        //used in smart forms
        //noinspection JSUnusedGlobalSymbols
        rednaorecaptcha2.prototype.IsValid = function () {
            var response = grecaptcha.getResponse(this.captchaId) != '';
            if (response == "")
                this.AddError('root', this.InvalidInputMessage);
            else
                this.RemoveError('root');
            return this.InternalIsValid();
        };
        ;
        //used in smart forms
        //noinspection JSUnusedGlobalSymbols
        rednaorecaptcha2.prototype.StoresInformation = function () {
            return false;
        };
        ;
        rednaorecaptcha2.prototype.GetValuePath = function () {
            return 'formData.' + this.Id + '.value';
        };
        ;
        return rednaorecaptcha2;
    }(sfFormElementBase));
    SmartFormsFields.rednaorecaptcha2 = rednaorecaptcha2;
})(SmartFormsFields || (SmartFormsFields = {}));
//# sourceMappingURL=rednaorecaptcha2.js.map