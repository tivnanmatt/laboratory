function SmartFormsEmailHelper()
{
    var data={};
    data.formId=formId;
    data.action="rednao_smart_forms_get_form_options";
    data.nonce=smartFormsEmailHelper.save_nonce;
    var self=this;
    rnJQuery.post(ajaxurl,data,function(result){
        try{
            self.ClientOptions=rnJQuery.parseJSON(result);
        }catch(Exception)
        {
            alert('The form information could not be opened, perhaps you opened this page before saving your form first?');
            return;
        }

        self.EmailOptions=self.ClientOptions.formOptions.Emails;
        self.ElementOptions=self.ClientOptions.elementOptions;
        self.CurrentEmail=self.ClientOptions.CurrentEmail;
        if(self.EmailOptions.length<=emailIndex)
        {
            alert('You are trying to troubleshoot an email that does not exist, perhaps you opened this page before saving your form first?');
            return;
        }
        self.StartTest(new SmartFormsEmailHelperBasic());
        //self.StartTest(new SmartFormsEmailHelperUsingYahooAsSender());
        self.InitializeBasicUI();

    });


}

SmartFormsEmailHelper.prototype.InitializeBasicUI=function()
{
    var self=this;
    rnJQuery('.sfPanelEmail').css('display','block');
    rnJQuery('.sfSend').click(function()
    {
        var email=rnJQuery.trim(rnJQuery('.sfEmail').val());
        if(email=='')
        {
            alert('Please set an email to be able to start the test');
            return;
        }

        var reg=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!reg.test(email))
        {
            alert('The email is invalid, please set a valid email address');
            return;
        }

        self.CurrentTest.SendTest(email);

    });

    rnJQuery('.sfTextPassed').click(function()
    {
       self.CurrentTest.TestPassed();
    });

    rnJQuery('.sfTextFailed').click(function()
    {
        self.CurrentTest.TestFailed();
    });
};

SmartFormsEmailHelper.prototype.StartTest=function(emailHelperStep)
{
    this.CurrentTest= emailHelperStep;

    this.CurrentTest.Start({
        EmailOptions:this.EmailOptions,
        ElementOptions:this.ElementOptions,
        CurrentEmail:this.CurrentEmail
    });
};





//-------------------------------------------------------------------------------SmartFormsEmailHelperBase-----------------------------------------------------------

function SmartFormsEmailHelperBase()
{

    rnJQuery('.sfPanelDidYouReceivedIt').slideUp();
}

SmartFormsEmailHelperBase.prototype.Start=function(options)
{
    this.EmailOptions=options.EmailOptions;
    this.ElementOptions=options.ElementOptions;
    this.CurrentEmail=options.CurrentEmail;
    this.PrepareUI();
};

SmartFormsEmailHelperBase.prototype.PrepareUI=function()
{

};

SmartFormsEmailHelperBase.prototype.AddBadge=function(message,status)
{
    var $div=rnJQuery('.sfPanelBadge div[data-step-id="'+this.Id+'"]');
    if($div.length<=0)
    {
        $div=rnJQuery('<div style="display:none;" class="alert" data-step-id="'+this.Id+'" role="alert"></div>');
        rnJQuery('.sfPanelBadge').append($div);
    }
    else{
        $div.removeClass('alert-info');
        $div.removeClass('alert-danger');
        $div.removeClass('alert-success');
    }

    $div.slideUp(function(){
        $div.empty();
        $div.addClass('alert-'+status);
        var icon='';
        if(status=='success')
            icon='glyphicon glyphicon-ok';
        if(status=='danger')
            icon='glyphicon glyphicon-remove';
        $div.append('<h4><span class="'+icon+'"></span> '+message+'</h4>');
        $div.slideDown();

    });


};


SmartFormsEmailHelperBase.prototype.AskEmail=function(message)
{
    rnJQuery('#sfAskEmailText').slideUp(function()
    {
        rnJQuery('#sfAskEmailText').empty();
        rnJQuery('#sfAskEmailText').append(message);
        rnJQuery('#sfAskEmailText').slideDown();
    });

};

