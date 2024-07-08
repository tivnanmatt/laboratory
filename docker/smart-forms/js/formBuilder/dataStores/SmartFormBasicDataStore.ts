export class SmartFormBasicDataStore {
    public defaultValue: any;
    public label:string;
    public numericalValue:number;
    public OriginalValues:any;
    public value:string;
    constructor(defaultValue: any) {
        this.defaultValue = 'value';
        if (typeof defaultValue != null)
            this.defaultValue = defaultValue;
    }


    public toString() {
        return this[this.defaultValue];
    }

    public Clone(){
        return  (Object as any).assign( Object.create( Object.getPrototypeOf(this)), this);
    }

}




