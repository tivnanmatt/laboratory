import {SmartFormBasicDataStore} from "./SmartFormBasicDataStore";
declare let rnJQuery:any;
export class SmartFormDateDataStore extends SmartFormBasicDataStore {
    public GetTime(){
        return this.numericalValue;
    }

    public AddDays(daysToAdd:number)
    {
        let clonedObject=this.Clone();
        if(clonedObject.numericalValue>0)
        {
            let date:Date=new Date(clonedObject.numericalValue);
            date.setDate(date.getDate()+daysToAdd);
            clonedObject.UpdateDate(date.getTime());
        }

        return clonedObject;
    }

    public AddMonths(monthsToAdd:number)
    {
        let clonedObject=this.Clone();
        if(clonedObject.numericalValue>0)
        {
            let date:Date=new Date(clonedObject.numericalValue);
            date.setMonth(date.getMonth()+monthsToAdd);
            clonedObject.UpdateDate(date.getTime());
        }

        return clonedObject;
    }

    public AddYears(yearsToAdd:number)
    {
        let clonedObject=this.Clone();
        if(clonedObject.numericalValue>0)
        {
            let date:Date=new Date(clonedObject.numericalValue);
            date.setFullYear(date.getFullYear()+yearsToAdd);
            clonedObject.UpdateDate(date.getTime());
        }

        return clonedObject;
    }

    public GetDayOfWeek(){
        return new Date(this.numericalValue).getDay();
    }

    public IsBetween(firstDate,secondDate){
        firstDate=this.ParseToDate(firstDate);
        secondDate=this.ParseToDate(secondDate);
        
        let currentDate=this.GetDate();
        if(this.IsValidDate(firstDate)&&this.IsValidDate(secondDate)&&this.IsValidDate(currentDate))
            return firstDate<=currentDate&&secondDate>=currentDate;

        return false;

        
    }

    private ParseToDate(date)
    {
        if(date==null)
            return null;

        if(typeof date=="string")
        {
            let datePart=date.split('-');
            if(datePart.length!=3)
                return null;

            return new Date(datePart[0] as any,(datePart[1] as any)-1 as any,datePart[2] as any,0,0,0);
        }
        
        return null;
    }

    private GetDate(){
        return this.ParseToDate(this.value);
    }



    private UpdateDate(numericalValue:number)
    {
        this.numericalValue=numericalValue;
        let date=new Date(this.numericalValue);

        let month=date.getMonth()+1;
        let day=date.getDate();

        let dateLabel=date.getFullYear()+'-'+(month<10?'0':'')+month+'-'+(day<10?'0':'')+day;
        this.label=dateLabel;
        this.value=dateLabel;
        this.OriginalValues.value=dateLabel;
        this.OriginalValues.formattedValue=(rnJQuery as any).datepicker.formatDate(this.OriginalValues.format, date);


    }


    private IsValidDate(d: any) {
        return d instanceof Date && !isNaN(d as any);
    }
}


interface Options {
    value: string;
    amount: number;
    label: string;
}

declare let RedNaoGetValueFromArray: any;




