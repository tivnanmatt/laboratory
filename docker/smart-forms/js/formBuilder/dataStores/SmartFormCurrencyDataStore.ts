export class SmartFormCurrencyDataStore {
    public defaultValue: any;
    public label:string;
    public numericalValue:number;
    public OriginalValues:any;
    public value:string;
    constructor(defaultValue: any) {
        this.defaultValue = 'numericalValue';
        if (typeof defaultValue != null)
            this.defaultValue = defaultValue;
    }


    public toString() {
        return this.numericalValue;
    }

    public Clone(){
        return  (Object as any).assign( Object.create( Object.getPrototypeOf(this)), this);
    }

}




