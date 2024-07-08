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
/******/ 	return __webpack_require__(__webpack_require__.s = "./tutorials2/AddNewTutorial.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./tutorials2/AddNewTutorial.ts":
/*!**************************************!*\
  !*** ./tutorials2/AddNewTutorial.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SmartTutorial_1 = __webpack_require__(/*! ./SmartTutorial/SmartTutorial */ "./tutorials2/SmartTutorial/SmartTutorial.ts");
var HighlightAction_1 = __webpack_require__(/*! ./SmartTutorial/Actions/HighlightAction */ "./tutorials2/SmartTutorial/Actions/HighlightAction.ts");
var Slide_1 = __webpack_require__(/*! ./SmartTutorial/Slide */ "./tutorials2/SmartTutorial/Slide.ts");
var TitleAction_1 = __webpack_require__(/*! ./SmartTutorial/Actions/TitleAction */ "./tutorials2/SmartTutorial/Actions/TitleAction.ts");
var DragAction_1 = __webpack_require__(/*! ./SmartTutorial/Actions/DragAction */ "./tutorials2/SmartTutorial/Actions/DragAction.ts");
var ClickAction_1 = __webpack_require__(/*! ./SmartTutorial/Actions/ClickAction */ "./tutorials2/SmartTutorial/Actions/ClickAction.ts");
var AddNewTutorial = /** @class */ (function () {
    function AddNewTutorial() {
    }
    AddNewTutorial.prototype.Initialize = function (addNewInstance, $container) {
        this.$container = $container;
        this.addNewInstance = addNewInstance;
        /*if(smartFormsShowTutorial=="")
            this.AskIfTutorialIsWanted();
        else*/
        this.OpenForm();
    };
    AddNewTutorial.prototype.OpenForm = function () {
        var _this = this;
        rnJQuery('#rootContentDiv').removeClass('OpHidden');
        rnJQuery('#loadingScreen').velocity({ opacity: 0 }, 800, "easeOutExp", function () { rnJQuery('#loadingScreen').remove(); });
        this.$container.velocity({ opacity: 0 }, 800, "easeOutExp", function () { _this.$container.remove(); });
    };
    AddNewTutorial.prototype.AskIfTutorialIsWanted = function () {
        var _this = this;
        this.$questionContainer = rnJQuery("<div class=\"bootstrap-wrapper\" style=\"position: absolute;top:200px;text-align: center;opacity: 0;font-family: Verdana,serif;font-size: 25px;width:100%;\">                \n                <span><strong>Hello =), </strong> is this your first time using Smart Forms?</span>\n                <div style=\"margin-top:20px;\">\n                    <button style=\"font-size:20px;padding: 10px 30px 10px 30px;\" class=\"btn btn-success\">Yes</button>\n                    <button style=\"font-size:20px;padding: 10px 30px 10px 30px;\"  class=\"btn btn-danger\">No</button>\n                </div>\n            </div>");
        this.$questionContainer.find('.btn-success').click(function () {
            _this.$questionContainer.velocity({ opacity: 0 }, "easeOutExp", function () { _this.$questionContainer.empty(); _this.GenerateSecondQuestion(); });
        });
        this.$questionContainer.find('.btn-danger').click(function () {
            rnJQuery.post(ajaxurl, { action: 'smart_forms_skip_tutorial',nonce:saveNonce });
            _this.OpenForm();
        });
        this.$container.velocity({ opacity: 0 }, 500, "easeInExp", function () {
            _this.$container.remove();
            rnJQuery('#loadingScreen').append(_this.$questionContainer);
            _this.$questionContainer.velocity({ opacity: 1 }, 500, "easeInExp");
        });
    };
    AddNewTutorial.prototype.GenerateSecondQuestion = function () {
        var _this = this;
        var $secondQuestion = rnJQuery("<span><strong>Ah Welcome!</strong> can i give you a quick tutorial of the plugin?</span>\n                                        <div style=\"margin-top:20px;\">\n                                            <button style=\"font-size:20px;padding: 10px 30px 10px 30px;\" class=\"btn btn-success\">Yes, show me</button>\n                                            <button style=\"font-size:20px;padding: 10px 30px 10px 30px;\"  class=\"btn btn-danger\">No, thanks</button>\n                                        </div>\n                                    ");
        this.$questionContainer.append($secondQuestion);
        this.$questionContainer.velocity({ opacity: 1 }, "easeInExp");
        this.$questionContainer.find('.btn-success').click(function () {
            _this.$questionContainer.velocity({ opacity: 0 }, "easeOutExp", function () {
                _this.$questionContainer.empty();
                _this.StartTutorialAccepted();
            });
        });
        this.$questionContainer.find('.btn-danger').click(function () {
            rnJQuery.post(ajaxurl, { action: 'smart_forms_skip_tutorial',nonce:saveNonce });
            _this.OpenForm();
        });
    };
    AddNewTutorial.prototype.StartTutorialAccepted = function () {
        var _this = this;
        this.$questionContainer.append("<span>Alright <strong>Lets Start!</strong></span>");
        this.$questionContainer.velocity({ opacity: 1 }, "easeOutExp", function () {
            setTimeout(function () {
                _this.StartTutorial();
            }, 1000);
        });
    };
    AddNewTutorial.prototype.StartTutorial = function () {
        this.OpenForm();
        var st = new SmartTutorial_1.SmartTutorial();
        st.AddSlide(new Slide_1.Slide()
            .AddAction(new HighlightAction_1.HighlightAction(rnJQuery('#formSettingsScrollArea')).AddTooltip('Here are all the fields you can use', "right")));
        st.AddSlide(new Slide_1.Slide()
            .AddAction(new TitleAction_1.TitleAction('You just need to drag them'))
            .AddAction(new HighlightAction_1.HighlightAction(rnJQuery('#formSettingsScrollArea')))
            .AddAction(new HighlightAction_1.HighlightAction(rnJQuery('#newFormContainer')))
            .AddAction(new DragAction_1.DragAction(rnJQuery('#components .rednaotextinput'), rnJQuery('#redNaoElementlist'), function () {
            return rnJQuery('<div class="tutorialDraggedelement bootstrap-wrapper"><div class="form-horizontal span6 temp  tempForm" style="opacity: .2;position:static !important;" >' + rnJQuery('#components .rednaotextinput').html() + '</div></div>');
        })));
        st.AddSlide(new Slide_1.Slide()
            .AddAction(new HighlightAction_1.HighlightAction(rnJQuery('#components .redNaoSubmitButton')).AddTooltip("Remember to add a submit button, it is a draggable field just like the others", "right")));
        st.AddSlide(new Slide_1.Slide()
            .AddAction(new HighlightAction_1.HighlightAction(rnJQuery('#smartFormsAfterSubmitTab')))
            .AddAction(new ClickAction_1.ClickAction(rnJQuery('#smartFormsAfterSubmitTab')).ClearAfterClick())
            .AddAction(new HighlightAction_1.HighlightAction(rnJQuery('#smartFormsAfterSubmitDiv')))
            .AddAction(new HighlightAction_1.HighlightAction(rnJQuery('#smartFormsAfterSubmitDiv tbody')).AddTooltip('Here you can configure what you want to happen after a form is submitted', "bottom"))
            .AddAction(new HighlightAction_1.HighlightAction(rnJQuery('.sfAfterSubmitAction').eq(0)).AddTooltip('Send an email', "right"))
            .AddAction(new HighlightAction_1.HighlightAction(rnJQuery('.sfAfterSubmitAction').eq(1)).AddTooltip('Redirect to another page (like a thank you page)', "right"))
            .AddAction(new HighlightAction_1.HighlightAction(rnJQuery('.sfAfterSubmitAction').eq(2)).AddTooltip('Show a message', "right")));
        st.AddSlide(new Slide_1.Slide()
            .AddAction(new HighlightAction_1.HighlightAction(rnJQuery('#toplevel_page_smart_forms_menu li').eq(4))
            .AddTooltip("And lastly, you can find a bunch of tutorials here", "right")
            .AfterExecute(function () { rnJQuery('#toplevel_page_smart_forms_menu li').eq(4).css('background-color', 'darkred'); })
            .AfterClear(function () { rnJQuery('#toplevel_page_smart_forms_menu li').eq(4).css('background-color', 'transparent'); })));
        st.Start();
        st.OnFinish(function () {
            rnJQuery('#smartFormsGeneralTab').click();
            rnJQuery.post(ajaxurl, { action: 'smart_forms_skip_tutorial',nonce:saveNonce });
        });
    };
    return AddNewTutorial;
}());
exports.AddNewTutorial = AddNewTutorial;
window.SmartFormsAddNewTutorial = new AddNewTutorial();


