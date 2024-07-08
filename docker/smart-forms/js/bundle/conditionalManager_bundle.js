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
/******/ 	return __webpack_require__(__webpack_require__.s = "./conditional_manager/ConditionalManagerBootstrap.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./conditional_manager/ConditionalLogicManager.ts":
/*!********************************************************!*\
  !*** ./conditional_manager/ConditionalLogicManager.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var SfConditionalLogicManager = /** @class */ (function () {
    function SfConditionalLogicManager(formBuilder) {
        this.FormBuilder = formBuilder;
        this.PanelContainer = rnJQuery('#sfPanelContainer');
        this.SettingsPanel = rnJQuery('#formSettingsScrollArea');
        this.ConditionalHandlersListScreen = null;
        this.CurrentLeft = 0;
        this.ConditionIdToSave = -1;
        this.SavedConditionList = rnJQuery('#sfSavedConditionList');
        var self = this;
        this.SavedConditionList.find('#sfAddConditionalLogic').click(function () {
            self.AddNew();
        });
        //noinspection JSUnresolvedVariable
        this.Translations = smartFormsTranslation;
    }
    SfConditionalLogicManager.prototype.AddNew = function () {
        this.GoToConditionalLogicList();
    };
    ;
    SfConditionalLogicManager.prototype.ClearPanelContainer = function () {
        this.ConditionIdToSave = -1;
        this.PanelContainer.find("tr:first > td:gt(0)").remove();
        this.PanelContainer.css('left', 0);
        this.CurrentLeft = 0;
    };
    ;
    SfConditionalLogicManager.prototype.GoToConditionalLogicList = function () {
        this.ConditionalHandlersListScreen = this.CreateConditionalHandlersListScreen();
        this.GoToScreen(this.ConditionalHandlersListScreen);
    };
    ;
    SfConditionalLogicManager.prototype.CreateConditionalHandlersListScreen = function () {
        var handlers = SmartFormsGetConditionalHandlerArray();
        var html = rnJQuery("<div id='sfConditionalList' style='width:570px;'><table style='width: 100%'></table></div>");
        var self = this;
        var table = html.find('table');
        for (var i = 0; i < handlers.length; i++) {
            if (handlers[i].ShouldShow(this.FormBuilder)) {
                var link = this.CreateHandlerItem(handlers[i]);
                table.append(link);
            }
        }
        var buttonContainer = rnJQuery('<div style="width: 100%; margin-top:20px;margin-left: 5px;"></div>');
        buttonContainer.append("<a  style='float:left' class='smartFormsSettingsButton smartFormsPrevious'>" + this.Translations.Previous + "</a>");
        buttonContainer.find('.smartFormsPrevious').click(function () {
            self.GoToRoot();
        });
        html.append(buttonContainer);
        return html;
    };
    ;
    SfConditionalLogicManager.prototype.CreateHandlerItem = function (handler) {
        var link = rnJQuery("<tr><td style='cursor: pointer;text-align: center;'><a style='cursor: pointer;'>" + handler.Label + "</a></td></tr>");
        var self = this;
        link.find('td').click(function () {
            //noinspection JSReferencingMutableVariableFromClosure
            self.HandlerSelected(handler.id);
        });
        return link;
    };
    ;
    SfConditionalLogicManager.prototype.HandlerSelected = function (handlerId) {
        this.ConditionIdToSave = -1;
        this.StartHandlerConfiguration(SmartFormsGetConditionalHandlerByType(handlerId, null), true);
    };
    ;
    SfConditionalLogicManager.prototype.StartHandlerConfiguration = function (handler, isNew) {
        this.SelectedHandler = handler;
        this.HandlerSteps = this.SelectedHandler.GetConditionalSteps();
        if (isNew) {
            for (var i = 0; i < this.HandlerSteps.length; i++)
                this.HandlerSteps[i].IsNew = true;
        }
        this.CurrentStepIndex = -1;
        this.GoToNextStep();
    };
    ;
    SfConditionalLogicManager.prototype.GoToNextStep = function () {
        if (this.CurrentStep != null) {
            if (!this.CurrentStep.Commit())
                return;
            else
                this.CurrentStep.Exit();
            this.CurrentStep.StepConfiguration.IsNew = false;
        }
        if (this.CurrentStepIndex == this.HandlerSteps.length - 1) {
            this.SaveCondition();
            this.GoToRoot();
            return;
        }
        this.CurrentStepIndex++;
        var stepToMoveTo = this.HandlerSteps[this.CurrentStepIndex];
        this.CurrentStep = SfGetConditionalStep(this.FormBuilder, stepToMoveTo, this.HandlerSteps);
        stepToMoveTo.Container = rnJQuery("<div style='box-sizing: border-box; width:" + this.GetPanelWidth() + "px;'></div>");
        this.CurrentStep.InitializeScreen(stepToMoveTo.Container);
        this.AddStepButtons(stepToMoveTo.Container);
        this.GoToScreen(stepToMoveTo.Container);
    };
    ;
    SfConditionalLogicManager.prototype.AddStepButtons = function (container) {
        var buttonContainer = rnJQuery('<div style="width: 100%; margin-top:20px;"></div>');
        buttonContainer.append("<a  style='float:left' class='smartFormsSettingsButton smartFormsPrevious'>" + this.Translations.Previous + "</a>");
        var nextButtonLabel = this.CurrentStepIndex == (this.HandlerSteps.length - 1) ? this.Translations.Finish : this.Translations.Next;
        buttonContainer.append("<a  style='float:right' class='smartFormsSettingsButton smartFormsNext'>" + nextButtonLabel + "</a>");
        var self = this;
        buttonContainer.find('.smartFormsPrevious').click(function () {
            self.GoToPreviousStep();
        });
        buttonContainer.find('.smartFormsNext').click(function () {
            self.GoToNextStep();
        });
        container.append(buttonContainer);
    };
    ;
    SfConditionalLogicManager.prototype.SaveCondition = function () {
        if (this.ConditionIdToSave <= 0)
            this.FormBuilder.Conditions.push(this.SelectedHandler.GetOptionsToSave());
        else {
            for (var i = 0; i < this.FormBuilder.Conditions.length; i++)
                if (this.FormBuilder.Conditions[i].Id == this.ConditionIdToSave)
                    this.FormBuilder.Conditions[i] = this.SelectedHandler.GetOptionsToSave();
        }
    };
    ;
    SfConditionalLogicManager.prototype.GoToRoot = function () {
        this.CurrentStep = null;
        var self = this;
        this.PanelContainer.animate({ 'left': 0 }, {
            complete: function () {
                self.ClearPanelContainer();
                self.FillSavedConditionList();
            }
        });
        this.SettingsPanel.animate({ 'width': this.GetPanelWidth() });
    };
    ;
    SfConditionalLogicManager.prototype.ConditionSelected = function (condition) {
        this.ConditionIdToSave = condition.Id;
        this.StartHandlerConfiguration(SmartFormsGetConditionalHandlerByType(condition.Type, condition), false);
    };
    ;
    SfConditionalLogicManager.prototype.CreateConditionListItem = function (condition) {
        var self = this;
        var conditionJQuery = rnJQuery('<tr><td class="SavedConditionItem"><a style="cursor: pointer;"> ' + RedNaoEscapeHtml(condition.Label) + '</a><img style=" margin-left:5px; cursor: pointer;width:15px;height:15px;" class="deleteCondition" src="' + smartFormsRootPath + 'images/delete.png" title="Delete"></td></tr>');
        conditionJQuery.find('a').click(function () {
            self.ConditionSelected(condition);
        });
        conditionJQuery.find('.deleteCondition').click(function () {
            if (confirm(self.Translations['AreYouSureYouWantToDelete'] + ' ' + condition.Label + '?')) {
                self.FormBuilder.Conditions.splice(self.FormBuilder.Conditions.indexOf(condition), 1);
                conditionJQuery.remove();
            }
        });
        return conditionJQuery;
    };
    ;
    SfConditionalLogicManager.prototype.FillSavedConditionList = function () {
        var self = this;
        this.SavedConditionList.empty();
        for (var i = 0; i < this.FormBuilder.Conditions.length; i++)
            this.SavedConditionList.append(this.CreateConditionListItem(this.FormBuilder.Conditions[i]));
        this.SavedConditionList.append('<tr>' +
            '<td class="SavedConditionItem">' +
            '<img id="cloneFormElement" style="width: 20px;height: 20px;margin-right: 5px;vertical-align: middle;" src="' + smartFormsRootPath + 'images/clone.png" title="Clone"><a id="sfAddConditionalLogic" style="vertical-align: middle;cursor: pointer;">' + this.Translations["AddConditionalLogic"] + '</a>' +
            '</td>' +
            '</tr>');
        this.SavedConditionList.find('#cloneFormElement,#sfAddConditionalLogic').click(function () {
            self.AddNew();
        });
    };
    ;
    SfConditionalLogicManager.prototype.GoToPreviousStep = function () {
        if (this.CurrentStep != null)
            this.CurrentStep.Exit();
        this.CurrentStepIndex--;
        if (this.CurrentStepIndex == -1)
            this.CurrentStep = null;
        else {
            var stepToMoveTo = this.HandlerSteps[this.CurrentStepIndex];
            stepToMoveTo.Container.empty();
            this.CurrentStep = SfGetConditionalStep(this.FormBuilder, stepToMoveTo, this.HandlerSteps);
            this.CurrentStep.InitializeScreen(stepToMoveTo.Container);
            this.AddStepButtons(stepToMoveTo.Container);
        }
        this.CurrentLeft += this.GetPanelWidth();
        var self = this;
        this.PanelContainer.animate({ 'left': this.CurrentLeft }, {
            complete: function () {
                self.PanelContainer.find('tr:first').children().last().remove();
            }
        });
        this.SettingsPanel.animate({ 'width': this.GetPanelWidth() });
    };
    ;
    SfConditionalLogicManager.prototype.GoToScreen = function (screenJQuery) {
        var container = rnJQuery('<td style="vertical-align: top"></td>');
        container.append(screenJQuery);
        this.PanelContainer.find('tr:first').append(container);
        this.CurrentLeft -= this.SettingsPanel.width();
        this.PanelContainer.animate({ 'left': this.CurrentLeft });
        this.SettingsPanel.animate({ 'width': this.GetPanelWidth() });
    };
    ;
    SfConditionalLogicManager.prototype.GetPanelWidth = function () {
        if (this.CurrentStep == null)
            return 570;
        else
            return this.CurrentStep.Width;
    };
    ;
    return SfConditionalLogicManager;
}());
window.SfConditionalLogicManager = SfConditionalLogicManager;


/***/ }),

