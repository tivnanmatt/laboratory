declare let RedNaoBasicManipulatorInstance: any;
declare class RedNaoFormula {
    FormElement: sfFormElementBase<any>;
    Formula: any;
    private _remote;
    constructor(formElement: sfFormElementBase<any>, formula: any);
    GetRemote(): SmartFormsRemote;
    FieldUsedInFormula(fieldName: any): boolean;
    UpdateFieldWithValue(value: any): void;
    GetValueFromFormula(values: any): any;
    private ProcessResult;
}
declare function RNFRound(value: any, decimals: any): any;
declare let smartFormsUserName: any;
declare function RNUserName(): any;
declare let smartFormsFirstName: any;
declare function RNFirstName(): any;
declare let smartFormsLastName: any;
declare function RNLastName(): any;
declare let smartFormsEmail: any;
declare function RNEmail(): any;
declare function RNIf(condition: any, trueValue: any, falseValue: any): any;
declare function RNMinutesDiff(timePicker1: any, timePicker2: any): number;
declare function RNDateDiff(date1: any, date2: any): number;
declare class SmartFormsRemote {
    static cache: RemoteCache[];
    lastPromise: any;
    Post(url: string, args: any): Promise<any>;
    Get(url: string, args: any): Promise<any>;
    private Execute;
    private GenerateRequestId;
}
interface RemoteCache {
    Id: string;
    Result: string;
    Pending: any[];
}
declare function RNPMT(rate: any, nper: any, pv: any, fv: any, type: any): number;
declare function RNIPMT(pv: any, pmt: any, rate: any, per: any): number;
declare function RNPPMT(rate: any, per: any, nper: any, pv: any, fv: any, type: any): number;
declare function RNXNPV(rate: any, values: any, dates: any): number;
declare function RNXIRR(values: any, guess: any): any;
declare function RNFV(rate: any, nper: any, pmt: any, pv: any, type: any): any;