/***/ }),

/***/ "./tutorials2/SmartTutorial/Actions/ActionBase.ts":
/*!********************************************************!*\
  !*** ./tutorials2/SmartTutorial/Actions/ActionBase.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ActionBase = /** @class */ (function () {
    function ActionBase() {
        this.TooltipList = [];
        this.afterExecute = null;
        this.afterClear = null;
    }
    ActionBase.prototype.Execute = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this.$target != null && _this.previousStyle != null)
                _this.previousStyle = _this.$target.attr('style');
            var result = _this.ExecuteInternal();
            if (_this.afterExecute != null)
                _this.afterExecute();
            if (result instanceof Promise)
                result.then(function () {
                    _this.ShowTooltips();
                    resolve();
                });
            else {
                _this.ShowTooltips();
                resolve();
            }
        });
    };
    ActionBase.prototype.Clear = function () {
        this.ClearInternal();
        if (this.afterClear != null)
            this.afterClear();
    };
    ActionBase.prototype.AfterExecute = function (method) {
        this.afterExecute = method;
        return this;
    };
    ActionBase.prototype.AfterClear = function (method) {
        this.afterClear = method;
        return this;
    };
    ActionBase.prototype.ClearStyles = function () {
        if (this.previousStyle == undefined)
            this.$target.removeAttr('style');
        else
            this.$target.attr('style', this.previousStyle);
    };
    ActionBase.prototype.GetZIndex = function (increment) {
        if (increment === void 0) { increment = 0; }
        return this.tutorial.ZIndex + increment;
    };
    ActionBase.prototype.AddTooltip = function (text, position) {
        this.TooltipList.push({ Text: text, Position: position, $Container: null });
        return this;
    };
    ActionBase.prototype.ShowTooltips = function () {
        for (var _i = 0, _a = this.TooltipList; _i < _a.length; _i++) {
            var tooltip = _a[_i];
            tooltip.$Container = rnJQuery("<div style=\"opacity:0\" class=\"tutorialBox\">" + tooltip.Text + "</div>");
            rnJQuery('body').append(tooltip.$Container);
            tooltip.$Container.css('z-index', this.GetZIndex(1000));
            this.SetPosition(tooltip);
            tooltip.$Container.velocity({ opacity: 1 }, 200, 'easeInExp');
        }
    };
    ActionBase.prototype.SetPosition = function (tooltip) {
        var offset = this.$target.offset();
        var positionClass = '';
        var tooltipTop = 0;
        var tooltipLeft = 0;
        switch (tooltip.Position) {
            case "right":
                positionClass = 'BoxRight';
                tooltipTop = offset.top + this.$target.height() / 2 - tooltip.$Container.outerHeight() / 2;
                tooltipLeft = offset.left + this.$target.outerWidth() + ActionBase.ArrowOffSet;
                break;
            case "left":
                break;
            case "top":
                break;
            case "bottom":
                positionClass = 'BoxBottom';
                tooltipTop = offset.top + this.$target.outerHeight() + ActionBase.ArrowOffSet;
                tooltipLeft = offset.left + this.$target.outerWidth() / 2 - tooltip.$Container.outerWidth() / 2;
                break;
        }
        tooltip.$Container.addClass(positionClass);
        tooltip.$Container.css('left', tooltipLeft);
        tooltip.$Container.css('top', tooltipTop);
    };
    ActionBase.prototype.ClearTooltips = function () {
        var _loop_1 = function (tooltip) {
            tooltip.$Container.velocity({ opacity: 0 }, 200, 'easeOutExp', function () { tooltip.$Container.remove(); });
        };
        for (var _i = 0, _a = this.TooltipList; _i < _a.length; _i++) {
            var tooltip = _a[_i];
            _loop_1(tooltip);
        }
    };
    ActionBase.ArrowOffSet = 15;
    return ActionBase;
}());
exports.ActionBase = ActionBase;


