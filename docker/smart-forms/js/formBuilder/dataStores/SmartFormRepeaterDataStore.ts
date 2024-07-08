import {SmartFormBasicDataStore} from "./SmartFormBasicDataStore";
import rednaorepeater = SmartFormsFields.rednaorepeater;

export class SmartFormRepeaterDataStore extends SmartFormBasicDataStore {
    public defaultValue: any;
    public rows:any[];
    public label:string;
    public numericalValue:number;
    public OriginalValues:any;
    public value:any;
    constructor(public instance:rednaorepeater) {
        super('value');
        this.rows=[];
    }


    public toString() {
        alert('Sorry a repeater field can not be used in formulas like this');
    }

    public Clone(){
        return  (Object as any).assign( Object.create( Object.getPrototypeOf(this)), this);
    }

    public GetCount()
    {
        if(this.instance._ignore)
            return 0;
        if(this.value==0)
            return 0;
        return this.value.length;
    }


    public GetTotal(fieldId:string)
    {
        if(this.instance._ignore)
            return 0;
        let data=RedNaoFormulaManagerVar.Data;
        let total=0;
        for(let i=0;i<this.value.length;i++)
        {
            if(typeof data[fieldId+'_row_'+i]!='undefined')
                total+=data[fieldId+'_row_'+i].toString();
        }
        return total;
    }

    public GetField(rowIndex:any,fieldId:string)
    {
        if(this.instance._ignore)
            return '';
        if(rowIndex instanceof sfFormElementBase)
            rowIndex=rowIndex.RowIndex;

        if(typeof RedNaoFormulaManagerVar.Data[fieldId+'_row_'+rowIndex]=='undefined')
            return '';
        else
            return RedNaoFormulaManagerVar.Data[fieldId+'_row_'+rowIndex];
    }

}



declare let RedNaoFormulaManagerVar:any;
