"use strict";

class SfConditionalLogicManager {
    private FormBuilder: any;
    private PanelContainer: JQuery;
    private SettingsPanel: JQuery;
    private ConditionalHandlersListScreen: JQuery;
    private CurrentLeft: number;
    private ConditionIdToSave: number;
    private SavedConditionList: JQuery;
    private Translations: any;
    private SelectedHandler: any;
    private HandlerSteps: SfConditionalHandlerBase[];
    private CurrentStepIndex: number;
    private CurrentStep: any;


    constructor(formBuilder: any) {
        this.FormBuilder = formBuilder;
        this.PanelContainer = rnJQuery('#sfPanelContainer');
        this.SettingsPanel = rnJQuery('#formSettingsScrollArea');
        this.ConditionalHandlersListScreen = null;
        this.CurrentLeft = 0;
        this.ConditionIdToSave = -1;
        this.SavedConditionList = rnJQuery('#sfSavedConditionList');
        let self = this;
        this.SavedConditionList.find('#sfAddConditionalLogic').click(function () {
            self.AddNew();
        });
        //noinspection JSUnresolvedVariable
        this.Translations = smartFormsTranslation;
    }

    private AddNew() {
        this.GoToConditionalLogicList();
    };

    private ClearPanelContainer() {
        this.ConditionIdToSave = -1;
        this.PanelContainer.find("tr:first > td:gt(0)").remove();
        this.PanelContainer.css('left', 0);
        this.CurrentLeft = 0;
    };


    private GoToConditionalLogicList() {
        this.ConditionalHandlersListScreen = this.CreateConditionalHandlersListScreen();
        this.GoToScreen(this.ConditionalHandlersListScreen);
    };

    private CreateConditionalHandlersListScreen() {
        let handlers = SmartFormsGetConditionalHandlerArray();
        let html = rnJQuery("<div id='sfConditionalList' style='width:570px;'><table style='width: 100%'></table></div>");
        let self = this;
        let table = html.find('table');
        for (let i = 0; i < handlers.length; i++) {
            if(handlers[i].ShouldShow(this.FormBuilder)) {
                let link = this.CreateHandlerItem(handlers[i]);
                table.append(link);
            }
        }
        let buttonContainer = rnJQuery('<div style="width: 100%; margin-top:20px;margin-left: 5px;"></div>');
        buttonContainer.append("<a  style='float:left' class='smartFormsSettingsButton smartFormsPrevious'>" + this.Translations.Previous + "</a>");
        buttonContainer.find('.smartFormsPrevious').click(function () {
            self.GoToRoot();
        });
        html.append(buttonContainer);
        return html;
    };

    private CreateHandlerItem(handler) {
        let link = rnJQuery("<tr><td style='cursor: pointer;text-align: center;'><a style='cursor: pointer;'>" + handler.Label + "</a></td></tr>");
        let self = this;
        link.find('td').click(function () {
                //noinspection JSReferencingMutableVariableFromClosure
                self.HandlerSelected(handler.id)
            }
        );
        return link;
    };

    private HandlerSelected(handlerId) {
        this.ConditionIdToSave = -1;
        this.StartHandlerConfiguration(SmartFormsGetConditionalHandlerByType(handlerId, null), true);
    };

    private StartHandlerConfiguration(handler, isNew) {
        this.SelectedHandler = handler;
        this.HandlerSteps = this.SelectedHandler.GetConditionalSteps();
        if (isNew) {
            for (let i = 0; i < this.HandlerSteps.length; i++)
                this.HandlerSteps[i].IsNew = true;
        }
        this.CurrentStepIndex = -1;
        this.GoToNextStep();
    };


    private GoToNextStep() {
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
        let stepToMoveTo = this.HandlerSteps[this.CurrentStepIndex];
        this.CurrentStep = SfGetConditionalStep(this.FormBuilder, stepToMoveTo,this.HandlerSteps);
        stepToMoveTo.Container = rnJQuery("<div style='box-sizing: border-box; width:" + this.GetPanelWidth() + "px;'></div>");
        this.CurrentStep.InitializeScreen(stepToMoveTo.Container);
        this.AddStepButtons(stepToMoveTo.Container);
        this.GoToScreen(stepToMoveTo.Container);
    };