/***/ }),

/***/ "./tutorials2/SmartTutorial/Actions/ClickAction.ts":
/*!*********************************************************!*\
  !*** ./tutorials2/SmartTutorial/Actions/ClickAction.ts ***!
  \*********************************************************/
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var MouseAction_1 = __webpack_require__(/*! ./MouseAction */ "./tutorials2/SmartTutorial/Actions/MouseAction.ts");
var ClickAction = /** @class */ (function (_super) {
    __extends(ClickAction, _super);
    function ClickAction($target) {
        var _this = _super.call(this) || this;
        _this.clearAfterClick = false;
        _this.$target = $target;
        return _this;
    }
    ClickAction.prototype.ExecuteInternal = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.MoveMouseToElement(this.$target)];
                                case 1:
                                    _a.sent();
                                    this.$target.click();
                                    if (this.clearAfterClick)
                                        this.HideMouse();
                                    resolve();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    ClickAction.prototype.ClearInternal = function () {
    };
    ClickAction.prototype.ClearAfterClick = function () {
        this.clearAfterClick = true;
        return this;
    };
    return ClickAction;
}(MouseAction_1.MouseAction));
exports.ClickAction = ClickAction;


/***/ }),

/***/ "./tutorials2/SmartTutorial/Actions/DragAction.ts":
/*!********************************************************!*\
  !*** ./tutorials2/SmartTutorial/Actions/DragAction.ts ***!
  \********************************************************/
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var MouseAction_1 = __webpack_require__(/*! ./MouseAction */ "./tutorials2/SmartTutorial/Actions/MouseAction.ts");
var DragAction = /** @class */ (function (_super) {
    __extends(DragAction, _super);
    function DragAction($dragSource, $dragTarget, generateElementToDrag) {
        var _this = _super.call(this) || this;
        _this.$dragSource = $dragSource;
        _this.$dragTarget = $dragTarget;
        _this.generateElementToDrag = generateElementToDrag;
        _this.originalOffset = null;
        _this.actionCancelled = false;
        return _this;
    }
    DragAction.prototype.ExecuteInternal = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mouseOffset, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout = null;
                        if (this.originalOffset == null)
                            this.originalOffset = this.GetMouse().offset();
                        this.SetMouseCoordinates(this.originalOffset);
                        return [4 /*yield*/, this.MoveMouseToElement(this.$dragSource)];
                    case 1:
                        _a.sent();
                        if (this.actionCancelled)
                            return [2 /*return*/];
                        this.$elementToDrag = this.generateElementToDrag();
                        this.$elementToDrag.css('visibility', 'hidden');
                        this.$elementToDrag.css('z-index', this.GetZIndex(1002));
                        rnJQuery('body').append(this.$elementToDrag);
                        mouseOffset = this.$mouse.offset();
                        this.$elementToDrag.css('position', 'absolute');
                        this.$elementToDrag.css('top', mouseOffset.top - this.$elementToDrag.first().height() / 2);
                        this.$elementToDrag.css('left', mouseOffset.left - this.$elementToDrag.first().width() / 2);
                        this.$elementToDrag.css('visibility', 'visible');
                        this.MoveMouseToElement(this.$dragTarget, "top", 30);
                        result = this.CalculatePositionAndDistanceToElement(this.$dragTarget, "top", 30);
                        this.$elementToDrag.velocity({ top: result.Top - this.$elementToDrag.first().height() / 2, left: result.Left - this.$elementToDrag.first().width() / 2 }, result.Distance, function () {
                            _this.timeout = setTimeout(function () {
                                _this.$elementToDrag.remove();
                                _this.ExecuteInternal();
                            }, 1500);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    DragAction.prototype.ClearInternal = function () {
        this.actionCancelled = true;
        if (this.$elementToDrag != null) {
            this.$elementToDrag.velocity("stop", true);
            this.$elementToDrag.remove();
            this.$elementToDrag = null;
        }
        if (this.timeout == null) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.HideMouse();
    };
    return DragAction;
}(MouseAction_1.MouseAction));
exports.DragAction = DragAction;


/***/ }),

