declare let PropertyContainer: any;
declare namespace SmartFormsFields {
    class rednaogrouppanel extends sfFormElementBase<any> {
        IsFieldContainer: boolean;
        GetValueString(): void;
        private IsDynamicField;
        constructor(options: any, serverOptions: any);
        StoresInformation(): boolean;
        SetData(data: any): void;
        IsValid(): boolean;
        GenerationCompleted($element: any): void;
        GenerateInlineElement(): string;
        CreateProperties(): void;
    }
}