/***/ "./conditional_manager/ConditionalManagerBootstrap.ts":
/*!************************************************************!*\
  !*** ./conditional_manager/ConditionalManagerBootstrap.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function SfGetConditionalStep(formBuilder, stepConfiguration, stepList) {
    if (stepConfiguration.Type == "SfHandlerFieldPicker")
        return new SfHandlerFieldPicker(smartFormsTranslation, formBuilder, stepConfiguration, stepList);
    if (stepConfiguration.Type == "SfHandlerConditionGenerator")
        return new SfHandlerConditionGenerator(smartFormsTranslation, formBuilder, stepConfiguration, stepList);
    if (stepConfiguration.Type == "SfNamePicker")
        return new SfNamePicker(smartFormsTranslation, formBuilder, stepConfiguration, stepList);
    if (stepConfiguration.Type == "SfTextPicker")
        return new SfTextPicker(smartFormsTranslation, formBuilder, stepConfiguration, stepList);
    if (stepConfiguration.Type == "SfStepPicker")
        return new SfStepPicker(smartFormsTranslation, formBuilder, stepConfiguration, stepList);
    throw 'invalid conditional step';
}
window.SfGetConditionalStep = SfGetConditionalStep;
__webpack_require__(/*! ./ConditionalLogicManager */ "./conditional_manager/ConditionalLogicManager.ts");
__webpack_require__(/*! ./steps/SfConditionalStepBase */ "./conditional_manager/steps/SfConditionalStepBase.ts");
__webpack_require__(/*! ./steps/SfHandlerConditionGenerator */ "./conditional_manager/steps/SfHandlerConditionGenerator.ts");
__webpack_require__(/*! ./steps/SfHandlerFieldPicker */ "./conditional_manager/steps/SfHandlerFieldPicker.ts");
__webpack_require__(/*! ./steps/SfNamePicker */ "./conditional_manager/steps/SfNamePicker.ts");
__webpack_require__(/*! ./steps/SfTextPicker */ "./conditional_manager/steps/SfTextPicker.ts");
__webpack_require__(/*! ./steps/SfStepPicker */ "./conditional_manager/steps/SfStepPicker.ts");