/***/ "./tutorials2/SmartTutorial/Actions/HighlightAction.ts":
/*!*************************************************************!*\
  !*** ./tutorials2/SmartTutorial/Actions/HighlightAction.ts ***!
  \*************************************************************/
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
var ActionBase_1 = __webpack_require__(/*! ./ActionBase */ "./tutorials2/SmartTutorial/Actions/ActionBase.ts");
var HighlightAction = /** @class */ (function (_super) {
    __extends(HighlightAction, _super);
    function HighlightAction($elementToHighlight) {
        var _this = _super.call(this) || this;
        _this.$target = $elementToHighlight;
        return _this;
    }
    HighlightAction.prototype.ExecuteInternal = function () {
        var _this = this;
        if (this.$target.data('tutorial-highlighted') == true)
            return;
        this.$target.velocity({ opacity: .0 }, 100, "easeOutExp", function () {
            _this.$target.data('tutorial-highlighted', true);
            _this.$target.css('z-index', _this.GetZIndex(1));
            _this.$target.css('position', 'relative');
            _this.$target.velocity({ opacity: 1 }, 100, "easeInExp");
        });
    };
    HighlightAction.prototype.ClearInternal = function () {
        var _this = this;
        this.$target.velocity({ opacity: .0 }, 100, "easeOutExp", function () {
            _this.ClearStyles();
            _this.$target.removeData('tutorial-highlighted');
            _this.$target.velocity({ opacity: 1 }, 100, "easeOutExp");
        });
    };
    return HighlightAction;
}(ActionBase_1.ActionBase));
exports.HighlightAction = HighlightAction;


