"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SmartFormCurrencyDataStore = /** @class */ (function () {
    function SmartFormCurrencyDataStore(defaultValue) {
        this.defaultValue = 'numericalValue';
        if (typeof defaultValue != null)
            this.defaultValue = defaultValue;
    }
    SmartFormCurrencyDataStore.prototype.toString = function () {
        return this.numericalValue;
    };
    SmartFormCurrencyDataStore.prototype.Clone = function () {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    };
    return SmartFormCurrencyDataStore;
}());
exports.SmartFormCurrencyDataStore = SmartFormCurrencyDataStore;
//# sourceMappingURL=SmartFormCurrencyDataStore.js.map