    private AddStepButtons(container) {
        let buttonContainer = rnJQuery('<div style="width: 100%; margin-top:20px;"></div>');
        buttonContainer.append("<a  style='float:left' class='smartFormsSettingsButton smartFormsPrevious'>" + this.Translations.Previous + "</a>");
        let nextButtonLabel = this.CurrentStepIndex == (this.HandlerSteps.length - 1) ? this.Translations.Finish : this.Translations.Next;
        buttonContainer.append("<a  style='float:right' class='smartFormsSettingsButton smartFormsNext'>" + nextButtonLabel + "</a>");

        let self = this;
        buttonContainer.find('.smartFormsPrevious').click(function () {
            self.GoToPreviousStep();
        });
        buttonContainer.find('.smartFormsNext').click(function () {
            self.GoToNextStep();
        });
        container.append(buttonContainer);
    };

    private SaveCondition() {
        if (this.ConditionIdToSave <= 0)
            this.FormBuilder.Conditions.push(this.SelectedHandler.GetOptionsToSave());
        else {
            for (let i = 0; i < this.FormBuilder.Conditions.length; i++)
                if (this.FormBuilder.Conditions[i].Id == this.ConditionIdToSave)
                    this.FormBuilder.Conditions[i] = this.SelectedHandler.GetOptionsToSave();
        }


    };

    private GoToRoot() {
        this.CurrentStep = null;
        let self = this;

        this.PanelContainer.animate({'left': 0}, {
            complete: function () {
                self.ClearPanelContainer();
                self.FillSavedConditionList();
            }
        });
        this.SettingsPanel.animate({'width': this.GetPanelWidth()});
    };

    private ConditionSelected(condition) {
        this.ConditionIdToSave = condition.Id;
        this.StartHandlerConfiguration(SmartFormsGetConditionalHandlerByType(condition.Type, condition), false);
    };

    private CreateConditionListItem(condition) {
        let self = this;
        let conditionJQuery = rnJQuery('<tr><td class="SavedConditionItem"><a style="cursor: pointer;"> ' + RedNaoEscapeHtml(condition.Label) + '</a><img style=" margin-left:5px; cursor: pointer;width:15px;height:15px;" class="deleteCondition" src="' + smartFormsRootPath + 'images/delete.png" title="Delete"></td></tr>');
        conditionJQuery.find('a').click(function () {
            self.ConditionSelected(condition)
        });
        conditionJQuery.find('.deleteCondition').click(function () {
            if (confirm(self.Translations['AreYouSureYouWantToDelete'] + ' ' + condition.Label + '?')) {
                self.FormBuilder.Conditions.splice(self.FormBuilder.Conditions.indexOf(condition), 1);
                conditionJQuery.remove();
            }
        });
        return conditionJQuery;
    };

    public FillSavedConditionList() {
        let self = this;
        this.SavedConditionList.empty();
        for (let i = 0; i < this.FormBuilder.Conditions.length; i++)
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

    private GoToPreviousStep() {
        if (this.CurrentStep != null)
            this.CurrentStep.Exit();
        this.CurrentStepIndex--;
        if (this.CurrentStepIndex == -1)
            this.CurrentStep = null;
        else {
            let stepToMoveTo = this.HandlerSteps[this.CurrentStepIndex];
            stepToMoveTo.Container.empty();
            this.CurrentStep = SfGetConditionalStep(this.FormBuilder, stepToMoveTo,this.HandlerSteps);
            this.CurrentStep.InitializeScreen(stepToMoveTo.Container);
            this.AddStepButtons(stepToMoveTo.Container);
        }

        this.CurrentLeft += this.GetPanelWidth();
        let self = this;
        this.PanelContainer.animate({'left': this.CurrentLeft}, {
            complete: function () {
                self.PanelContainer.find('tr:first').children().last().remove();
            }
        });
        this.SettingsPanel.animate({'width': this.GetPanelWidth()});
    };

    private GoToScreen(screenJQuery) {
        let container = rnJQuery('<td style="vertical-align: top"></td>');
        container.append(screenJQuery);
        this.PanelContainer.find('tr:first').append(container);

        this.CurrentLeft -= this.SettingsPanel.width();
        this.PanelContainer.animate({'left': this.CurrentLeft});
        this.SettingsPanel.animate({'width': this.GetPanelWidth()});


    };

    private GetPanelWidth() {
        if (this.CurrentStep == null)
            return 570;
        else
            return this.CurrentStep.Width;
    };
}

(window as any).SfConditionalLogicManager=SfConditionalLogicManager;

