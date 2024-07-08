namespace SmartFormsFields {
    export class rednaorecaptcha2 extends sfFormElementBase<any> {
        public Title: string;
        public paper: any;
        public captchaId: any;
        public ServerOptions: any;
        public RecaptchaAlreadyLoaded: any;
        public IsDynamicField=true;
        SetData(data: any) {
        }


        constructor(options, serverOptions) {
            super(options, serverOptions);
            sfFormElementBase.call(this, options, serverOptions);
            this.Title = "Title";
            this.paper = null;
            this.captchaId = "";
            if (this.IsNew) {
                this.Options.ClassName = "rednaorecaptcha2";
                this.Options.Label = "Captcha";
                this.Options.SiteKey = "";
                this.ServerOptions.SecretKey = ""
            }

            this.Options.Id = "captcha2";
            this.Id = "captcha2";
            this.RecaptchaAlreadyLoaded = false;

        }


        public CreateProperties() {
            this.Properties.push(new SimpleTextProperty(this, this.Options, "Label", "Label", {ManipulatorType: 'basic'}));
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

        public GenerateInlineElement() {
            let html='';
            if(this.Options.SiteKey==''){

                html = '<div class="rednao_label_container col-sm-3"><label class="rednao_control_label" >' + this.Options.Label + '</label></div>\
            <div class="redNaoControls col-sm-9 smartFormsSlider">To use captcha you need to configure a site key and secret key <a target="_blank" href="https://smartforms.rednao.com/?p=3822&preview=true">Learn how to get them here (its free and you can get them in less than 1 minute)</a></div>';
            }
            else
            {
                html = '<div class="rednao_label_container col-sm-3"><label class="rednao_control_label" >' + this.Options.Label + '</label></div>\
            <div class="redNaoControls col-sm-9 smartFormsSlider"></div>';
            }


            return html;
        };


//used in smart forms
//noinspection JSUnusedGlobalSymbols
        public GenerationCompleted(jQueryElement) {

            if (jQueryElement.parent().hasClass('component')) {
                jQueryElement.find('.redNaoControls').empty();
                jQueryElement.find('.redNaoControls').append('<img src="' + smartFormsRootPath + 'images/recaptcha2.png"></img>');
                return;
            }
            if(this.Options.SiteKey=='')
                return;
            var self = this;
            this.RecaptchaAlreadyLoaded = false;
            var siteKey = self.Options.SiteKey;
            if (siteKey == "")
                siteKey = "asdfdsaf";
            let callBack=function () {
                var timeOut = setInterval(function () {
                    if (typeof grecaptcha != 'undefined'&&typeof grecaptcha.render!='undefined' ) {
                        jQueryElement = self.JQueryElement;//this is needed because the jqueryelement parameter my not be the one that is shown in the form when the library finished loading
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
                        self.captchaId = grecaptcha.render($recaptchaControl[0], {sitekey: siteKey});

                    }
                }, 10);

            };
            callBack=callBack.bind(this);
            let count=1;
            while(typeof(window['sfRecatchaCallBack'+count])!='undefined')
                count++;
            window['sfRecatchaCallBack'+count]=callBack;

            (rnJQuery as any).RNLoadLibrary(['https://www.google.com/recaptcha/api.js?onload=sfRecatchaCallBack'+count], [],callBack );

        }


        public interpolate(start, end, smilePercentage) {
            return (start + ((end - start) * smilePercentage)).toString();
        }

//used in smart forms
//noinspection JSUnusedGlobalSymbols
        public GetValueString() {
            if (this.IsIgnored())
                return {value: ''};
            return {value: this.JQueryElement.find('.sfSlider').slider('option', 'value')};

        };

//used in smart forms
//noinspection JSUnusedGlobalSymbols
        public IsValid() {
            var response: any = grecaptcha.getResponse(this.captchaId) != '';
            if (response == "")
                this.AddError('root', this.InvalidInputMessage);
            else
                this.RemoveError('root');
            return this.InternalIsValid();
        };

//used in smart forms
//noinspection JSUnusedGlobalSymbols
        public StoresInformation() {
            return false;
        };

        public GetValuePath() {
            return 'formData.' + this.Id + '.value';
        };

    }
}

declare let grecaptcha:any;

