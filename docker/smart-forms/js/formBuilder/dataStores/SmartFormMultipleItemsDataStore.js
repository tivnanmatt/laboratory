"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var SmartFormBasicDataStore_1 = require("./SmartFormBasicDataStore");
var SmartFormMultipleItemsDataStore = /** @class */ (function (_super) {
    __extends(SmartFormMultipleItemsDataStore, _super);
    function SmartFormMultipleItemsDataStore() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SmartFormMultipleItemsDataStore.prototype.toString = function () {
        return RedNaoGetValueFromArray(this.selectedValues);
    };
    SmartFormMultipleItemsDataStore.prototype.IsSelected = function (label) {
        for (var i = 0; i < this.selectedValues.length; i++) {
            if (this.selectedValues[i].label == label)
                return true;
        }
        return false;
    };
    ;
    return SmartFormMultipleItemsDataStore;
}(SmartFormBasicDataStore_1.SmartFormBasicDataStore));
exports.SmartFormMultipleItemsDataStore = SmartFormMultipleItemsDataStore;
//# sourceMappingURL=SmartFormMultipleItemsDataStore.js.map