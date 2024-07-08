declare class SfStepPicker extends SfConditionalStepBase<SfStepPickerOptions> {
    private $container;
    constructor(translations: any, formBuilder: any, stepConfiguration: any, stepList: any);
    InitializeScreen(container: any): void;
    Exit(): void;
    Commit(): boolean;
}
interface SfStepPickerOptions extends SfConditionalStepOptions {
    StepsToShow: any[];
}
