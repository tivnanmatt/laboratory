declare let SmartFormRepeaterDataStore: any;
declare let RedNaoFormulaManagerVar: any;
declare namespace SmartFormsFields {
    class rednaorepeater extends sfFormElementBase<RepeaterOptions> {
        private latestRowId;
        AnimateInsertion: boolean;
        IsFieldContainer: boolean;
        DynamicItems: DynamicRow[];
        GetValueString(): {
            value: any[];
        };
        private IsDynamicField;
        constructor(options: any, serverOptions: any);
        InitializeField(): void;
        GenerationCompleted($element: any): void;
        RefreshElement(propertyName?: string, previousValue?: any): any;
        SetData(data: any): void;
        IsValid(): boolean;
        GetDataStore(): any;
        GenerateInlineElement(): string;
        CreateProperties(): void;
        private AddNewItem;
        private RemoveItem;
        private RefreshRowNumbers;
    }
}
interface DynamicRow {
    RowId: number;
    Fields: sfFormElementBase<any>[];
    $Container: JQuery;
}
interface RepeaterOptions extends FieldOptions {
    NumberOfItems: number;
    ManuallyAdd: 'y' | 'n';
    IncludeItemNumberInLabels: 'y' | 'n';
    FieldOptions: FieldOptions[];
}
