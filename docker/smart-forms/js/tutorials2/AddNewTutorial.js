"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SmartTutorial_1 = require("./SmartTutorial/SmartTutorial");
var HighlightAction_1 = require("./SmartTutorial/Actions/HighlightAction");
var Slide_1 = require("./SmartTutorial/Slide");
var TitleAction_1 = require("./SmartTutorial/Actions/TitleAction");
var DragAction_1 = require("./SmartTutorial/Actions/DragAction");
var ClickAction_1 = require("./SmartTutorial/Actions/ClickAction");
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
            rnJQuery.post(ajaxurl, { action: 'smart_forms_skip_tutorial', nonce: saveNonce });
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
            rnJQuery.post(ajaxurl, { action: 'smart_forms_skip_tutorial', nonce: saveNonce });
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
            rnJQuery.post(ajaxurl, { action: 'smart_forms_skip_tutorial', nonce: saveNonce });
        });
    };
    return AddNewTutorial;
}());
exports.AddNewTutorial = AddNewTutorial;
window.SmartFormsAddNewTutorial = new AddNewTutorial();
//# sourceMappingURL=AddNewTutorial.js.map