/***/ }),

/***/ "./conditional_manager/steps/SfConditionalStepBase.ts":
/*!************************************************************!*\
  !*** ./conditional_manager/steps/SfConditionalStepBase.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var SfConditionalStepBase = /** @class */ (function () {
    function SfConditionalStepBase(translations, formBuilder, stepConfiguration, stepList) {
        this.StepList = stepList;
        this.FormBuilder = formBuilder;
        this.Translations = translations;
        this.StepConfiguration = stepConfiguration;
        this.Width = 570;
    }
    return SfConditionalStepBase;
}());
window.SfConditionalStepBase = SfConditionalStepBase;


/***/ }),

/***/ "./conditional_manager/steps/SfHandlerConditionGenerator.ts":
/*!******************************************************************!*\
  !*** ./conditional_manager/steps/SfHandlerConditionGenerator.ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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
var SfHandlerConditionGenerator = /** @class */ (function (_super) {
    __extends(SfHandlerConditionGenerator, _super);
    function SfHandlerConditionGenerator(translations, formBuilder, stepConfiguration, stepList) {
        var _this = _super.call(this, translations, formBuilder, stepConfiguration, stepList) || this;
        _this.StepConfiguration.Options.IsNew = _this.StepConfiguration.IsNew;
        _this.ConditionDesigner = new SFConditionDesigner(_this.FormBuilder.RedNaoFormElements, _this.StepConfiguration.Options);
        _this.Width = 570;
        return _this;
    }
    SfHandlerConditionGenerator.prototype.InitializeScreen = function (container) {
        container.css('padding-left', '5px');
        container.css('padding-right', '5px');
        container.append('<h2 style="text-align: left">' + this.Translations[this.StepConfiguration.Label] + '</h2>');
        this.ConditionDesigner.SetAllowJavascript();
        container.append(this.ConditionDesigner.GetDesigner());
    };
    ;
    SfHandlerConditionGenerator.prototype.Exit = function () {
    };
    ;
    SfHandlerConditionGenerator.prototype.Commit = function () {
        if (this.ConditionDesigner.IsValid()) {
            var data = this.ConditionDesigner.GetData();
            this.StepConfiguration.Options.Conditions = data.Conditions;
            this.StepConfiguration.Options.CompiledCondition = data.CompiledCondition;
            return true;
        }
        return false;
    };
    ;
    return SfHandlerConditionGenerator;
}(SfConditionalStepBase));
window.SfHandlerConditionGenerator = SfHandlerConditionGenerator;


