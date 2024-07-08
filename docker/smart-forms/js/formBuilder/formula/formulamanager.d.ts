declare class RedNaoFormulaManager {
    Formulas: RedNaoFormula[];
    Data: any;
    constructor();
    private CalculateFormula;
    PropertyChanged(data: any): void;
    ExecuteAfterComplete(actionData: any, type: 'hide' | 'show'): void;
    SetFormulaValue(field: any, fieldName: any, data: any): void;
    UpdateFormulaFieldsIfNeeded(fieldName: any, subField: any): void;
    RefreshAllFormulas: () => void;
    AddFormula(formElement: any, formula: any): void;
}
declare let RedNaoPathExists: any;
