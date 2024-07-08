declare class SfMultipleStepsBase {
    $Container: JQuery;
    Options: MultipleStepOptions;
    FormElements: sfFormElementBase<any>[];
    $StepForm: JQuery;
    StepCatalog: any;
    SortedSteps: RunnableStepData[];
    FormGenerator: any;
    $CurrentErrorMessage: any;
    constructor(options: any, $container: any, formElements: any, formGenerator: any);
    Generate(): void;
    MoveToTop(): void;
    FormCompleted(): void;
    ProcessCurrentStep(): Promise<{}>;
    StepIsValid(step: any): Promise<{}>;
    GetCurrentStep(): any;
    GenerationCompleted(): void;
    CreateSteps(): void;
    ProcessStepInfo(): void;
    SortSteps(): void;
    IgnoreStep(stepId: string): void;
    UnIgnoreStep(stepId: string): void;
    RefreshFieldValue(stepId: string): void;
    CreateFields(): void;
    private OnStepChanged;
    private GetNextValidStepIndex;
    private GetPreviousValidStepIndex;
    private SkipNextStepAndMoveForward;
    private SkipPreviousStepAndMoveBackward;
    RefreshNextButtonText(): void;
}
interface MultipleStepOptions {
    CompleteText: string;
    LatestId: number;
    NextText: string;
    PreviousText: string;
    Steps: StepHeaderData[];
}
interface StepHeaderData {
    Icon: string;
    Id: string;
    Index: number;
    Text: string;
}
interface RunnableStepData {
    Index: number;
    Fields: sfFormElementBase<any>[];
    Id: string;
    Text: string;
    IsIgnored: boolean;
}
