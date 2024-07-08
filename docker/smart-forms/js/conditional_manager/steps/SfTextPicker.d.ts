declare class SfTextPicker extends SfConditionalStepBase<any> {
    protected Title: JQuery;
    constructor(translations: any, formBuilder: any, stepConfiguration: any, stepList: any);
    InitializeScreen(container: any): void;
    Exit(): void;
    Commit(): boolean;
}
