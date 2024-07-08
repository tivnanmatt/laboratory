"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SmartFormBasicDataStore = /** @class */ (function () {
    function SmartFormBasicDataStore(defaultValue) {
        this.defaultValue = 'value';
        if (typeof defaultValue != null)
            this.defaultValue = defaultValue;
    }
    SmartFormBasicDataStore.prototype.toString = function () {
        return this[this.defaultValue];
    };
    SmartFormBasicDataStore.prototype.Clone = function () {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    };
    return SmartFormBasicDataStore;
}());
exports.SmartFormBasicDataStore = SmartFormBasicDataStore;
//# sourceMappingURL=SmartFormBasicDataStore.js.map