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
//# sourceMappingURL=ConditionalLogicManager.js.map