SmartFormsEmailHelperBase.prototype.TestPassed=function()
{
    alert('Passed');
};

SmartFormsEmailHelperBase.prototype.TestFailed=function()
{
    alert('Failed');
};

SmartFormsEmailHelperBase.prototype.SendTest=function(to)
{
    var data={};
    data.action="rednao_smart_forms_send_test";
    data.Id=this.Id;
    data.To=to;
    data.Options=this.Options;
    data.nonce=smartFormsEmailHelper.nonce;
    var self=this;
    rnJQuery.RNGetWaitDialog().Show('Executing test');
    rnJQuery.post(ajaxurl,data,function(result){
        rnJQuery.RNGetWaitDialog().Hide();
        result=rnJQuery.parseJSON(result);
        self.TestEnded(result);
        rnJQuery('.sfPanelDidYouReceivedIt').slideDown();

    });
};

SmartFormsEmailHelperBase.prototype.SendFinalMessage=function(message)
{
    rnJQuery('.sfExplanation').empty();
    rnJQuery('.sfExplanation').append(message)
};

SmartFormsEmailHelperBase.prototype.GoToStep=function(step)
{
    sfEmailHelperVar.StartTest(step);
};

//-------------------------------------------------------------------------------SmartFormsEmailHelperBasic-----------------------------------------------------------

function SmartFormsEmailHelperBasic()
{
    this.Id='basic';
    this.Options={};
    SmartFormsEmailHelperBase.call(this);
}
SmartFormsEmailHelperBasic.prototype=Object.create(SmartFormsEmailHelperBase.prototype);

SmartFormsEmailHelperBasic.prototype.TestEnded=function(result)
{

};

SmartFormsEmailHelperBasic.prototype.PrepareUI=function()
{
    this.AddBadge('Checking if your site can send emails','info');
    this.AskEmail('<p >So looks like you have an issue sending emails in your form</p>'+
    '<p>To solve this the first step is to make sure that your server can really send emails so we are going to send a very basic email first</p>');
};

SmartFormsEmailHelperBasic.prototype.TestPassed=function()
{
    this.AddBadge('Your site can send emails','success');
    this.GoToStep(new SmartFormsEmailHelperNormal());
};

SmartFormsEmailHelperBasic.prototype.TestFailed=function()
{
    this.AddBadge('Your site can not send emails','danger');
    this.SendFinalMessage('<h3>Okay, looks like your site is not able of sending emails.</h3>' +
    '<h3>Not everything is lost though, you can still make your site send emails with a plugin like <a href="https://wordpress.org/plugins/easy-wp-smtp/" target="_blank">Easy WP Smtp</a></h3>' +
    '<h3>If you are 100% sure that your site can send emails please contact your email provider (the one that send the email) and ask them if any email was stuck, you can also create a support ticket <a target="_blank" href="https://smartforms.uservoice.com/">here</a> </h3>');

};


//-------------------------------------------------------------------------------SmartFormsEmailHelperNormal-----------------------------------------------------------

function SmartFormsEmailHelperNormal()
{
    this.Id='normal';

    this.Options={};
    SmartFormsEmailHelperBase.call(this);
}
SmartFormsEmailHelperNormal.prototype=Object.create(SmartFormsEmailHelperBase.prototype);

SmartFormsEmailHelperNormal.prototype.TestEnded=function(result)
{

};

SmartFormsEmailHelperNormal.prototype.SendTest=function(to)
{
    var data=this.EmailOptions[emailIndex];
    data.ToEmail=to;
    data.element_options=this.ElementOptions;
    data.action="rednao_smart_form_send_test_email";
    data.nonce=saveNonce;
    data.Id=this.Id;
    var self=this;
    rnJQuery.RNGetWaitDialog().Show('Executing test');
    rnJQuery.post(ajaxurl,data,function(result){
        rnJQuery.RNGetWaitDialog().Hide();
        result=rnJQuery.parseJSON(result);
        self.TestEnded(result);
        rnJQuery('.sfPanelDidYouReceivedIt').slideDown();

    });
};

