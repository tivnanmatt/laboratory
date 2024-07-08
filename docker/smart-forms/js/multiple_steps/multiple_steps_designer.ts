class SfMultipleStepsDesigner extends SfMultipleStepsBase {
    public StepDesigner: SfStepDesigner;
    public GenerationCompletedCallBack:any;

    constructor(options, $container, formElements) {
        super(options, $container, formElements,{
            GetRootContainer: function () {
                return rnJQuery('#redNaoElementlist');
            },
            client_form_options: {
                InvalidInputMessage: 'Test error message'
            }
        });
        this.StepDesigner = new SfStepDesigner();
        this.GenerationCompletedCallBack = null;
        this.InitializeTexts();
        let self = this;
        RedNaoEventManager.Subscribe('ElementInserted', function (e) {
            self.AddFormElement(e.Field, e.Target, e.Position)
        });
        RedNaoEventManager.Subscribe('ElementMoved', function (e) {
            self.MoveFormElement(e.Field, e.Target, e.Position)
        });
    }


    public InitializeTexts() {
        rnJQuery('#prevText').val(this.Options.PreviousText);
        rnJQuery('#nextText').val(this.Options.NextText);
        rnJQuery('#completeText').val(this.Options.CompleteText);

        let self = this;

        rnJQuery('#prevText').change(function () {
            self.Options.PreviousText =  rnJQuery(this).val();
            rnJQuery('.rnPrevButton').empty().append('<span class="glyphicon glyphicon-arrow-left"></span>' + RedNaoEscapeHtml(self.Options.PreviousText));
        });

        rnJQuery('#nextText').change(function () {
            self.Options.NextText = rnJQuery(this).val();
            rnJQuery('.rnNextButton').empty().append(RedNaoEscapeHtml(self.Options.NextText) + '<span class="glyphicon glyphicon-arrow-right"></span>');
        });

        rnJQuery('#completeText').change(function () {
            let text = rnJQuery(this).val();
            self.Options.CompleteText = text;
            rnJQuery('.rnNextButton').attr('data-last', RedNaoEscapeHtml(text));
        });
    };



    public FormCompleted() {
        return true;

    };

    public ProcessCurrentStep():any {
        return new Promise((resolve)=>resolve(true));

    };

    public CreateSteps() {
        super.CreateSteps();
        let newStepButton = rnJQuery('<button style="position:absolute;right:1px;top:5px;z-index:1000;" type="button" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span>New Step</button>');
        let self = this;
        newStepButton.click(function () {
            self.ShowCreateStepPopUp();
        });
        this.$StepForm.find('.steps').append(newStepButton);
    };

    public ShowCreateStepPopUp() {
        let self = this;
        this.StepDesigner.Show('<span class="glyphicon glyphicon-plus"></span>Create new step', null, this.Options.Steps.length, function (stepName, stepPosition, stepIcon) {
            self.CreateStep(stepName, stepPosition, stepIcon);
        });
    };

    public CreateStep(stepName, stepPosition, stepIcon) {
        this.Options.LatestId++;
        let newStepOptions = {
            Text: stepName,
            Icon: stepIcon,
            Id: 's' + this.Options.LatestId,
            Index: this.Options.Steps.length,
            Fields: []
        };
        this.Options.Steps.push(newStepOptions);
        this.StepCatalog[newStepOptions.Id] = newStepOptions;
        this.MoveStepTo(this.Options.Steps[this.Options.Steps.length - 1], stepPosition);
        this.Generate();
        this.StepDesigner.Hide();
        RedNaoEventManager.Publish('FormDesignUpdated');
    };

    public MoveStepTo(step, stepPosition) {
        for (let i = 0; i < this.FormElements.length; i++) {
            let options = this.FormElements[i].Options;
            if (typeof options.StepId == 'undefined' || options.StepId == '') {
                options.StepId = this.Options.Steps[0].Id;
            }
        }

        stepPosition--;//Step position starts with 1
        stepPosition = Math.max(0, stepPosition);
        stepPosition = Math.min(this.Options.Steps.length - 1, stepPosition);
        let originalPosition = this.Options.Steps.indexOf(step);
        this.Options.Steps.splice(originalPosition, 1);
        this.Options.Steps.splice(stepPosition, 0, step);
        for (let i = 0; i < this.Options.Steps.length; i++) {
            this.Options.Steps[i].Index = i;
            this.StepCatalog[this.Options.Steps[i].Id].Index = i;
        }

        this.SortSteps();
        this.FormElements.splice(0, this.FormElements.length);
        for (let i = 0; i < this.SortedSteps.length; i++)
            for (let h = 0; h < this.SortedSteps[i].Fields.length; h++)
                this.FormElements.push(this.SortedSteps[i].Fields[h]);


        this.Generate();
        RedNaoEventManager.Publish('FormDesignUpdated');
    };


    public EditStep(stepToEdit, stepName, stepPosition, stepIcon) {
        stepToEdit.Text = stepName;
        stepToEdit.Icon = stepIcon;
        this.MoveStepTo(stepToEdit, stepPosition);
        this.Generate();
        this.StepDesigner.Hide();
        RedNaoEventManager.Publish('FormDesignUpdated');
    };

    public DeleteStep(stepToDelete) {
        for (let i = 0; i < stepToDelete.Fields.length; i++) {
            for (let t = 0; t < this.FormElements.length; t++) {
                if (stepToDelete.Fields[i] == this.FormElements[t]) {
                    this.FormElements.splice(t, 1);
                    t--;
                }
            }
        }

        for (let i = 0; i < this.Options.Steps.length; i++)
            if (this.Options.Steps[i].Id == stepToDelete.Id)
                this.Options.Steps.splice(i, 1);

        this.Generate();
        RedNaoEventManager.Publish('FormDesignUpdated');
    };

    public AddFormElement(formElement, target, position?) {
        let parentStep = this.StepCatalog[formElement.JQueryElement.closest('.step-pane').data('step-id')];
        if (target == null) {
            parentStep.Fields.push(formElement);
            if (formElement.IsFieldContainer)
                for (let i = 0; i < formElement.Fields.length; i++)
                    parentStep.fields.push(formElement.fields[i]);
        }
        else {
            let index = 0;
            for (let t = 0; t < parentStep.Fields.length; t++) {
                if (parentStep.Fields[t] == target) {
                    index = t;
                    break;
                }
            }
            if (position == 'bottom' || position == 'right')
                index++;
            parentStep.Fields.splice(index, 0, formElement);
            if (formElement.IsFieldContainer)
                for (let i = 0; i < formElement.Fields.length; i++)
                    parentStep.Fields.splice(index, 0, formElement);
        }

        formElement.SetStepId(parentStep.Id);
    };


    public MoveFormElement(formElement, target, position?) {
        let parentStep = this.StepCatalog[formElement.JQueryElement.closest('.step-pane').data('step-id')];
        if (target != null) {
            for (let i = 0; i < this.SortedSteps.length; i++)
                for (let t = 0; t < this.SortedSteps[i].Fields.length; t++) {
                    if (this.SortedSteps[i].Fields[t].Id == formElement.Id) {
                        this.SortedSteps[i].Fields.splice(t, 1);
                        if (formElement.IsFieldContainer)
                            for (let g = 0; g < formElement.Fields.length; g++) {
                                for (let h = t; h < this.SortedSteps[i].Fields.length; h++) {
                                    if (formElement.Fields[g].Id == this.SortedSteps[i].Fields[h].Id) {
                                        this.SortedSteps[i].Fields.splice(h, 1);
                                        h--;
                                    }
                                }
                            }
                    }
                }
        }
        this.AddFormElement(formElement, target, position);

    };


    public GetStepById(id) {
        for (let i = 0; i < this.Options.Steps.length; i++)
            if (this.Options.Steps[i].Id == id)
                return this.Options.Steps[i];


    };


    public SynchronizeFormElementsAndStepFields() {
        let listOfElements = [];
        let fieldCount = 0;
        for (let i = 0; i < this.SortedSteps.length; i++)
            for (let t = 0; t < this.SortedSteps[i].Fields.length; t++) {
                if (this.SortedSteps[i].Fields[t].Id != this.FormElements[fieldCount].Id)
                    for (let h = fieldCount + 1; h < this.FormElements.length; h++) {
                        if (this.SortedSteps[i].Fields[t].Id == this.FormElements[h].Id) {
                            let aux = this.FormElements[fieldCount];
                            this.FormElements[fieldCount] = this.FormElements[h];
                            this.FormElements[h] = aux;
                        }

                    }
                fieldCount++;
            }

    };

    public GenerationCompleted() {
        //this.SynchronizeFormElementsAndStepFields();
        let self = this;
        this.$StepForm.find('.steps li').css('cursor', 'pointer').click(function () {
            let id = rnJQuery(this).data('step-id');
            let step = self.GetStepById(id);
            self.StepDesigner.Show('<span class="glyphicon glyphicon-pencil"></span>Edit Step', step, step.Index, function (stepName, stepPosition, stepIcon) {
                self.EditStep(step, stepName, stepPosition, stepIcon);
            });
        }).mouseenter(function () {
            if (self.Options.Steps.length <= 1)
                return;
            let currentStep = this;
            let $deleteButton = rnJQuery('<span class="glyphicon glyphicon-remove rnMSRemoveStep" ></span>');
            $deleteButton.click(function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                let stepToDelete = self.StepCatalog[rnJQuery(currentStep).data('step-id')];
                rnJQuery.RNGetConfirmationDialog().ShowConfirmation('Deleting step ' + RedNaoEscapeHtml(stepToDelete.Text), 'Are you sure you want to delete this steps and all the fields inside it (if any)?', function () {
                    self.DeleteStep(stepToDelete)
                });

            });
            rnJQuery(this).prepend($deleteButton)
        }).mouseleave(function () {
            rnJQuery(this).find('.rnMSRemoveStep').remove();
        });
        this.GenerationCompletedCallBack();

    };

}

