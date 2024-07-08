function SmartFormsWizardStep(Options)
{
    if(typeof Options=='undefined')
        Options={};
    this.Options=Options;
}

SmartFormsWizardStep.prototype.GetTitle=function()
{
    return 'abcd';
};

SmartFormsWizardStep.prototype.GetContent=function(savedData)
{
    return rnJQuery('<div>abc</div>');
};

SmartFormsWizardStep.prototype.IsValid=function()
{
    return true;
};

SmartFormsWizardStep.prototype.GetWidth=function()
{
    return 600;
};

SmartFormsWizardStep.prototype.GetID=function()
{
    return '';
};

SmartFormsWizardStep.prototype.GetData=function()
{
    return {};
};


