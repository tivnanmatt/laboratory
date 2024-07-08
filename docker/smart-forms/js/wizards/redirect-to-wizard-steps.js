function SFRedirectWizardCondition(formElements,url)
{
    SmartFormsWizardStep.call(this);
    this.FormElements=formElements;
    this.$Select=null;
    this.ConditionDesigner=null;
    this.URL=url;
}
SFRedirectWizardCondition.prototype=Object.create(SmartFormsWizardStep.prototype);

SFRedirectWizardCondition.prototype.GetTitle=function()
{
    return 'When do you want to redirect to <a target="_blank" href="'+RedNaoEscapeHtml(this.URL)+'" style="font-size:15px;">'+RedNaoEscapeHtml(this.URL)+'</a>?';
};

SFRedirectWizardCondition.prototype.GetContent=function(savedData)
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
        this.$Select.val(savedData.Redirect).change();
    return $container;
};

SFRedirectWizardCondition.prototype.IsValid=function()
{
    var data={};
    data.Redirect=this.$Select.val();
    data.Condition={};
    if(data.Redirect=='condition'&&!this.ConditionDesigner.IsValid())
        return false;
    return true;

};

SFRedirectWizardCondition.prototype.GetWidth=function()
{
    return 710;
};


SFRedirectWizardCondition.prototype.GetID=function()
{
    return 'RCSettings';
};

SFRedirectWizardCondition.prototype.GetData=function()
{
    return {
        Redirect:this.$Select.val(),
        ConditionSettings:this.ConditionDesigner.GetData()
    }

};