declare let RedNaoIconSelector:any;
class SfStepDesigner {

    public static $Dialog: JQuery;
    public $Dialog:JQuery;

    constructor() {
        if (typeof SfStepDesigner.$Dialog == 'undefined') {
            SfStepDesigner.$Dialog = rnJQuery(
                '<div class="modal fade"  tabindex="-1" style="display: none;">' +
                '<div class="modal-dialog">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h4 class="modal-title"></h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '<div>' +
                '<div class="form-group row">' +
                '<div class="rednao_label_container col-sm-3"><label class="rednao_control_label">Name</label></div>' +
                '<div class="redNaoControls col-sm-9"><input style="" id="multipleStepName" name="Name" type="text" placeholder="Placeholder" class="form-control redNaoInputText " value=""></div>' +
                '</div>' +
                '<div class="form-group row">' +
                '<div class="rednao_label_container col-sm-3"><label class="rednao_control_label">Icon</label></div>' +
                '<div class="redNaoControls col-sm-9">' +
                '<select id="rnStepsIconSelect" style="display: block;">' +
                '<option value="">None</option>' +
                '<option value="def" selected="selected">Default</option>' +
                RedNaoIconSelector.prototype.GetIconOptions() +
                '</select>' +
                '</div>' +
                '</div>' +
                '<div class="form-group row">' +
                '<div class="rednao_label_container col-sm-3"><label class="rednao_control_label">Position</label></div>' +
                '<div class="redNaoControls col-sm-3"><input style="" id="multipleStepPosition" name="Name" type="number" min="1" step="1" placeholder="Default" class="form-control redNaoInputText " value=""></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button type="button" class="btn btn-danger" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>Cancel</button>' +
                '<button type="button" class="btn btn-success"><span class="glyphicon glyphicon-ok"></span> Accept</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');


            let formattingFunction = function (state) {
                if (state.id == 'def')
                    return '<span style="display: inline;margin-right: 5px;" class="badge badge-info">1</span><span>' + state.text + '</span>';
                return '<span style="display: inline;margin-right: 5px;" class="' + state.id + '"></span><span>' + state.text + '</span>'
            };

            SfStepDesigner.$Dialog.find('#rnStepsIconSelect').select2({
                width: '300px',
                formatResult: formattingFunction,
                formatSelection: formattingFunction
            });

            SfStepDesigner.$Dialog.find('.select2-results').addClass('bootstrap-wrapper');
            let container = rnJQuery('<div class="bootstrap-wrapper"></div>');
            container.append(SfStepDesigner.$Dialog);
            rnJQuery('body').append(container);

            SfStepDesigner.$Dialog.modal(
                {
                    show: false,
                    keyboard: true,
                    backdrop: 'true'
                })
        }

        this.$Dialog = SfStepDesigner.$Dialog;
    }

    public Show(title, stepInfo, stepIndex, callBack) {
        this.$Dialog.find('.modal-title').html('<h4 class="modal-title">' + title + '</h4>');
        this.$Dialog.find('.modal-body').append('');
        rnJQuery('#multipleStepPosition').val(stepIndex + 1);
        if (stepInfo == null) {
            rnJQuery('#multipleStepName').val('');
            rnJQuery('#rnStepsIconSelect').select2('val', 'def');
        } else {
            rnJQuery('#multipleStepName').val(stepInfo.Text);
            rnJQuery('#rnStepsIconSelect').select2('val', stepInfo.Icon);
        }

        let self = this;
        this.$Dialog.find('.btn-success').unbind('click').click(function () {
            callBack(self.$Dialog.find('#multipleStepName').val(), self.$Dialog.find('#multipleStepPosition').val(), self.$Dialog.find('#rnStepsIconSelect').select2('val'));
        });


        this.$Dialog.modal('ShowInCenter');
    };

    public Hide() {
        this.$Dialog.modal('hide');
    };
}
