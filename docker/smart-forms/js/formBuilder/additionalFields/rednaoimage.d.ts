declare namespace SmartFormsFields {
    class rednaoimage extends sfFormElementBase<any> {
        GetValueString(): void;
        private IsDynamicField;
        constructor(options: any, serverOptions: any);
        StoresInformation(): boolean;
        HandleRefresh(propertyName: string, previousValue: any): boolean;
        SetData(data: any): void;
        IsValid(): boolean;
        GenerationCompleted($element: any): void;
        GenerateInlineElement(): string;
        CreateProperties(): void;
    }
}
