function smartFormGenerator(options){
    this.client_form_options=options.client_form_options;
    this.Extensions=[];
    RedNaoEventManager.Publish('GetClientExtension',{Generator:this,Extensions:this.Extensions});
    this.MultipleStepsManager=null;
    this.RedirectUrl='';
    this.InitializeConditionalLogic();
    this.SetDefaultIfUndefined('InvalidInputMessage','*Please fill all the required fields');
    this.SubmittingThroughIframe=false;

    this.JavascriptCodes=[];
    if(typeof this.client_form_options.JavascriptCode!='undefined')
    {
        if(typeof this.client_form_options.JavascriptCode=='string')
            this.client_form_options.JavaScriptCode=[{
                JavascriptCode:this.client_form_options.JavascriptCode,
                ActionType:'customjs'
            }];
    }

    if(typeof this.client_form_options.ToolTipPosition=='undefined')
        this.client_form_options.ToolTipPosition='none';

    var i;
    for(i=0;i<this.client_form_options.JavascriptCode.length;i++)
    {
        try{
            this.JavascriptCodes.push(eval(this.client_form_options.JavascriptCode[i].JavascriptCode)());

        }catch(exception)
        {

        }
    }

    if(typeof this.client_form_options.Theme!='undefined'&&this.client_form_options.Theme=='material'){
        this.Theme='material';
        rnJQuery.RNLoadLibrary([smartFormsPath+'js/bootstrap/material.min.js'],[smartFormsPath+'css/bootstrap/bootstrap-material-scoped.css'],function(){

        });
    }else
        this.Theme='basic';


    this.form_id=options.form_id;
    this.options=options;
    this.RedNaoFormElements=[];
    this.FormElements=[];
    var elementOptions=options.elements;
    this.client_form_options.DocumentWidth=rnJQuery(window).width();
    for(i=0;i<elementOptions.length;i++)
    {
        elementOptions[i].FormId=this.form_id;
        var element=sfRedNaoCreateFormElementByName(elementOptions[i].ClassName,elementOptions[i]);
        element.FormId=this.form_id;
        element.Generator=this;
        element.InvalidInputMessage=RedNaoEscapeHtml(this.client_form_options.InvalidInputMessage);
        element.ClientOptions=this.client_form_options;
        this.RedNaoFormElements.push(element);
        this.FormElements.push(element);
    }

    for(i=0;i<this.FormElements.length;i++)
    {
        this.FormElements[i].InitializeFieldLinking(this.FormElements);
    }

    this.containerName=options.container;
    if(typeof this.client_form_options.CSS!='undefined')
        this.CreateCSS();
    if(this.client_form_options.redirect_to_cb=="y"&&typeof this.client_form_options.redirect_to=='string')
    {
        this.client_form_options.redirect_to={
            URL:this.client_form_options.redirect_to,
            RCSettings:{
                Redirect:'always',
                ConditionSettings:[]
            }
        }
    }
    this.CreateForm();

}

smartFormGenerator.prototype.GetCurrentData=function()
{
  return RedNaoFormulaManagerVar.Data;
};

smartFormGenerator.prototype.GetFormId=function()
{
    if(typeof this.FormId=='undefined')
        return 0;
    return this.FormId;
};

smartFormGenerator.prototype.CreateCSS=function()
{
    if(SmartFormsIsIE8OrEarlier())
        return;

    var $style=rnJQuery("<style type='text/css'></style>");

    if(this.client_form_options.CSS==null)
        this.client_form_options.CSS='';

    $style.append(this.client_form_options.CSS.replace(/<[^>]*>/g, ''));
    rnJQuery("head").append($style);
};

smartFormGenerator.prototype.InitializeConditionalLogic=function()
{
    if(typeof this.client_form_options.Conditions !='undefined')
    {
        for(var i=0;i<this.client_form_options.Conditions.length;i++)
        {
            var condition=this.client_form_options.Conditions[i];
            this.client_form_options.Conditions[i]=SmartFormsGetConditionalHandlerByType(condition.Type,condition);
        }
    }else
        this.client_form_options.Conditions=[];
};