SmartFormsEmailHelperNormal.prototype.PrepareUI=function()
{
    this.Options.EmailOptions=this.EmailOptions[emailIndex];
    this.AddBadge('Sending full email','info');
    this.AskEmail('<p>Okay, your server is able of sending emails, now i will send the exact same email that you configured in the form just to check if it is still failing or not.</p>');
};

SmartFormsEmailHelperNormal.prototype.TestPassed=function()
{
    this.AddBadge('You received the form email','success');
    this.SendFinalMessage('<h3>Everything looks good =), if you received that last email your form should be able of sending emails, if you just tried with the send test email function i recommend you to try to add the form to a page or post and see if you receive the email that way. </h3>'+
    '<h3>If the problems continue you can also create a support ticket <a target="_blank" href="https://smartforms.uservoice.com/">here.</a> </h3>');

};

SmartFormsEmailHelperNormal.prototype.TestFailed=function()
{
    this.AddBadge('The normal email can not be send','danger');
    this.GoToStep(new SmartFormsEmailHelperNormalToFromOverwritten());

};





//-------------------------------------------------------------------------------SmartFormsEmailHelperNormalToFromOverwritten-----------------------------------------------------------

function SmartFormsEmailHelperNormalToFromOverwritten()
{
    this.Id='overwritten';
    this.Options={};
    SmartFormsEmailHelperBase.call(this);
}
SmartFormsEmailHelperNormalToFromOverwritten.prototype=Object.create(SmartFormsEmailHelperBase.prototype);

SmartFormsEmailHelperNormalToFromOverwritten.prototype.TestEnded=function(result)
{

};

SmartFormsEmailHelperNormalToFromOverwritten.prototype.SendTest=function(to)
{
    var data=this.EmailOptions[emailIndex];
    data.ToEmail=to;
    data.element_options=this.ElementOptions;
    data.FromEmail=this.CurrentEmail;
    data.action="rednao_smart_form_send_test_email";
    data.nonce=saveNonce;
    data.Id=this.Id;
    var self=this;
    rnJQuery.RNGetWaitDialog().Show('Executing test');
    rnJQuery.post(ajaxurl,data,function(result){
        rnJQuery.RNGetWaitDialog().Hide();
        result=rnJQuery.parseJSON(result);
        self.TestEnded(result);
        rnJQuery('.sfPanelDidYouReceivedIt').slideDown();

    });
};

SmartFormsEmailHelperNormalToFromOverwritten.prototype.PrepareUI=function()
{
    this.Options.EmailOptions=this.EmailOptions[emailIndex];
    this.AddBadge('Trying with the default from email address','info');
    this.AskEmail('<p>Okay, one common issue is that you tried to send an email using a from email address different than the one that actually send the email. Some email providers (either the one that receive the email or the one that send it) disallow this ' +
    'and refuse to send or receive emails like these, so now i will try to send the same email but using the email address that i used in the first test (which is '+this.CurrentEmail+')</p>');
};

SmartFormsEmailHelperNormalToFromOverwritten.prototype.TestPassed=function()
{
    this.AddBadge('You received the form email when the from email was overwritten','success');
    this.SendFinalMessage('<h3>Finally! so the problem is that your email does not support custom from email addresses, please instead of using the from email address that you were using use '+this.CurrentEmail+'</h3>');


};

SmartFormsEmailHelperNormalToFromOverwritten.prototype.TestFailed=function()
{
    this.AddBadge('Overwriting the form email address did not work','danger');
    this.GoToStep(new SmartFormsEmailHelperUsingYahooAsSender());

};




//-------------------------------------------------------------------------------SmartFormsEmailHelperUsingYahooAsSender-----------------------------------------------------------

function SmartFormsEmailHelperUsingYahooAsSender()
{
    this.Id='custom';
    this.Options={};
    SmartFormsEmailHelperBase.call(this);
}
SmartFormsEmailHelperUsingYahooAsSender.prototype=Object.create(SmartFormsEmailHelperBase.prototype);

