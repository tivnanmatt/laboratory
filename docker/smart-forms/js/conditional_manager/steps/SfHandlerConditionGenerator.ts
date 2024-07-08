class SfHandlerConditionGenerator extends SfConditionalStepBase<any> {
    private ConditionDesigner: SFConditionDesigner;

    constructor(translations, formBuilder, stepConfiguration,stepList) {
        super(translations, formBuilder, stepConfiguration,stepList);

        this.StepConfiguration.Options.IsNew = this.StepConfiguration.IsNew;
        this.ConditionDesigner = new SFConditionDesigner(this.FormBuilder.RedNaoFormElements, this.StepConfiguration.Options);
        this.Width = 570;
    }


    public InitializeScreen(container) {
        container.css('padding-left', '5px');
        container.css('padding-right', '5px');

        container.append('<h2 style="text-align: left">' + this.Translations[this.StepConfiguration.Label] + '</h2>');
        this.ConditionDesigner.SetAllowJavascript();
        container.append(this.ConditionDesigner.GetDesigner());
    };


    public Exit() {

    };

    public Commit() {
        if (this.ConditionDesigner.IsValid()) {
            let data = this.ConditionDesigner.GetData();
            this.StepConfiguration.Options.Conditions = data.Conditions;
            this.StepConfiguration.Options.CompiledCondition = data.CompiledCondition;
            return true;
        }
        return false;
    };
}

(window as any).SfHandlerConditionGenerator=SfHandlerConditionGenerator;