declare class SfMultipleStepsDesigner extends SfMultipleStepsBase {
    StepDesigner: SfStepDesigner;
    GenerationCompletedCallBack: any;
    constructor(options: any, $container: any, formElements: any);
    InitializeTexts(): void;
    FormCompleted(): boolean;
    ProcessCurrentStep(): any;
    CreateSteps(): void;
    ShowCreateStepPopUp(): void;
    CreateStep(stepName: any, stepPosition: any, stepIcon: any): void;
    MoveStepTo(step: any, stepPosition: any): void;
    EditStep(stepToEdit: any, stepName: any, stepPosition: any, stepIcon: any): void;
    DeleteStep(stepToDelete: any): void;
    AddFormElement(formElement: any, target: any, position?: any): void;
    MoveFormElement(formElement: any, target: any, position?: any): void;
    GetStepById(id: any): StepHeaderData;
    SynchronizeFormElementsAndStepFields(): void;
    GenerationCompleted(): void;
}
declare let RedNaoIconSelector: any;
declare class SfStepDesigner {
    static $Dialog: JQuery;
    $Dialog: JQuery;
    constructor();
    Show(title: any, stepInfo: any, stepIndex: any, callBack: any): void;
    Hide(): void;
}
