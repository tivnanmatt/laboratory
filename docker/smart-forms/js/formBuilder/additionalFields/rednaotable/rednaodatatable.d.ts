declare let Handsontable: any;
declare namespace SmartFormsFields {
    class rednaodatatable extends sfFormElementBase<any> {
        IsFieldContainer: boolean;
        dg: any;
        constructor(options: any, serverOptions: any);
        CreateProperties(): void;
        GetValueString(): any;
        SetData(data: any): void;
        IsValid(): boolean;
        GenerationCompleted($element: any): void;
        GenerateInlineElement(): string;
        private RefreshAfterAnimation;
    }
}