/***/ }),

/***/ "./conditional_manager/steps/SfHandlerFieldPicker.ts":
/*!***********************************************************!*\
  !*** ./conditional_manager/steps/SfHandlerFieldPicker.ts ***!
  \***********************************************************/
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


/***/ }),

/***/ "./conditional_manager/steps/SfNamePicker.ts":
/*!***************************************************!*\
  !*** ./conditional_manager/steps/SfNamePicker.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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
var SfNamePicker = /** @class */ (function (_super) {
    __extends(SfNamePicker, _super);
    function SfNamePicker(translations, formBuilder, stepConfiguration, stepList) {
        return _super.call(this, translations, formBuilder, stepConfiguration, stepList) || this;
    }
    SfNamePicker.prototype.InitializeScreen = function (container) {
        container.css('text-align', 'left');
        container.css('padding-left', '5px');
        container.css('padding-right', '5px');
        container.append('<h2 style="text-align: left">' + this.Translations[this.StepConfiguration.Label] + '</h2>');
        var name = this.Translations["MyNewCondition"] + " " + this.StepConfiguration.Id;
        if (!this.StepConfiguration.IsNew) {
            name = this.StepConfiguration.Options.Name;
        }
        this.Title = rnJQuery('<input type="text" style="width: 100%;height: 40px;font-size: 20px;padding: 10px;">');
        this.Title.val(name);
        container.append(this.Title);
    };
    ;
    SfNamePicker.prototype.Exit = function () {
    };
    ;
    SfNamePicker.prototype.Commit = function () {
        if (this.Title.val().trim() == "") {
            alert(this.Translations["TheTitleCantBeEmpty"]);
            return false;
        }
        this.StepConfiguration.Options.Name = this.Title.val();
        return true;
    };
    ;
    return SfNamePicker;
}(SfConditionalStepBase));
window.SfNamePicker = SfNamePicker;


/***/ }),