/***/ }),

/***/ "./tutorials2/SmartTutorial/Actions/MouseAction.ts":
/*!*********************************************************!*\
  !*** ./tutorials2/SmartTutorial/Actions/MouseAction.ts ***!
  \*********************************************************/
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
var ActionBase_1 = __webpack_require__(/*! ./ActionBase */ "./tutorials2/SmartTutorial/Actions/ActionBase.ts");
var MouseAction = /** @class */ (function (_super) {
    __extends(MouseAction, _super);
    function MouseAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MouseAction.prototype.MoveMouseToElement = function ($target, position, offsetTop, offsetLeft) {
        var _this = this;
        if (position === void 0) { position = "center"; }
        if (offsetTop === void 0) { offsetTop = 0; }
        if (offsetLeft === void 0) { offsetLeft = 0; }
        return new Promise((function (resolve) {
            var mouse = _this.GetMouse();
            var moveAction = function () {
                var result = _this.CalculatePositionAndDistanceToElement($target, position, offsetTop, offsetLeft);
                _this.$mouse.velocity({ top: result.Top, left: result.Left }, result.Distance, function () { return resolve(); });
            };
            if (_this.$mouse.css('opacity') == "0")
                _this.GetMouse().velocity({ opacity: 1 }, 100, "easeInExp", moveAction);
            else
                moveAction();
        }));
    };
    MouseAction.prototype.CalculatePositionAndDistanceToElement = function ($target, position, offsetTop, offsetLeft) {
        if (position === void 0) { position = "center"; }
        if (offsetTop === void 0) { offsetTop = 0; }
        if (offsetLeft === void 0) { offsetLeft = 0; }
        var offset = this.$mouse.offset();
        var currentTop = offset.top;
        var currentLeft = offset.left;
        offset = $target.offset();
        var newTop = offset.top + $target.height() / 2 - 10;
        var newLeft = offset.left + $target.width() / 2 - 10;
        if (position == "top") {
            newTop = offset.top;
        }
        newTop += offsetTop;
        newLeft += offsetLeft;
        var distance = Math.sqrt(Math.pow(newTop - currentTop, 2) + Math.pow(newLeft - currentLeft, 2));
        return {
            Distance: distance,
            Top: newTop,
            Left: newLeft
        };
    };
    MouseAction.prototype.SetMouseCoordinates = function (coordinates) {
        this.GetMouse().css('left', coordinates.left);
        this.GetMouse().css('top', coordinates.top);
    };
    MouseAction.prototype.GetMouse = function () {
        if (this.$mouse == null) {
            this.$mouse = rnJQuery("<img style=\"left:0;top:0;position:absolute;z-index:" + this.GetZIndex(2000) + ";\" src=\"" + (smartFormsRootPath + 'images/handPointer.png') + "\"/>");
            rnJQuery('body').append(this.$mouse);
        }
        return this.$mouse;
    };
    MouseAction.prototype.HideMouse = function () {
        this.GetMouse().velocity({ opacity: 0 }, 200, "easeOutExp");
    };
    return MouseAction;
}(ActionBase_1.ActionBase));
exports.MouseAction = MouseAction;


