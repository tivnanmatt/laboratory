declare let SfHandlerFieldPicker:any;
function SfGetConditionalStep(formBuilder,stepConfiguration,stepList)
{
    if(stepConfiguration.Type=="SfHandlerFieldPicker")
        return new SfHandlerFieldPicker(smartFormsTranslation,formBuilder,stepConfiguration,stepList);
    if(stepConfiguration.Type=="SfHandlerConditionGenerator")
        return new SfHandlerConditionGenerator(smartFormsTranslation,formBuilder,stepConfiguration,stepList);
    if(stepConfiguration.Type=="SfNamePicker")
        return new SfNamePicker(smartFormsTranslation,formBuilder,stepConfiguration,stepList);
    if(stepConfiguration.Type=="SfTextPicker")
        return new SfTextPicker(smartFormsTranslation,formBuilder,stepConfiguration,stepList);
    if(stepConfiguration.Type=="SfStepPicker")
        return new SfStepPicker(smartFormsTranslation,formBuilder,stepConfiguration,stepList);
    throw 'invalid conditional step';
}
(window as any).SfGetConditionalStep=SfGetConditionalStep;

require ("./ConditionalLogicManager");
require("./steps/SfConditionalStepBase");
require("./steps/SfHandlerConditionGenerator");
require("./steps/SfHandlerFieldPicker");
require("./steps/SfNamePicker");
require("./steps/SfTextPicker");
require("./steps/SfStepPicker");

declare let smartFormsTranslation;