/***/ "./conditional_manager/steps/SfStepPicker.ts":
/*!***************************************************!*\
  !*** ./conditional_manager/steps/SfStepPicker.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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
var SfStepPicker = /** @class */ (function (_super) {
    __extends(SfStepPicker, _super);
    function SfStepPicker(translations, formBuilder, stepConfiguration, stepList) {
        return _super.call(this, translations, formBuilder, stepConfiguration, stepList) || this;
    }
    SfStepPicker.prototype.InitializeScreen = function (container) {
        this.$container = container;
        container.css('text-align', 'left');
        container.css('padding-left', '5px');
        container.css('padding-right', '5px');
        container.append('<h2 style="text-align: left">' + this.Translations[this.StepConfiguration.Label] + '</h2>');
        var count = 0;
        if (SmartFormsAddNewVar.FormBuilder.MultipleStepsDesigner != null) {
            var _loop_1 = function (step) {
                var checked = '';
                if (!this_1.StepConfiguration.IsNew) {
                    if (this_1.StepConfiguration.Options.StepsToShow.find(function (x) { return x == step.Id; }) != null)
                        checked = 'checked="checked"';
                }
                count++;
                var icon = void 0;
                if (step.Icon == 'def')
                    icon = '<span style="margin-left: 3px" class="badge badge-info">' + count + '</span> ';
                else
                    icon = '<span class="' + step.Icon + '"></span> ';
                container.append("<div class=\"row\" style=\"padding-left:20px;display: flex;vertical-align: middle;align-items: center;\">\n                            <input " + checked + " class=\"stepItem\" type=\"checkbox\" value=\"" + step.Id + "\" style=\"margin:0\"/>\n                            " + icon + "<span style=\"margin-left: 3px;font-size: 15px;\" >" + step.Text + "</span>\n                         </div>");
            };
            var this_1 = this;
            for (var _i = 0, _a = SmartFormsAddNewVar.FormBuilder.MultipleStepsDesigner.Options.Steps; _i < _a.length; _i++) {
                var step = _a[_i];
                _loop_1(step);
            }
        }
        var name = 'Invalid value';
    };
    ;
    SfStepPicker.prototype.Exit = function () {
    };
    ;
    SfStepPicker.prototype.Commit = function () {
        var _this = this;
        this.StepConfiguration.Options.StepsToShow = [];
        this.$container.find('.stepItem:checked').each(function (index, value) {
            _this.StepConfiguration.Options.StepsToShow.push(rnJQuery(value).val());
        });
        if (this.StepConfiguration.Options.StepsToShow.length == 0) {
            alert('Please select at least one step');
            return false;
        }
        return true;
    };
    return SfStepPicker;
}(SfConditionalStepBase));
window.SfStepPicker = SfStepPicker;


/***/ }),

/***/ "./conditional_manager/steps/SfTextPicker.ts":
/*!***************************************************!*\
  !*** ./conditional_manager/steps/SfTextPicker.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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
var SfTextPicker = /** @class */ (function (_super) {
    __extends(SfTextPicker, _super);
    function SfTextPicker(translations, formBuilder, stepConfiguration, stepList) {
        return _super.call(this, translations, formBuilder, stepConfiguration, stepList) || this;
    }
    SfTextPicker.prototype.InitializeScreen = function (container) {
        container.css('text-align', 'left');
        container.css('padding-left', '5px');
        container.css('padding-right', '5px');
        container.append('<h2 style="text-align: left">' + this.Translations[this.StepConfiguration.Label] + '</h2>');
        var name = 'Invalid value';
        if (typeof this.StepConfiguration.Options != 'undefined' && typeof this.StepConfiguration.Options.Text != "undefined")
            name = this.StepConfiguration.Options.Text;
        this.Title = rnJQuery('<input type="text" style="width: 100%;height: 40px;font-size: 20px;padding: 10px;">');
        this.Title.val(name);
        container.append(this.Title);
    };
    ;
    SfTextPicker.prototype.Exit = function () {
    };
    ;
    SfTextPicker.prototype.Commit = function () {
        this.StepConfiguration.Options.Text = this.Title.val();
        return true;
    };
    return SfTextPicker;
}(SfConditionalStepBase));
window.SfTextPicker = SfTextPicker;


/***/ })

/******/ });
//# sourceMappingURL=conditionalManager_bundle.js.map