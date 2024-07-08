/// <reference path="../../typings/sfGlobalTypings.d.ts" />
export declare class EventManager {
    private static eventsDictionsry;
    static subscribeEvent(eventName: string): Rx.Subject<any>;
    static publishEvent(eventName: string, args?: any): void;
    static getEvent(eventName: string): Rx.Subject<any>;
}
