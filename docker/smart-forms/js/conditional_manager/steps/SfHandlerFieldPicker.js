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
var SfHandlerFieldPicker = /** @class */ (function (_super) {
    __extends(SfHandlerFieldPicker, _super);
    function SfHandlerFieldPicker(translations, formBuilder, stepConfiguration, stepList) {
        return _super.call(this, translations, formBuilder, stepConfiguration, stepList) || this;
    }
    SfHandlerFieldPicker.prototype.InitializeScreen = function (container) {
        this.FormBuilder.Disable();
        container.css('text-align', 'left');
        container.css('padding-left', '5px');
        container.css('padding-right', '5px');
        var jQueryDocument = rnJQuery(document);
        var self = this;
        rnJQuery('#redNaoElementlist').on("click.FieldPicker", '.rednao-control-group', function (e) {
            e.stopPropagation();
            self.FormElementClicked(rnJQuery(this));
        });
        rnJQuery('#sfMainContainer').append('<div class="smartFormsSlider smartFormsFieldPickerOverlay"><div class="ui-widget-overlay" style="z-index: 1001;width:' + jQueryDocument.width() + 'px;height:' + jQueryDocument.height() + '" ></div></div>');
        rnJQuery('.rednaoformbuilder').addClass('smartFormsFieldPick');
        var pickerInterface = rnJQuery('<div class="fieldPickContainer" style="margin:10px;"></div>');
        var options = "";
        var selectedFields = [];
        if (!this.StepConfiguration.IsNew)
            selectedFields = this.StepConfiguration.Options.AffectedItems;
        for (var i = 0; i < this.FormBuilder.RedNaoFormElements.length; i++) {
            options += '<option ' + (selectedFields.indexOf(this.FormBuilder.RedNaoFormElements[i].Options.Id) >= 0 ? 'selected="selected"' : '') + '  value="' + this.FormBuilder.RedNaoFormElements[i].Options.Id + '">' + this.FormBuilder.RedNaoFormElements[i].GetFriendlyName() + '</option>';
            if (this.FormBuilder.RedNaoFormElements[i].Options.ClassName == 'rednaorepeater') {
                var repeaterLabel = this.FormBuilder.RedNaoFormElements[i].Options.Label;
                var repeaterId = this.FormBuilder.RedNaoFormElements[i].Options.Id;
                for (var _i = 0, _a = this.FormBuilder.RedNaoFormElements[i].Fields; _i < _a.length; _i++) {
                    var field = _a[_i];
                    var fieldId = repeaterId + '.' + field.Options.Id;
                    options += '<option ' + (selectedFields.indexOf(fieldId) >= 0 ? 'selected="selected"' : '') + '  value="' + fieldId + '">' + field.Options.Label + '</option>';
                }
            }
        }
        this.Select = rnJQuery('<select size="margin-left:10px;" multiple="multiple" id="redNaoFieldPicked" style="width:100%">' + options + '</select>');
        pickerInterface.append(this.Select);
        this.Select.select2({
            allowClear: true
        }).on("change", function () {
            self.SelectChanged();
        });
        container.append('<h2 style="text-align: left">' + this.Translations[this.StepConfiguration.Label] + '</h2>');
        container.append(pickerInterface);
    };
    ;
    SfHandlerFieldPicker.prototype.Exit = function () {
        this.FormBuilder.Enable();
        rnJQuery('#redNaoElementlist').off("click.FieldPicker");
        rnJQuery('.fieldPickerSelected').removeClass('fieldPickerSelected');
        rnJQuery('.rednaoformbuilder').removeClass('smartFormsFieldPick');
        rnJQuery('.smartFormsFieldPickerOverlay').remove();
    };
    ;
    SfHandlerFieldPicker.prototype.Commit = function () {
        var selectedValues = this.Select.select2('val');
        if (selectedValues.length == 0) {
            alert(this.Translations["SelectAtLeastOneField"]);
            return false;
        }
        this.StepConfiguration.Options.AffectedItems = selectedValues;
        return true;
    };
    ;
    SfHandlerFieldPicker.prototype.FormElementClicked = function (elementClickedJQuery) {
        var fieldId = this.FormBuilder.GetFormElementByContainer(elementClickedJQuery).Id;
        for (var i = 0; i < this.FormBuilder.RedNaoFormElements.length; i++) {
            if (this.FormBuilder.RedNaoFormElements[i].Options.ClassName == 'rednaorepeater') {
                var repeaterId = this.FormBuilder.RedNaoFormElements[i].Options.Id;
                for (var _i = 0, _a = this.FormBuilder.RedNaoFormElements[i].Fields; _i < _a.length; _i++) {
                    var field = _a[_i];
                    var repeaterFieldId = repeaterId + '.' + field.Options.Id;
                    if (field.Options.Id == fieldId) {
                        fieldId = repeaterFieldId;
                    }
                }
            }
        }
        var currentlySelectedValues = this.Select.select2('val');
        var alreadyHasRepeaterItems = currentlySelectedValues.some(function (x) { return x.indexOf('.') >= 0; });
        if ((fieldId.indexOf('.') >= 0 && currentlySelectedValues.some(function (x) { return x.indexOf('.') == -1; })) ||
            (fieldId.indexOf('.') == -1 && currentlySelectedValues.some(function (x) { return x.indexOf('.') >= 0; }))) {
            alert('You can\'t mix repeater fields with non repeater fields in a condition');
            return;
        }
        if (fieldId.indexOf('.') >= 0) {
            var repeaterId = fieldId.split('.')[0];
            for (var _b = 0, currentlySelectedValues_1 = currentlySelectedValues; _b < currentlySelectedValues_1.length; _b++) {
                var selectedFields_1 = currentlySelectedValues_1[_b];
                var currentRepeaterId = selectedFields_1.split('.')[0];
                if (currentRepeaterId != repeaterId) {
                    alert('You can\'t add fields of different repeaters in the same condition');
                    return;
                }
            }
        }
        var selectedFields = this.Select.select2('val');
        if (rnJQuery.inArray(fieldId, selectedFields) >= 0)
            return;
        selectedFields.push(fieldId);
        this.Select.select2('val', selectedFields).change();
    };
    ;
    SfHandlerFieldPicker.prototype.SelectChanged = function () {
        var selectedFields = this.Select.select2('val');
        rnJQuery('.fieldPickerSelected').removeClass('fieldPickerSelected');
        for (var i = 0; i < selectedFields.length; i++) {
            rnJQuery('#' + selectedFields[i]).addClass('fieldPickerSelected');
        }
    };
    ;
    return SfHandlerFieldPicker;
}(SfConditionalStepBase));
window.SfHandlerFieldPicker = SfHandlerFieldPicker;
//# sourceMappingURL=SfHandlerFieldPicker.js.map