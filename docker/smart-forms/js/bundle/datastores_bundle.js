/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./formBuilder/dataStores/SmartFormsDataStoreBootstrap.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./formBuilder/dataStores/SmartFormBasicDataStore.ts":
/*!***********************************************************!*\
  !*** ./formBuilder/dataStores/SmartFormBasicDataStore.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),

/***/ "./formBuilder/dataStores/SmartFormCurrencyDataStore.ts":
/*!**************************************************************!*\
  !*** ./formBuilder/dataStores/SmartFormCurrencyDataStore.ts ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),

/***/ "./formBuilder/dataStores/SmartFormDateDataStore.ts":
/*!**********************************************************!*\
  !*** ./formBuilder/dataStores/SmartFormDateDataStore.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var SmartFormBasicDataStore_1 = __webpack_require__(/*! ./SmartFormBasicDataStore */ "./formBuilder/dataStores/SmartFormBasicDataStore.ts");
var SmartFormDateDataStore = /** @class */ (function (_super) {
    __extends(SmartFormDateDataStore, _super);
    function SmartFormDateDataStore() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SmartFormDateDataStore.prototype.GetTime = function () {
        return this.numericalValue;
    };
    SmartFormDateDataStore.prototype.AddDays = function (daysToAdd) {
        var clonedObject = this.Clone();
        if (clonedObject.numericalValue > 0) {
            var date = new Date(clonedObject.numericalValue);
            date.setDate(date.getDate() + daysToAdd);
            clonedObject.UpdateDate(date.getTime());
        }
        return clonedObject;
    };
    SmartFormDateDataStore.prototype.AddMonths = function (monthsToAdd) {
        var clonedObject = this.Clone();
        if (clonedObject.numericalValue > 0) {
            var date = new Date(clonedObject.numericalValue);
            date.setMonth(date.getMonth() + monthsToAdd);
            clonedObject.UpdateDate(date.getTime());
        }
        return clonedObject;
    };
    SmartFormDateDataStore.prototype.AddYears = function (yearsToAdd) {
        var clonedObject = this.Clone();
        if (clonedObject.numericalValue > 0) {
            var date = new Date(clonedObject.numericalValue);
            date.setFullYear(date.getFullYear() + yearsToAdd);
            clonedObject.UpdateDate(date.getTime());
        }
        return clonedObject;
    };
    SmartFormDateDataStore.prototype.GetDayOfWeek = function () {
        return new Date(this.numericalValue).getDay();
    };
    SmartFormDateDataStore.prototype.IsBetween = function (firstDate, secondDate) {
        firstDate = this.ParseToDate(firstDate);
        secondDate = this.ParseToDate(secondDate);
        var currentDate = this.GetDate();
        if (this.IsValidDate(firstDate) && this.IsValidDate(secondDate) && this.IsValidDate(currentDate))
            return firstDate <= currentDate && secondDate >= currentDate;
        return false;
    };
    SmartFormDateDataStore.prototype.ParseToDate = function (date) {
        if (date == null)
            return null;
        if (typeof date == "string") {
            var datePart = date.split('-');
            if (datePart.length != 3)
                return null;
            return new Date(datePart[0], datePart[1] - 1, datePart[2], 0, 0, 0);
        }
        return null;
    };
    SmartFormDateDataStore.prototype.GetDate = function () {
        return this.ParseToDate(this.value);
    };
    SmartFormDateDataStore.prototype.UpdateDate = function (numericalValue) {
        this.numericalValue = numericalValue;
        var date = new Date(this.numericalValue);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var dateLabel = date.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
        this.label = dateLabel;
        this.value = dateLabel;
        this.OriginalValues.value = dateLabel;
        this.OriginalValues.formattedValue = rnJQuery.datepicker.formatDate(this.OriginalValues.format, date);
    };
    SmartFormDateDataStore.prototype.IsValidDate = function (d) {
        return d instanceof Date && !isNaN(d);
    };
    return SmartFormDateDataStore;
}(SmartFormBasicDataStore_1.SmartFormBasicDataStore));
exports.SmartFormDateDataStore = SmartFormDateDataStore;


/***/ }),

