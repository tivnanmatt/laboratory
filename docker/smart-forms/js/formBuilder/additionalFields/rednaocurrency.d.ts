declare let SmartFormCurrencyDataStore: any;
declare namespace SmartFormsFields {
    class rednaocurrency extends sfFormElementBase<any> {
        Title: string;
        private IsDynamicField;
        constructor(options: any, serverOptions: any);
        CreateProperties(): void;
        GenerateInlineElement(): string;
        GetDataStore(): any;
        GetValueString(): {
            value: string;
            numericalValue: number;
        };
        SetData(data: any): void;
        GetValuePath(): string;
        IsValid(): boolean;
        GenerationCompleted(jQueryElement: any): void;
        TextChanged(): void;
        GetFormattedAmount(amount: number): string;
        GetUnFormattedAmount(text: string): number;
    }
}