smartFormGenerator.prototype.SetDefaultIfUndefined=function(propertyName,defaultValue)
{
    if(typeof this.client_form_options[propertyName]=='undefined')
        this.client_form_options[propertyName]=defaultValue;
    if(typeof this.client_form_options.CaptchaVersion=='undefined')
        this.client_form_options.CaptchaVersion='1';
};

smartFormGenerator.prototype.CreateForm=function(){
    SmartFormsModules.ContainerManager.ClearContainer(this.options.form_id);
    var container=this.GetRootContainer();
    container.empty();
    var themeStyle=this.Theme=='material'?'rnbsm':'';
    this.JQueryForm=rnJQuery('<form id="sf'+this.form_id+'" class="form-horizontal '+themeStyle+'" ></form>');
    this.JQueryForm.css('visibility','hidden');
    container.append(this.JQueryForm);

    this.JQueryForm.parent().removeClass('compact').removeClass('exptop').removeClass('expleft');
    var labelLayout='auto';
    if(typeof this.client_form_options.LabelLayout!='undefined')
        labelLayout=this.client_form_options.LabelLayout;
    if(this.JQueryForm.width()<=500)
        this.JQueryForm.parent().addClass('compact');
    if(labelLayout=='top')
        this.JQueryForm.parent().addClass('exptop');
    if(labelLayout=='left')
        this.JQueryForm.parent().addClass('expleft');

    var i;
    for(i=0;i<this.RedNaoFormElements.length;i++)
    {
        this.RedNaoFormElements[i].AppendElementToContainer(this.JQueryForm);
    }
    this.JQueryForm.append('<div class="sfClearFloat"></div>');





    var self=this;
    //if(RedNaoGetValueOrNull(this.client_form_options.Campaign))
      //  this.CreatePayPalHiddenFields();

    this.SubmittingRedNaoDonationForm='n';
    RedNaoEventManager.Publish('FormCreated',{Generator:this});
    this.JQueryForm.submit(function(e){
        if(self.SubmittingRedNaoDonationForm=='y')
        {
            self.SubmittingRedNaoDonationForm='n';
            return;
        }

        if(self.SubmittingThroughIframe==true)
        {
            self.SubmittingThroughIframe=false;
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        self.SaveForm();
    });



    if(typeof this.client_form_options.FormType!='undefined'&&this.client_form_options.FormType=='sec')
    {
        rnJQuery.RNLoadLibrary([smartFormsPath+'js/utilities/fuelux/wizard.js' ,smartFormsPath+'js/multiple_steps/multiple_steps_base.js'],[smartFormsPath+'js/utilities/fuelux/fuelux.css'],function(){
            self.InitializeMultipleSteps();
            self.FormLoaded();
        });
    }else
    {
        this.FormLoaded();
    }

};

smartFormGenerator.prototype.FireExtensionMethod=function(methodName,args)
{
    var result=undefined;
    for(var i=0;i<this.Extensions.length;i++)
    {
        if(typeof this.Extensions[i][methodName]!='undefined')
        {
            var auxResult = this.Extensions[i][methodName](this, args);
            if (typeof auxResult != 'undefined')
                result = auxResult;
        }
    }

    return result;
};

smartFormGenerator.prototype.FormLoaded=function()
{
    this.FireExtensionMethod('BeforeInitializingFieldData');
    var i;
    for(i=0;i<this.RedNaoFormElements.length;i++)
    {
        if(this.RedNaoFormElements[i].StoresInformation())
            RedNaoFormulaManagerVar.SetFormulaValue(this.RedNaoFormElements[i],this.RedNaoFormElements[i].Id,this.RedNaoFormElements[i].GetValueString())
    }

    RedNaoFormulaManagerVar.RefreshAllFormulas();
    if(RedNaoGetValueOrNull(this.client_form_options.Campaign))
        this.CreatePayPalHiddenFields();
    this.ExecuteConditionalLogicInAllFields();
    this.JQueryForm.css('visibility', 'visible');
    try{
        for(i=0;i<this.JavascriptCodes.length;i++)
            this.JavascriptCodes[i].AfterFormLoaded(this);
    }catch(exception)
    {

    }

    RedNaoEventManager.Publish('AfterFormLoaded',{Generator:this});

};

smartFormGenerator.prototype.ExecuteConditionalLogicInAllFields=function()
{
    for(var i=0;i<this.client_form_options.Conditions.length;i++)
    {
        this.client_form_options.Conditions[i].Initialize(this,RedNaoFormulaManagerVar.Data);
    }
};

smartFormGenerator.prototype.InitializeMultipleSteps=function()
{
    this.MultipleStepsManager=new SfMultipleStepsBase(this.client_form_options.SplitSteps,this.JQueryForm,this.FormElements,this);
    this.MultipleStepsManager.Generate();
};

smartFormGenerator.prototype.CreatePayPalHiddenFields=function()
{
    this.PaypalForm=jQuery('<form style="display: none"></form>');
    jQuery(document.body).append(this.PaypalForm);

    if(smartDonationsSandbox=='y')
        this.PaypalForm.attr('action','https://www.sandbox.paypal.com/cgi-bin/webscr');
    else
        this.PaypalForm.attr('action','https://www.paypal.com/cgi-bin/webscr');
    this.PaypalForm.attr('method','POST');
    this.PaypalForm.attr('target','_self');

    var target="_self";
    if(window.self !== window.top)
        target="_parent";
    this.JQueryForm.attr('target',target);

    var type="_donations";
    var options=this.client_form_options;
    if(typeof options.PayPalType!='undefined'&&options.PayPalType=='payment')
        type='_xclick';
    this.PaypalForm.append(' <input type="hidden" name="cmd" class="smartDonationsPaypalCommand" value="'+type+'">\
                <input type="hidden" name="item_name" value="'+options.PayPalDescription+'">\
                <input type="hidden" name="business" value="'+options.PayPalEmail+'">\
                <input type="hidden" name="lc" value="US">                       \
                <input type="hidden" name="no_note" value="0">                    \
                <input type="hidden" name="currency_code" value="'+options.PayPalCurrency+'">             \
                <input type="hidden" name="bn" value="Rednao_SP">\
                <input type="hidden" name="custom" value=type=form&campaign_id='+options.Campaign+'&formId='+this.options.form_id+'>\
                <input type="hidden" name="amount" class="amountToDonate" value="0">\
                <input name="bn" value="Rednao_SP" type="hidden">\
                <input type="hidden" name="notify_url" value="'+smartDonationsRootPath+'ipn/rednao_paypal_ipn.php">'
        );

    if(RedNaoGetValueOrEmpty(this.client_form_options.redirect_to_cb)=="y")
        this.PaypalForm.append('<input type="hidden" name="return" value="">');

};

smartFormGenerator.prototype.GenerationCompleted=function()
{
    var form=this.GetRootContainer().find('form');
    form.addClass('formelements').attr('id','redNaoElementlist');

    for(var i=0;i<this.FormElements.length;i++)
    {
        this.FormElements[i].AppendElementToContainer(form);
    }

    var self=this;
    form.find('.redNaoDonationButton').click(function()
        {

            try{

                self.SaveForm();

            }catch(error)
            {


            }finally{
                //noinspection ReturnInsideFinallyBlockJS
                return false;
            }
        }
    );

};

smartFormGenerator.prototype.GenerateDefaultStyle=function()
{
    this.styles.formelements="width:600px;padding:10px;margin:0px;";
};


smartFormGenerator.prototype.SaveForm=function()
{
    var formValues={};
    var formIsValid=true;
    var amount=0;

    this.GetRootContainer().find('.redNaoValidationMessage').remove();
    this.GetRootContainer().find('.redNaoSubmitButton').removeClass('btn-danger');
    this.GetRootContainer().find('.redNaoInputText,.redNaoRealCheckBox,.redNaoInputRadio,.redNaoInputCheckBox,.redNaoSelect,.redNaoTextArea,.redNaoInvalid,.has-error').removeClass('redNaoInvalid').removeClass('has-error');
    var isUsingAFileUploader=false;

    var self=this;
    var afterValidation=function(){
        var firstInvalidField=null;
        for(var i=0;i<self.FormElements.length;i++)
        {
            self.FormElements[i].ClearInvalidStyle();
            if(self.FormElements[i].Options.ClassName=="sfFileUpload"||self.FormElements[i].Options.ClassName=="rednaoimageupload")
                isUsingAFileUploader=true;

            if(self.FormElements[i].Options.ClassName=='rednaorepeater')
            {
                for(var t=0;t<self.FormElements[i].Fields.length;t++)
                {
                    if(self.FormElements[i].Fields[t].Options.ClassName=='sfFileUpload'||self.FormElements[i].Fields[t].Options.ClassName=='rednaoimageupload')
                        isUsingAFileUploader=true;
                }
            }

            if(!self.FormElements[i].IsIgnored()&&!self.FormElements[i].IsValid())
            {
                formIsValid=false;
                if(firstInvalidField==null)
                    firstInvalidField=self.FormElements[i];
                continue;
            }
            if(self.FormElements[i].StoresInformation())
            {
                var value=self.FormElements[i].GetValueString();
                amount+=self.FormElements[i].amount;
                formValues[self.FormElements[i].Id]=value;
            }
        }
        if(!formIsValid)
        {
            //self.GetRootContainer().prepend('<p class="redNaoValidationMessage" style="margin:0;padding: 0; font-style: italic; color:red;font-family:Arial,serif;font-size:12px;">'+RedNaoEscapeHtml(self.client_form_options.InvalidInputMessage)+'</p>');
            self.GetRootContainer().find('.redNaoSubmitButton').addClass('btn-danger');
            self.ScrollTo(firstInvalidField.JQueryElement);
            return;
        }


        if(formValues.length>0)
            formValues=formValues.substr(1);

        try{

            for(i=0;i<self.JavascriptCodes.length;i++)
            {
                if(typeof self.JavascriptCodes[i].BeforeFormSubmit!='undefined'&&(self.JavascriptCodes[i].BeforeFormSubmit(formValues,self.FormElements)==false))
                    return;
            }

        }catch(exception)
        {

        }

        self.ProcessRedirectUrl().then(function(result){

            self.RedirectUrl=result;
            if(RedNaoGetValueOrNull(self.client_form_options.Campaign)){
                if(typeof self.client_form_options.PayPalCondition=='undefined'||typeof self.client_form_options.PayPalCondition.DonationSettings=='undefined'||self.client_form_options.PayPalCondition.DonationSettings.RequestPayment=='always')
                {
                    self.SendToSmartDonations(formValues, isUsingAFileUploader);
                }
                else
                {
                    var calculation = RedNaoEventManager.Publish('CalculateCondition', {
                        Condition: self.client_form_options.PayPalCondition.DonationSettings.ConditionSettings,
                        Values: self.GetCurrentData()
                    });
                    calculation.then(function (result) {
                        if (result)
                            self.SendToSmartDonations(formValues, isUsingAFileUploader);
                        else
                            self.PreSendToSmartForms(formValues, isUsingAFileUploader);
                    });
                }
            }

            else
                self.PreSendToSmartForms(formValues,isUsingAFileUploader);

            try{
                rnJQuery('body, input[type="submit"]').addClass('redNaoWait');
                self.JQueryForm.find('input[type="submit"],.redNaoMSButton').attr('disabled','disabled');
            }catch(exception)
            {

            }
        });


    };

    var args={Generator:this,Promises:[]};
    RedNaoEventManager.Publish('BeforeValidatingForm',args);
    if(args.Promises.length>0)
        Promise.all(args.Promises).then(afterValidation);
    else
        afterValidation();
};

smartFormGenerator.prototype.ScrollTo=function($elementToScrollTo)
{
    var scroll = $elementToScrollTo.offset();
    if (window.pageYOffset>scroll.top)
        rnJQuery('html, body').animate({scrollTop: scroll.top-50}, 200);
};

smartFormGenerator.prototype.PreSendToSmartForms=function(formValues,isUsingAFileUploader)
{
    var handled=this.FireExtensionMethod('BeforeSendingToSmartFormsForm',formValues);
    var self=this;
    if(typeof handled!='undefined'&&handled instanceof Promise)
    {
        RedNaoEventManager.Publish('FormSubmitted',{Generator:self});
        handled.then(function(result){
            if(result)
                self.SendToSmartForms(formValues,isUsingAFileUploader);
            else
                RedNaoEventManager.Publish('FormSubmittedCompleted',{Generator:self});
        });
    }else{
        self.SendToSmartForms(formValues,isUsingAFileUploader);
    }


};

smartFormGenerator.prototype.SendToSmartForms=function(formValues,isUsingAFileUploader)
{

    var data={
        form_id:this.form_id,
        action:"rednao_smart_forms_save_form_values",
        formString:JSON.stringify(formValues),
        requestUrl:document.URL,
        nonce:smartFormsSaveNonce
    };



    if(this.client_form_options.UsesCaptcha=='y')
    {
        if(this.client_form_options.CaptchaVersion=='1')
            data.captcha={
                version:1,
                challenge:this.JQueryForm.find('[name="recaptcha_challenge_field"]').val(),
                response:this.JQueryForm.find('[name="recaptcha_response_field"]').val()
            };
        else{
            var captchaId="";
            for(var i=0;i<this.FormElements.length;i++)
                if(this.FormElements[i].Id=="captcha2")
                    captchaId=this.FormElements[i].captchaId;
            data.captcha={
                version:2,
                response:grecaptcha.getResponse(captchaId)
            }
        }


    }

    if(isUsingAFileUploader)
        this.SendFilesWithForm(data,formValues);
    else
    {
        var self=this;
        //noinspection JSUnusedLocalSymbols
        RedNaoEventManager.Publish('FormSubmitted',{Generator:this});
        rnJQuery.ajax({
            type:'POST',
            url:ajaxurl,
            dataType:"json",
            data:data,
            success:function(result){self.SaveCompleted(result,formValues)},
            error:function(result){
                rnJQuery('body, input[type="submit"]').removeClass('redNaoWait');
                self.JQueryForm.find('input[type="submit"],.redNaoMSButton').removeAttr('disabled');
                alert('An error occurred, please try again later');}
        });
    }
};

smartFormGenerator.prototype.SendFilesWithForm=function(data,formValues)
{
    data=JSON.stringify(data);
    rnJQuery('#sfTemporalIFrame').remove();
    rnJQuery('body').append('<iframe id="sfTemporalIFrame" name="sfTemporalIFrame"></iframe>');
    var self=this;
    RedNaoEventManager.Publish('FormSubmitted',{Generator:this});
    rnJQuery('#sfTemporalIFrame').on('load',function()
    {
        var response;
        if (this.contentDocument) {
            response = this.contentDocument.body.innerText;
        } else {
            response = this.contentWindow.document.body.innerText;
        }

        var regex=/{.*}/g;
        var match=regex.exec(response);
        if(match!=null)
            response=match[0];

        self.SaveCompleted(rnJQuery.parseJSON(response),formValues);
    });
    this.JQueryForm.attr('method','post');
    this.JQueryForm.attr('enctype','multipart/form-data');
    this.JQueryForm.attr('target','sfTemporalIFrame');
    this.JQueryForm.attr('action',ajaxurl);
    var dataField=rnJQuery('<input type="hidden" name="data"/> ');
    dataField.val(data);
    this.JQueryForm.append(dataField);
    this.JQueryForm.append('<input type="hidden" name="action" value="rednao_smart_forms_send_files"/>');
    this.SubmittingThroughIframe=true;
    this.JQueryForm.submit();

};

//noinspection JSUnusedLocalSymbols
smartFormGenerator.prototype.SendToSmartDonations=function(formValues,isUsingAFileUploader)
{
    this.JQueryForm.find('input[name="return"]').val(this.RedirectUrl);
    if(RedNaoPathExists(this.client_form_options,'Formulas.DonationFormula'))
    {
        //noinspection JSUnresolvedVariable
        var formula=new RedNaoFormula(null,this.client_form_options.Formulas.DonationFormula);
        var donationAmount=formula.GetValueFromFormula(RedNaoFormulaManagerVar.Data);
        var self=this;
        if(donationAmount instanceof Promise)
            donationAmount.then(function(result){self.ProcessDonation(formValues,isUsingAFileUploader,result)});
        else
            self.ProcessDonation(formValues,isUsingAFileUploader,donationAmount);



    }



};

smartFormGenerator.prototype.ProcessDonation=function(formValues,isUsingAFileUploader,donationAmount){
    if(donationAmount<=0)
    {
        this.GetRootContainer().prepend('<p class="redNaoValidationMessage" style="margin:0;padding: 0; font-style: italic; color:red;font-family:Arial,serif;font-size:12px;">*The donation amount should be greater than zero</p>');
        return;
    }

    var self=this;


    var data={
        action:"rednao_smart_donations_save_form_values",
        emailToNotify:this.emailToNotify,
        formString:JSON.stringify(formValues)
    };

    var donationFormSaveComplete=function(data){
        if(data.status=="success")
        {
            self.PaypalForm.find('.amountToDonate').val(donationAmount);
            self.PaypalForm.find('input[name=custom]').val(encodeURI('type=form&campaign_id='+self.client_form_options.Campaign+"&formId="+data.randomString+'&sformid='+self.form_id));
            if(self.PaypalForm.find('.redNaoRecurrence').length>0&&self.JQueryForm.find('.redNaoRecurrence').find(':selected').val()!='OT')
            {
                self.PaypalForm.find('.amountToDonate').attr('name','a3');
                self.PaypalForm.find('.smartDonationsPaypalCommand').val('_xclick-subscriptions');
                self.PaypalForm.append('<input type="hidden" class="redNaoRecurrenceField" name="src" value="1"><input type="hidden" class="redNaoRecurrenceField" name="p3" value="1"><input type="hidden" name="t3" value="'+self.JQueryForm.find('.redNaoRecurrence').find(':selected').val()+'">');
            }

debugger;
            self.SubmittingRedNaoDonationForm='y';
            self.PaypalForm.submit();


        }else
        {
            alert("An error occured, please try again");
        }
    };

    RedNaoEventManager.Publish('FormSubmitted',{Generator:this});
    if(isUsingAFileUploader)
    {
        var previousAction=this.JQueryForm.attr('action');
        var previousEncoding=  this.JQueryForm.attr('enctype');
        var previousTarget=  this.JQueryForm.attr('target');
        this.JQueryForm.attr('method','post');
        this.JQueryForm.attr('enctype','multipart/form-data');
        this.JQueryForm.attr('target','sfTemporalIFrame');
        this.JQueryForm.attr('action',ajaxurl);
        this.JQueryForm.append('<input type="hidden" name="action" value="rednao_smart_donations_save_form_values"/>');


        rnJQuery('#sfTemporalIFrame').remove();
        rnJQuery('body').append('<iframe id="sfTemporalIFrame" name="sfTemporalIFrame"></iframe>');
        rnJQuery('#sfTemporalIFrame').on('load',function()
        {
            self.JQueryForm.attr('action',previousAction);
            self.JQueryForm.attr('enctype',previousEncoding);
            self.JQueryForm.attr('target',previousTarget);
            var response;
            if (this.contentDocument) {
                response = this.contentDocument.body.innerHTML;
            } else {
                response = this.contentWindow.document.body.innerHTML;
            }

            try{
                response=JSON.parse(response);
            }catch(e){

            }
            donationFormSaveComplete(response);
        });
        var dataField=rnJQuery('<input type="hidden" name="formString"/> ');
        dataField.val(data.formString);
        this.JQueryForm.append(dataField);

        this.SubmittingThroughIframe=true;
        this.JQueryForm.submit();
    }else
        rnJQuery.post(ajaxurl,data,donationFormSaveComplete,"json");
}

smartFormGenerator.prototype.SaveCompleted=function(result,formValues){
    RedNaoEventManager.Publish('FormSubmittedCompleted',{Generator:this});
    rnJQuery('body, input[type="submit"]').removeClass('redNaoWait');
    this.JQueryForm.find('input[type="submit"],.redNaoMSButton').removeAttr('disabled');
    if(this.RedirectUrl.search('@@formid')>=0)
        this.RedirectUrl=this.RedirectUrl.replace('@@formid',result.insertedValues._formid);

    if(typeof result.AdditionalActions!='undefined')
    {
        for(var i=0;i<result.AdditionalActions.length;i++)
        {
            if(result.AdditionalActions[i].Action=="RedirectTo")
            {
                window.location=result.AdditionalActions[0].Value;
                return;
            }

            if(result.AdditionalActions[i].Action=="ShowMessage")
            {
                alert(result.AdditionalActions[i].Value.Message);
                return;
            }


            var result=RedNaoEventManager.Publish('SubmitAction',{'Action':result.AdditionalActions[i],Generator:this});
            if(result===false)
                return;


        }
    }

    if(typeof result.refreshCaptcha!='undefined'&&result.refreshCaptcha=='y')
    {
        alert(result.message);
        Recaptcha.reload();
        return;
    }

    if(result.success=='y')
        this.FireExtensionMethod('FormSubmissionCompleted');

    if((RedNaoGetValueOrEmpty(this.client_form_options.alert_message_cb)!='y'&&RedNaoGetValueOrEmpty(this.client_form_options.redirect_to_cb)!='y')||result.success=='n')
    {
        alert(result.message);
        if(RedNaoGetValueOrEmpty(this.client_form_options.DontClearForm)!='y')
            this.CreateForm();
        return;
    }

    if(RedNaoGetValueOrEmpty(this.client_form_options.alert_message_cb)=='y')
        alert(this.client_form_options.alert_message);

    if(RedNaoGetValueOrEmpty(this.client_form_options.DontClearForm)!='y')
        this.CreateForm();

    if(RedNaoGetValueOrEmpty(this.client_form_options.redirect_to_cb)=="y")
    {
        this.CreateForm();
        window.location=this.RedirectUrl;
    }


};

smartFormGenerator.prototype.GetUrl=function(redirectOptions,index,formValues){
    var self=this;
    return new Promise(function(resolve){
        if(index>=redirectOptions.length)
            resolve('');



        if(redirectOptions[index].RCSettings.Redirect=='always')
        {
            resolve(redirectOptions[index].URL);
        }else{

            var processCalculation=function(calculation){
                if(calculation)
                {
                    resolve(redirectOptions[index].URL);
                }else{
                    self.GetUrl(redirectOptions,index+1,formValues).then(function(result){resolve(result)});
                }
            };

            var calculation=RedNaoEventManager.Publish('CalculateCondition',{Condition:redirectOptions[index].RCSettings.ConditionSettings ,Values:formValues});
            if(calculation instanceof Promise)
            {
                calculation.then(function(result){
                    processCalculation(result);
                });
            }else
                processCalculation(calculation);

        }



    });

};

smartFormGenerator.prototype.ProcessRedirectUrl=function()
{
    var self=this;
    return new Promise(function(resolve){
        if(self.client_form_options.redirect_to_cb=='n')
            resolve('');
        var redirectOptions=self.client_form_options.redirect_to;
        var formValues=self.GetCurrentData();
        var i;
        var url='';
        var redirectToUse=null;


        self.GetUrl(redirectOptions,0,formValues).then(function(url) {

            var regEx = /{([^}]+)}/g;
            var matches;

            while (matches = regEx.exec(url))
            {
                regEx.lastIndex = 0;
                for (i = 0; i < matches.length; i++)
                {
                    if (matches[i][0] == '{')
                        continue;
                    var value = '';
                    if (typeof formValues[matches[i]] != 'undefined')
                    {
                        value = formValues[matches[i]].label;
                        for (var t = 0; t < self.RedNaoFormElements.length; t++)
                            if (matches[i] == self.RedNaoFormElements[t].Id)
                                switch(self.RedNaoFormElements[t].Options.ClassName){
                                    case 'rednaodatepicker':
                                        value=formValues[matches[i]].value;
                                        break;
                                    case "rednaoaddress":
                                        value=JSON.stringify(formValues[matches[i]].OriginalValues);
                                        break;
                                }

                    }
                    if (matches[i] == '_formid')
                        url = url.replace('{' + matches[i] + '}', '@@formid');
                    else
                        url = url.replace('{' + matches[i] + '}', encodeURIComponent(value));
                }
            }

            resolve(url);
        });
    });
};

smartFormGenerator.prototype.GetRootContainer=function()
{
    return rnJQuery('#'+this.containerName);
};

rnJQuery(function(){
    if( window.smartFormsItemsToLoad)
        for(var i=0;i< window.smartFormsItemsToLoad.length;i++)
            smartFormsLoadForm(window.smartFormsItemsToLoad[i]);
});


var smartFormsLoadedItems=[];

function smartFormsLoadForm(options)
{
    var form=new smartFormGenerator(options);
    smartFormsLoadedItems.push(form);


}