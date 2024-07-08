///<reference path="../../typings/sfGlobalTypings.d.ts"/>
export class EventManager
{
    private static eventsDictionsry:any={};
    public static subscribeEvent(eventName:string):Rx.Subject<any>{
        return EventManager.getEvent(eventName);
    }

    public static publishEvent(eventName:string,args:any={}):void{
        EventManager.getEvent(eventName).onNext(args);

    }

    public static getEvent(eventName:string):Rx.Subject<any>{
        if(EventManager.eventsDictionsry[eventName]==undefined)
            EventManager.eventsDictionsry[eventName]=new Rx.Subject<any>();
        return EventManager.eventsDictionsry[eventName];
    }
}


(window as any).eventManager=new EventManager();