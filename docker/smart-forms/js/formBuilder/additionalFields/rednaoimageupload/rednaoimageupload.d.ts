declare namespace SmartFormsFields {
    class rednaoimageupload extends sfFormElementBase<any> {
        Title: string;
        private IsDynamicField;
        constructor(options: any, serverOptions: any);
        CreateProperties(): void;
        GenerateInlineElement(): string;
        GetDataStore(): any;
        GetValueString(): any[];
        SetData(data: any): void;
        GetValuePath(): string;
        IsValid(): boolean;
        GenerationCompleted(jQueryElement: any): void;
        TextChanged(): void;
        GetFormattedAmount(amount: number): string;
        GetUnFormattedAmount(text: string): number;
        private AppendElement;
        private FileSelected;
    }
}
