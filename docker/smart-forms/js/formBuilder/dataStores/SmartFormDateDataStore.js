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
//# sourceMappingURL=SmartFormDateDataStore.js.map