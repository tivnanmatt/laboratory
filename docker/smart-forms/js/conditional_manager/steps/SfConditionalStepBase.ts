abstract class SfConditionalStepBase <T extends SfConditionalStepOptions>{
    protected FormBuilder: any;
    protected Translations: any;
    protected StepConfiguration: StepConfiguration<T>;
    protected Width: number;
    protected StepList:any[];

    constructor(translations, formBuilder, stepConfiguration,stepList) {
        this.StepList=stepList;
        this.FormBuilder = formBuilder;
        this.Translations = translations;
        this.StepConfiguration = stepConfiguration;
        this.Width = 570;
    }


    public abstract InitializeScreen(container);


    public abstract Exit();


    public abstract Commit();
}
(window as any).SfConditionalStepBase=SfConditionalStepBase;

interface StepConfiguration<T extends SfConditionalStepOptions>{
    IsNew:boolean;
    Label:string;
    Id:number;
    Options:T;
}

interface SfConditionalStepOptions{

}