declare class SfShowConditionalHandler extends SfConditionalHandlerBase {
    Fields: any;
    FormElements: sfFormElementBase<any>[];
    constructor(options: any);
    ExecutingPromise(): void;
    GetConditionalSteps(): ({
        Type: string;
        Label: string;
        Options: any;
        Id: number;
    } | {
        Type: string;
        Label: string;
        Options: any;
        Id?: undefined;
    })[];
    Initialize(form: any, data: any): void;
    HideFields(): void;
    GetFieldIds(): any;
    GetFormElements(): sfFormElementBase<any>[];
    ExecuteTrueAction(index?: number): void;
    ExecuteFalseAction(form: any, index?: number): void;
    GetRepeaterElements(index: number): any[];
}
