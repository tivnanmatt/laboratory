declare namespace SmartFormsFields {
    class rednaoimagepicker extends sfFormElementBase<any> {
        private IsDynamicField;
        private amount;
        constructor(options: any, serverOptions: any);
        GetValueString(): any;
        SetData(data: any): void;
        IsValid(): boolean;
        GetDataStore(): any;
        GenerationCompleted($element: any): void;
        GenerateInlineElement(): string;
        CreateProperties(): void;
    }
}
