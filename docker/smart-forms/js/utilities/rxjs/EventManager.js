"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="../../typings/sfGlobalTypings.d.ts"/>
var EventManager = /** @class */ (function () {
    function EventManager() {
    }
    EventManager.subscribeEvent = function (eventName) {
        return EventManager.getEvent(eventName);
    };
    EventManager.publishEvent = function (eventName, args) {
        if (args === void 0) { args = {}; }
        EventManager.getEvent(eventName).onNext(args);
    };
    EventManager.getEvent = function (eventName) {
        if (EventManager.eventsDictionsry[eventName] == undefined)
            EventManager.eventsDictionsry[eventName] = new Rx.Subject();
        return EventManager.eventsDictionsry[eventName];
    };
    EventManager.eventsDictionsry = {};
    return EventManager;
}());
exports.EventManager = EventManager;
window.eventManager = new EventManager();
//# sourceMappingURL=EventManager.js.map