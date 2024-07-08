function SFPayPalWizardCondition(formElements,url)
{
    SmartFormsWizardStep.call(this);
    this.FormElements=formElements;
    this.$Select=null;
    this.ConditionDesigner=null;
    this.URL=url;
}
SFPayPalWizardCondition.prototype=Object.create(SmartFormsWizardStep.prototype);

SFPayPalWizardCondition.prototype.GetTitle=function()
{
    return 'When do you want to request a PayPal donation';
};

SFPayPalWizardCondition.prototype.GetContent=function(savedData)
{
    var $container=rnJQuery('<div style="margin-top:20px;text-align: center;" class="bootstrap-wrapper"></div>');
    var $select=rnJQuery('<div style="width:100%;margin-top:20px;padding-bottom:20px;"><select class="form-control"><option value="always" selected="selected">Always(or by default) after the form was submitted</option><option value="condition">Only when a condition is meet after the form was submitted</option></select></div>');
    $container.append($select);

    var conditionSavedOptions={};
    if(savedData!=null)
        conditionSavedOptions=savedData.ConditionSettings;

    this.ConditionDesigner=new SFConditionDesigner(this.FormElements, conditionSavedOptions);
    var $conditionTitle=rnJQuery('<h2 style="margin-top:0px;">Condition</h2>');
    $container.append($conditionTitle);
    this.ConditionDesigner.SetAllowJavascript();
    $container.append(this.ConditionDesigner.GetDesigner());
    this.ConditionDesigner.GetDesigner().css('display','none');
    $conditionTitle.css('display','none');

    this.$Select=$select.find('select');
    var self=this;
    $select.find('select').change(function()
    {
        if(self.$Select.val()=='condition')
        {
            self.ConditionDesigner.GetDesigner().css('display', 'block');
            $conditionTitle.css('display','block');
        }
        else
        {
            self.ConditionDesigner.GetDesigner().css('display', 'none');
            $conditionTitle.css('display','none');
        }
    });

    if(savedData!=null)
        this.$Select.val(savedData.RequestPayment).change();
    return $container;
};

SFPayPalWizardCondition.prototype.IsValid=function()
{
    var data={};
    data.RequestPayment=this.$Select.val();
    data.Condition={};
    if(data.RequestPayment=='condition'&&!this.ConditionDesigner.IsValid())
        return false;
    return true;

};

SFPayPalWizardCondition.prototype.GetWidth=function()
{
    return 710;
};


SFPayPalWizardCondition.prototype.GetID=function()
{
    return 'DonationSettings';
};

SFPayPalWizardCondition.prototype.GetData=function()
{
    return {
        RequestPayment:this.$Select.val(),
        ConditionSettings:this.ConditionDesigner.GetData()
    }

};