/***/ "./formBuilder/dataStores/SmartFormMultipleItemsDataStore.ts":
/*!*******************************************************************!*\
  !*** ./formBuilder/dataStores/SmartFormMultipleItemsDataStore.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var SmartFormBasicDataStore_1 = __webpack_require__(/*! ./SmartFormBasicDataStore */ "./formBuilder/dataStores/SmartFormBasicDataStore.ts");
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


/***/ }),

/***/ "./formBuilder/dataStores/SmartFormRepeaterDataStore.ts":
/*!**************************************************************!*\
  !*** ./formBuilder/dataStores/SmartFormRepeaterDataStore.ts ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var SmartFormBasicDataStore_1 = __webpack_require__(/*! ./SmartFormBasicDataStore */ "./formBuilder/dataStores/SmartFormBasicDataStore.ts");
var SmartFormRepeaterDataStore = /** @class */ (function (_super) {
    __extends(SmartFormRepeaterDataStore, _super);
    function SmartFormRepeaterDataStore(instance) {
        var _this = _super.call(this, 'value') || this;
        _this.instance = instance;
        _this.rows = [];
        return _this;
    }
    SmartFormRepeaterDataStore.prototype.toString = function () {
        alert('Sorry a repeater field can not be used in formulas like this');
    };
    SmartFormRepeaterDataStore.prototype.Clone = function () {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    };
    SmartFormRepeaterDataStore.prototype.GetCount = function () {
        if (this.instance._ignore)
            return 0;
        if (this.value == 0)
            return 0;
        return this.value.length;
    };
    SmartFormRepeaterDataStore.prototype.GetTotal = function (fieldId) {
        if (this.instance._ignore)
            return 0;
        var data = RedNaoFormulaManagerVar.Data;
        var total = 0;
        for (var i = 0; i < this.value.length; i++) {
            if (typeof data[fieldId + '_row_' + i] != 'undefined')
                total += data[fieldId + '_row_' + i].toString();
        }
        return total;
    };
    SmartFormRepeaterDataStore.prototype.GetField = function (rowIndex, fieldId) {
        if (this.instance._ignore)
            return '';
        if (rowIndex instanceof sfFormElementBase)
            rowIndex = rowIndex.RowIndex;
        if (typeof RedNaoFormulaManagerVar.Data[fieldId + '_row_' + rowIndex] == 'undefined')
            return '';
        else
            return RedNaoFormulaManagerVar.Data[fieldId + '_row_' + rowIndex];
    };
    return SmartFormRepeaterDataStore;
}(SmartFormBasicDataStore_1.SmartFormBasicDataStore));
exports.SmartFormRepeaterDataStore = SmartFormRepeaterDataStore;


/***/ }),

/***/ "./formBuilder/dataStores/SmartFormsDataStoreBootstrap.ts":
/*!****************************************************************!*\
  !*** ./formBuilder/dataStores/SmartFormsDataStoreBootstrap.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
window.SmartFormMultipleItemsDataStore = __webpack_require__(/*! ./SmartFormMultipleItemsDataStore */ "./formBuilder/dataStores/SmartFormMultipleItemsDataStore.ts").SmartFormMultipleItemsDataStore;
window.SmartFormBasicDataStore = __webpack_require__(/*! ./SmartFormBasicDataStore */ "./formBuilder/dataStores/SmartFormBasicDataStore.ts").SmartFormBasicDataStore;
window.SmartFormDateDataStore = __webpack_require__(/*! ./SmartFormDateDataStore */ "./formBuilder/dataStores/SmartFormDateDataStore.ts").SmartFormDateDataStore;
window.SmartFormRepeaterDataStore = __webpack_require__(/*! ./SmartFormRepeaterDataStore */ "./formBuilder/dataStores/SmartFormRepeaterDataStore.ts").SmartFormRepeaterDataStore;
window.SmartFormCurrencyDataStore = __webpack_require__(/*! ./SmartFormCurrencyDataStore */ "./formBuilder/dataStores/SmartFormCurrencyDataStore.ts").SmartFormCurrencyDataStore;


/***/ })

/******/ });
//# sourceMappingURL=datastores_bundle.js.map