declare namespace SmartFormsFields {
    class rednaosignature extends sfFormElementBase<any> {
        private IsDynamicField;
        private amount;
        constructor(options: any, serverOptions: any);
        GetValueString(): any;
        SetData(data: any): void;
        IsValid(): boolean;
        ExecuteResize(): void;
        GenerationCompleted($element: any): void;
        GenerateInlineElement(): string;
        CreateProperties(): void;
    }
}
