function SmartDonationsIntegration()
{
    this.comboCurrencies=rnJQuery("#smartDonationsCurrencyDropDown");
    this.comboCampaigns=rnJQuery("#redNaoCampaign");

    var self=this;
    this.comboCampaigns.change(function(){
       if(parseInt(self.comboCampaigns.val())>0)
       {
            rnJQuery('.smartDonationsConfigurationInfo').css('display','inline');
           rnJQuery('.sfConditionLogicPayPal').css('display','inline');
           rnJQuery('.smartDonationsConfigurationInfoDesc').css('display','inline');
       }
       else
       {
           rnJQuery('.sfConditionLogicPayPal').css('display','none');
           rnJQuery('.smartDonationsConfigurationInfo').css('display','none');
           rnJQuery('.smartDonationsConfigurationInfoDesc').css('display','none');
       }
    });

    this.SetUpCurrencyCombo();
    this.SetUpCampaignCombo();
    this.SetUpDonationFormulaManager();




    rnJQuery('.sfConditionLogicPayPal').click(function()
    {


        var pop=new SmartFormsPopUpWizard(
            {
                Steps:[new SFPayPalWizardCondition(SmartFormsAddNewVar.FormBuilder.RedNaoFormElements)],
                SavedData:SmartFormsAddNewVar.PayPalCondition,
                OnFinish:function(data){
                    SmartFormsAddNewVar.PayPalCondition=data;
                }
            });
        pop.Show();
    });
}

SmartDonationsIntegration.prototype.SetUpDonationFormulaManager=function()
{
    rnJQuery('#setUpDonationFormulaButton').click(function(){
        RedNaoEventManager.Publish('FormulaButtonClicked',{"FormElement":{"Options":smartFormsIntegrationFormula},"PropertyName":"DonationFormula",AdditionalInformation:{},Image:null})
    });
}

SmartDonationsIntegration.prototype.LoadFormValuesIfAny=function()
{
    if(typeof smartFormClientOptions!='undefined')
    {
        if(RedNaoGetValueOrNull(smartFormClientOptions.Campaign)!=null)
        {
            rnJQuery('#redNaoCampaign').val(smartFormClientOptions.Campaign);
            rnJQuery('#smartDonationsEmail').val(smartFormClientOptions.PayPalEmail);
            rnJQuery('#smartDonationsDescription').val(smartFormClientOptions.PayPalDescription);
            rnJQuery('#smartDonationsCurrencyDropDown').val(smartFormClientOptions.PayPalCurrency);
            rnJQuery('#redNaoCampaign').change();

            if(typeof smartFormClientOptions.PayPalType!='undefined')
                rnJQuery('#redNaoPaypalType').val(smartFormClientOptions.PayPalType);
        }
    }

    if(typeof smartFormsOptions!='undefined')
    {
        if(RedNaoGetValueOrEmpty(smartFormsOptions.RedNaoSendThankYouEmail)=='y')
            rnJQuery('#redNaoSendThankYouEmail').attr('checked','checked');

    }
};


SmartDonationsIntegration.prototype.SetUpCampaignCombo=function()
{
    var data={};
    data.action="rednao_smart_forms_get_campaigns";
    var self=this;
    rnJQuery.post(ajaxurl,data,function(result)
    {
        for(var i=0;i<result.length;i++)
            self.comboCampaigns.append('<option value="'+result[i].campaign_id+'">'+result[i].name+'</option>');

        self.comboCampaigns.val(data[0]);
        self.LoadFormValuesIfAny();
    },"JSON");
}


SmartDonationsIntegration.prototype.SetUpCurrencyCombo=function()
{
    this.payPalCurrencies= new Array("USD","AUD","BRL","GBP","CAD","CZK","DKK","EUR","HKD","HUF","ILS","JPY","MXN","TWD","NZD","NOK","PHP","PLN","SGD","SEK","CHF","THB");

    this.comboCurrencies.empty();
    for(var i=0;i<this.payPalCurrencies.length;i++)
        this.comboCurrencies.append('<option value="'+this.payPalCurrencies[i]+'">'+this.payPalCurrencies[i]+'</option>');

    this.comboCurrencies.val(this.payPalCurrencies[0]);

}


var VarSmartDonationsIntegration=null;
rnJQuery(function(){
    VarSmartDonationsIntegration=new SmartDonationsIntegration();
})