/***/ }),

/***/ "./tutorials2/SmartTutorial/Actions/TitleAction.ts":
/*!*********************************************************!*\
  !*** ./tutorials2/SmartTutorial/Actions/TitleAction.ts ***!
  \*********************************************************/
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
var ActionBase_1 = __webpack_require__(/*! ./ActionBase */ "./tutorials2/SmartTutorial/Actions/ActionBase.ts");
var TitleAction = /** @class */ (function (_super) {
    __extends(TitleAction, _super);
    function TitleAction(title) {
        var _this = _super.call(this) || this;
        _this.title = title;
        return _this;
    }
    TitleAction.prototype.ExecuteInternal = function () {
        this.$title = rnJQuery("<div class=\"tutorialTitle\" style=\"opacity: 0; width:auto;max-width: 70%;min-height: 0;padding:13px;min-width: 500px;\"><span>" + this.title + "</span></div>");
        rnJQuery('body').append(this.$title);
        this.$title.css('position', 'absolute');
        this.$title.css('top', '150px');
        this.$title.css('left', rnJQuery(window).width() / 2 - this.$title.width() / 2);
        this.$title.css('z-index', this.tutorial.ZIndex + 1000);
        this.$title.velocity({ opacity: 1 }, 200, "easeInExp");
        return this;
    };
    TitleAction.prototype.ClearInternal = function () {
        var _this = this;
        this.$title.velocity({ opacity: 0 }, 200, "easeOutExp", function () { _this.$title.remove(); });
    };
    return TitleAction;
}(ActionBase_1.ActionBase));
exports.TitleAction = TitleAction;


/***/ }),

/***/ "./tutorials2/SmartTutorial/Slide.ts":
/*!*******************************************!*\
  !*** ./tutorials2/SmartTutorial/Slide.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var HighlightAction_1 = __webpack_require__(/*! ./Actions/HighlightAction */ "./tutorials2/SmartTutorial/Actions/HighlightAction.ts");
var Slide = /** @class */ (function () {
    function Slide() {
        this.actionList = [];
        this.highlights = [];
    }
    Slide.prototype.AddAction = function (action) {
        this.actionList.push(action);
        if (action instanceof HighlightAction_1.HighlightAction)
            this.highlights.push(action);
        return this;
    };
    Slide.prototype.ExecuteNextAction = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.currentActionIndex++;
                        if (!(this.actionList.length == this.currentActionIndex)) return [3 /*break*/, 1];
                        this.Finish();
                        return [3 /*break*/, 3];
                    case 1:
                        this.currentAction = this.actionList[this.currentActionIndex];
                        this.currentAction.tutorial = this.tutorial;
                        return [4 /*yield*/, this.currentAction.Execute()];
                    case 2:
                        _a.sent();
                        this.ExecuteNextAction();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Slide.prototype.Clear = function (nextSlide) {
        for (var _i = 0, _a = this.actionList; _i < _a.length; _i++) {
            var action = _a[_i];
            var preventClear = false;
            action.ClearTooltips();
            if (action instanceof HighlightAction_1.HighlightAction && nextSlide != null)
                for (var _b = 0, _c = nextSlide.highlights; _b < _c.length; _b++) {
                    var nextHighlights = _c[_b];
                    if (action.$target[0] == nextHighlights.$target[0]) {
                        nextHighlights.previousStyle = action.previousStyle;
                        preventClear = true;
                    }
                }
            if (!preventClear)
                action.Clear();
        }
    };
    Slide.prototype.Execute = function () {
        this.currentActionIndex = -1;
        this.ExecuteNextAction();
    };
    Slide.prototype.Finish = function () {
    };
    return Slide;
}());
exports.Slide = Slide;


