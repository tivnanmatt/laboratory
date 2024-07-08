function SFEmailWizardCondition(formElements,url)
{
    SmartFormsWizardStep.call(this);
    this.FormElements=formElements;
    this.$Select=null;
    this.ConditionDesigner=null;
    this.URL=url;
}
SFEmailWizardCondition.prototype=Object.create(SmartFormsWizardStep.prototype);

SFEmailWizardCondition.prototype.GetTitle=function()
{
    return 'Do you want to send this email only when a condition is meet?';
};

SFEmailWizardCondition.prototype.GetContent=function(savedData)
{
    var $container=rnJQuery('<div style="margin-top:20px;text-align: center;" class="bootstrap-wrapper"></div>');
    var $select=rnJQuery('<div style="width:100%;margin-top:20px;padding-bottom:20px;"><select class="form-control"><option value="always" selected="selected">No, i want to send it always after someone submit the form</option><option value="condition">Yes, send it only when the condition bellow is meet</option></select></div>');
    $container.append($select);

    var conditionSavedOptions={};
    if(savedData!=null)
        conditionSavedOptions=savedData.ConditionSettings;

    this.ConditionDesigner=new SFConditionDesigner(this.FormElements, conditionSavedOptions);
    var $conditionTitle=rnJQuery('<h2 style="margin-top:0px;">Condition</h2>');
    $container.append($conditionTitle);
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
        this.$Select.val(savedData.Use).change();
    return $container;
};

SFEmailWizardCondition.prototype.IsValid=function()
{
    var data={};
    data.Use=this.$Select.val();
    data.Condition={};
    if(data.Use=='condition'&&!this.ConditionDesigner.IsValid())
        return false;
    return true;

};

SFEmailWizardCondition.prototype.GetWidth=function()
{
    return 710;
};


SFEmailWizardCondition.prototype.GetID=function()
{
    return 'Condition';
};

SFEmailWizardCondition.prototype.GetData=function()
{
    return {
        Use:this.$Select.val(),
        ConditionSettings:this.ConditionDesigner.GetData()
    }

};