SmartFormsEmailHelperUsingYahooAsSender.prototype.TestEnded=function(result)
{

};

SmartFormsEmailHelperUsingYahooAsSender.prototype.SendTest=function(to)
{
    var data=this.EmailOptions[emailIndex];
    data.ToEmail=to;
    data.element_options=this.ElementOptions;
    data.FromEmail=this.CurrentEmail;
    data.action="rednao_smart_forms_send_test";
    data.FromEmailAddress=rnJQuery('.sfFromEmailAddress').val();
    data.FromEmailPassword=rnJQuery('.sfFromEmailPassword').val();
    data.Id=this.Id;
    data.nonce=smartFormsEmailHelper.nonce;
    var self=this;
    rnJQuery.RNGetWaitDialog().Show('Executing test');
    rnJQuery.post(ajaxurl,data,function(result){
        rnJQuery.RNGetWaitDialog().Hide();
        result=rnJQuery.parseJSON(result);
        if(result.Passed=='n')
        {
            var $dialog= rnJQuery('<h5>An error occurred while trying to send the email, perhaps you did not submitted the right yahoo email or password or you are not using a yahoo account?</h5><h5>This is the detail of the error</h5><textarea style="width:100%;height: 400px;"></textarea>').RNDialog(
                {
                    Buttons:[
                        {Label:'Close',Id:'dialogCancel',Style:'danger',Icon:'glyphicon glyphicon-remove',Action:'cancel'}
                    ]
                }
            );
            $dialog.find('textarea').val(result.Message);
            $dialog.RNDialog('Show');
        }else
        {
            self.TestEnded(result);
            rnJQuery('.sfPanelDidYouReceivedIt').slideDown();
        }

    });
};

SmartFormsEmailHelperUsingYahooAsSender.prototype.PrepareUI=function()
{
    this.Options.EmailOptions=this.EmailOptions[emailIndex];
    this.AddBadge('Using yahoo as the sender','info');
    this.AskEmail('<p>Damn! this is weird, this is the last (and most extreme) test.</p> ' +
    '<p>In this test i will need you to have a yahoo account because we are going to use it as the email sender. I will need you to put the address and password of that account (this information is not going to pass over my website or anything but if ' +
    'you fill more comfortable you could create a quick dispensable yahoo account for this test.</p>');

    rnJQuery('#sfEmailComponents').prepend('<input class="form-control sfFromEmailPassword" type="password" value="" placeholder="Yahoo password" style="padding: 30px;text-align: center;font-size: 30px;" />');
    rnJQuery('#sfEmailComponents').prepend('<input class="form-control sfFromEmailAddress" type="email" value="" placeholder="Yahoo From Email Address" style="padding: 30px;text-align: center;font-size: 30px;" />');

};

SmartFormsEmailHelperUsingYahooAsSender.prototype.TestPassed=function()
{
    this.AddBadge('Using yahoo as the sender worked fine!','success');
    this.SendFinalMessage('<h3>Alright, so it looks like that for some reason your email provider who send the email is refusing to send the email.</h3> <h3>The reason vary a lot, some emails providers does not allow to send email after a given length' +
    ' or some others disallow to send emails to a list of email domains.</h3> <h3>To solve this the best approach is to ask your email provider the reason why the email is not passing or use another email provider to send your emails (with plugins like ' +
    '<a href="https://wordpress.org/plugins/easy-wp-smtp/" target="_blank">Easy WP Smtp</a>)</h3>');
};

SmartFormsEmailHelperUsingYahooAsSender.prototype.TestFailed=function()
{
    this.AddBadge('Even yahoo did not work!','danger');
    this.SendFinalMessage('<h3>Sorry but i could not find the problem using this tool. To solve this please create a support ticket <a target="_blank" href="https://smartforms.uservoice.com/">here.</a></h3>');

};














/*********---------------------------------------------Constructor-------------------------------------------****************************/
var sfEmailHelperVar=null;
rnJQuery(function()
{
    sfEmailHelperVar=new SmartFormsEmailHelper();
});