/***/ }),

/***/ "./tutorials2/SmartTutorial/SmartTutorial.ts":
/*!***************************************************!*\
  !*** ./tutorials2/SmartTutorial/SmartTutorial.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var SmartTutorial = /** @class */ (function () {
    function SmartTutorial() {
        this.slides = [];
        this.ZIndex = 1000;
        this.currentSlideIndex = -1;
        this.FinishAction = null;
    }
    SmartTutorial.prototype.Start = function () {
        var _this = this;
        this.$background = rnJQuery('<div style="background:black;opacity:.5;position:fixed;top:0;bottom:0;right:0;left:0;z-index: ' + this.ZIndex + ';"></div>');
        this.$transparentBackground = rnJQuery('<div class="bootstrap-wrapper" style="background:transparent;position:fixed;top:0;bottom:0;right:0;left:0;z-index: ' + (this.ZIndex + 2000) + ';"></div>');
        this.$nextButton = rnJQuery("<span style=\"position:absolute;bottom:20px;right:20px;font-size: 30px;vertical-align: middle;color:white;cursor: pointer;\" >\n                                                    <span style=\"vertical-align: middle;\" class=\"glyphicon glyphicon-hand-right\"></span>\n                                                    <span style=\"vertical-align: middle;margin-left:1px;\" >Next</span>\n                                         </span>");
        this.$transparentBackground.append(this.$nextButton);
        this.$nextButton.click(function () {
            _this.ExecuteNextSlide();
        });
        rnJQuery('body').append(this.$background);
        rnJQuery('body').append(this.$transparentBackground);
        this.currentSlideIndex = -1;
        this.ExecuteNextSlide();
    };
    SmartTutorial.prototype.AddSlide = function (slide) {
        slide.tutorial = this;
        this.slides.push(slide);
    };
    SmartTutorial.prototype.ExecuteNextSlide = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.currentSlideIndex++;
                        if (this.currentSlide != null) {
                            this.currentSlide.Clear(this.currentSlideIndex < this.slides.length ? this.slides[this.currentSlideIndex] : null);
                        }
                        if (this.currentSlideIndex == this.slides.length) {
                            this.Finish();
                        }
                        this.currentSlide = this.slides[this.currentSlideIndex];
                        this.currentSlide.Execute();
                        if (!(this.currentSlideIndex + 1 == this.slides.length)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.$nextButton.velocityAsync({ opacity: 0 }, 200, "easeOutExp")];
                    case 1:
                        _a.sent();
                        this.$nextButton.empty();
                        this.$nextButton.append("<span style=\"vertical-align: middle;\" class=\"glyphicon glyphicon-remove\"></span>\n                                              <span style=\"vertical-align: middle;margin-left:1px;\" >Close Tutorial</span>");
                        this.$nextButton.velocity({ opacity: 1 }, 200, "easeInExp");
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    SmartTutorial.prototype.OnFinish = function (action) {
        this.FinishAction = action;
    };
    SmartTutorial.prototype.Finish = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.$background.velocity({ opacity: 0 }, 200, "easeOutExp", function () { _this.$background.remove(); });
                        return [4 /*yield*/, this.$transparentBackground.velocityAsync({ opacity: 0 }, 200, "easeOutExp")];
                    case 1:
                        _a.sent();
                        this.$transparentBackground.remove();
                        if (this.FinishAction != null)
                            this.FinishAction();
                        return [2 /*return*/];
                }
            });
        });
    };
    return SmartTutorial;
}());
exports.SmartTutorial = SmartTutorial;


/***/ })

/******/ });
//# sourceMappingURL=addnewtutorial_bundle.js.map