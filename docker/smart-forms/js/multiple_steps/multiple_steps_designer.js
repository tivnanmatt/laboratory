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
var SfMultipleStepsDesigner = /** @class */ (function (_super) {
    __extends(SfMultipleStepsDesigner, _super);
    function SfMultipleStepsDesigner(options, $container, formElements) {
        var _this = _super.call(this, options, $container, formElements, {
            GetRootContainer: function () {
                return rnJQuery('#redNaoElementlist');
            },
            client_form_options: {
                InvalidInputMessage: 'Test error message'
            }
        }) || this;
        _this.StepDesigner = new SfStepDesigner();
        _this.GenerationCompletedCallBack = null;
        _this.InitializeTexts();
        var self = _this;
        RedNaoEventManager.Subscribe('ElementInserted', function (e) {
            self.AddFormElement(e.Field, e.Target, e.Position);
        });
        RedNaoEventManager.Subscribe('ElementMoved', function (e) {
            self.MoveFormElement(e.Field, e.Target, e.Position);
        });
        return _this;
    }
    SfMultipleStepsDesigner.prototype.InitializeTexts = function () {
        rnJQuery('#prevText').val(this.Options.PreviousText);
        rnJQuery('#nextText').val(this.Options.NextText);
        rnJQuery('#completeText').val(this.Options.CompleteText);
        var self = this;
        rnJQuery('#prevText').change(function () {
            self.Options.PreviousText = rnJQuery(this).val();
            rnJQuery('.rnPrevButton').empty().append('<span class="glyphicon glyphicon-arrow-left"></span>' + RedNaoEscapeHtml(self.Options.PreviousText));
        });
        rnJQuery('#nextText').change(function () {
            self.Options.NextText = rnJQuery(this).val();
            rnJQuery('.rnNextButton').empty().append(RedNaoEscapeHtml(self.Options.NextText) + '<span class="glyphicon glyphicon-arrow-right"></span>');
        });
        rnJQuery('#completeText').change(function () {
            var text = rnJQuery(this).val();
            self.Options.CompleteText = text;
            rnJQuery('.rnNextButton').attr('data-last', RedNaoEscapeHtml(text));
        });
    };
    ;
    SfMultipleStepsDesigner.prototype.FormCompleted = function () {
        return true;
    };
    ;
    SfMultipleStepsDesigner.prototype.ProcessCurrentStep = function () {
        return new Promise(function (resolve) { return resolve(true); });
    };
    ;
    SfMultipleStepsDesigner.prototype.CreateSteps = function () {
        _super.prototype.CreateSteps.call(this);
        var newStepButton = rnJQuery('<button style="position:absolute;right:1px;top:5px;z-index:1000;" type="button" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span>New Step</button>');
        var self = this;
        newStepButton.click(function () {
            self.ShowCreateStepPopUp();
        });
        this.$StepForm.find('.steps').append(newStepButton);
    };
    ;
    SfMultipleStepsDesigner.prototype.ShowCreateStepPopUp = function () {
        var self = this;
        this.StepDesigner.Show('<span class="glyphicon glyphicon-plus"></span>Create new step', null, this.Options.Steps.length, function (stepName, stepPosition, stepIcon) {
            self.CreateStep(stepName, stepPosition, stepIcon);
        });
    };
    ;
    SfMultipleStepsDesigner.prototype.CreateStep = function (stepName, stepPosition, stepIcon) {
        this.Options.LatestId++;
        var newStepOptions = {
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
    ;
    SfMultipleStepsDesigner.prototype.MoveStepTo = function (step, stepPosition) {
        for (var i = 0; i < this.FormElements.length; i++) {
            var options = this.FormElements[i].Options;
            if (typeof options.StepId == 'undefined' || options.StepId == '') {
                options.StepId = this.Options.Steps[0].Id;
            }
        }
        stepPosition--; //Step position starts with 1
        stepPosition = Math.max(0, stepPosition);
        stepPosition = Math.min(this.Options.Steps.length - 1, stepPosition);
        var originalPosition = this.Options.Steps.indexOf(step);
        this.Options.Steps.splice(originalPosition, 1);
        this.Options.Steps.splice(stepPosition, 0, step);
        for (var i = 0; i < this.Options.Steps.length; i++) {
            this.Options.Steps[i].Index = i;
            this.StepCatalog[this.Options.Steps[i].Id].Index = i;
        }
        this.SortSteps();
        this.FormElements.splice(0, this.FormElements.length);
        for (var i = 0; i < this.SortedSteps.length; i++)
            for (var h = 0; h < this.SortedSteps[i].Fields.length; h++)
                this.FormElements.push(this.SortedSteps[i].Fields[h]);
        this.Generate();
        RedNaoEventManager.Publish('FormDesignUpdated');
    };
    ;
    SfMultipleStepsDesigner.prototype.EditStep = function (stepToEdit, stepName, stepPosition, stepIcon) {
        stepToEdit.Text = stepName;
        stepToEdit.Icon = stepIcon;
        this.MoveStepTo(stepToEdit, stepPosition);
        this.Generate();
        this.StepDesigner.Hide();
        RedNaoEventManager.Publish('FormDesignUpdated');
    };
    ;
    SfMultipleStepsDesigner.prototype.DeleteStep = function (stepToDelete) {
        for (var i = 0; i < stepToDelete.Fields.length; i++) {
            for (var t = 0; t < this.FormElements.length; t++) {
                if (stepToDelete.Fields[i] == this.FormElements[t]) {
                    this.FormElements.splice(t, 1);
                    t--;
                }
            }
        }
        for (var i = 0; i < this.Options.Steps.length; i++)
            if (this.Options.Steps[i].Id == stepToDelete.Id)
                this.Options.Steps.splice(i, 1);
        this.Generate();
        RedNaoEventManager.Publish('FormDesignUpdated');
    };
    ;
    SfMultipleStepsDesigner.prototype.AddFormElement = function (formElement, target, position) {
        var parentStep = this.StepCatalog[formElement.JQueryElement.closest('.step-pane').data('step-id')];
        if (target == null) {
            parentStep.Fields.push(formElement);
            if (formElement.IsFieldContainer)
                for (var i = 0; i < formElement.Fields.length; i++)
                    parentStep.fields.push(formElement.fields[i]);
        }
        else {
            var index = 0;
            for (var t = 0; t < parentStep.Fields.length; t++) {
                if (parentStep.Fields[t] == target) {
                    index = t;
                    break;
                }
            }
            if (position == 'bottom' || position == 'right')
                index++;
            parentStep.Fields.splice(index, 0, formElement);
            if (formElement.IsFieldContainer)
                for (var i = 0; i < formElement.Fields.length; i++)
                    parentStep.Fields.splice(index, 0, formElement);
        }
        formElement.SetStepId(parentStep.Id);
    };
    ;
    SfMultipleStepsDesigner.prototype.MoveFormElement = function (formElement, target, position) {
        var parentStep = this.StepCatalog[formElement.JQueryElement.closest('.step-pane').data('step-id')];
        if (target != null) {
            for (var i = 0; i < this.SortedSteps.length; i++)
                for (var t = 0; t < this.SortedSteps[i].Fields.length; t++) {
                    if (this.SortedSteps[i].Fields[t].Id == formElement.Id) {
                        this.SortedSteps[i].Fields.splice(t, 1);
                        if (formElement.IsFieldContainer)
                            for (var g = 0; g < formElement.Fields.length; g++) {
                                for (var h = t; h < this.SortedSteps[i].Fields.length; h++) {
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
    ;
    SfMultipleStepsDesigner.prototype.GetStepById = function (id) {
        for (var i = 0; i < this.Options.Steps.length; i++)
            if (this.Options.Steps[i].Id == id)
                return this.Options.Steps[i];
    };
    ;
    SfMultipleStepsDesigner.prototype.SynchronizeFormElementsAndStepFields = function () {
        var listOfElements = [];
        var fieldCount = 0;
        for (var i = 0; i < this.SortedSteps.length; i++)
            for (var t = 0; t < this.SortedSteps[i].Fields.length; t++) {
                if (this.SortedSteps[i].Fields[t].Id != this.FormElements[fieldCount].Id)
                    for (var h = fieldCount + 1; h < this.FormElements.length; h++) {
                        if (this.SortedSteps[i].Fields[t].Id == this.FormElements[h].Id) {
                            var aux = this.FormElements[fieldCount];
                            this.FormElements[fieldCount] = this.FormElements[h];
                            this.FormElements[h] = aux;
                        }
                    }
                fieldCount++;
            }
    };
    ;
    SfMultipleStepsDesigner.prototype.GenerationCompleted = function () {
        //this.SynchronizeFormElementsAndStepFields();
        var self = this;
        this.$StepForm.find('.steps li').css('cursor', 'pointer').click(function () {
            var id = rnJQuery(this).data('step-id');
            var step = self.GetStepById(id);
            self.StepDesigner.Show('<span class="glyphicon glyphicon-pencil"></span>Edit Step', step, step.Index, function (stepName, stepPosition, stepIcon) {
                self.EditStep(step, stepName, stepPosition, stepIcon);
            });
        }).mouseenter(function () {
            if (self.Options.Steps.length <= 1)
                return;
            var currentStep = this;
            var $deleteButton = rnJQuery('<span class="glyphicon glyphicon-remove rnMSRemoveStep" ></span>');
            $deleteButton.click(function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var stepToDelete = self.StepCatalog[rnJQuery(currentStep).data('step-id')];
                rnJQuery.RNGetConfirmationDialog().ShowConfirmation('Deleting step ' + RedNaoEscapeHtml(stepToDelete.Text), 'Are you sure you want to delete this steps and all the fields inside it (if any)?', function () {
                    self.DeleteStep(stepToDelete);
                });
            });
            rnJQuery(this).prepend($deleteButton);
        }).mouseleave(function () {
            rnJQuery(this).find('.rnMSRemoveStep').remove();
        });
        this.GenerationCompletedCallBack();
    };
    ;
    return SfMultipleStepsDesigner;
}(SfMultipleStepsBase));
var SfStepDesigner = /** @class */ (function () {
    function SfStepDesigner() {
        if (typeof SfStepDesigner.$Dialog == 'undefined') {
            SfStepDesigner.$Dialog = rnJQuery('<div class="modal fade"  tabindex="-1" style="display: none;">' +
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
            var formattingFunction = function (state) {
                if (state.id == 'def')
                    return '<span style="display: inline;margin-right: 5px;" class="badge badge-info">1</span><span>' + state.text + '</span>';
                return '<span style="display: inline;margin-right: 5px;" class="' + state.id + '"></span><span>' + state.text + '</span>';
            };
            SfStepDesigner.$Dialog.find('#rnStepsIconSelect').select2({
                width: '300px',
                formatResult: formattingFunction,
                formatSelection: formattingFunction
            });
            SfStepDesigner.$Dialog.find('.select2-results').addClass('bootstrap-wrapper');
            var container = rnJQuery('<div class="bootstrap-wrapper"></div>');
            container.append(SfStepDesigner.$Dialog);
            rnJQuery('body').append(container);
            SfStepDesigner.$Dialog.modal({
                show: false,
                keyboard: true,
                backdrop: 'true'
            });
        }
        this.$Dialog = SfStepDesigner.$Dialog;
    }
    SfStepDesigner.prototype.Show = function (title, stepInfo, stepIndex, callBack) {
        this.$Dialog.find('.modal-title').html('<h4 class="modal-title">' + title + '</h4>');
        this.$Dialog.find('.modal-body').append('');
        rnJQuery('#multipleStepPosition').val(stepIndex + 1);
        if (stepInfo == null) {
            rnJQuery('#multipleStepName').val('');
            rnJQuery('#rnStepsIconSelect').select2('val', 'def');
        }
        else {
            rnJQuery('#multipleStepName').val(stepInfo.Text);
            rnJQuery('#rnStepsIconSelect').select2('val', stepInfo.Icon);
        }
        var self = this;
        this.$Dialog.find('.btn-success').unbind('click').click(function () {
            callBack(self.$Dialog.find('#multipleStepName').val(), self.$Dialog.find('#multipleStepPosition').val(), self.$Dialog.find('#rnStepsIconSelect').select2('val'));
        });
        this.$Dialog.modal('ShowInCenter');
    };
    ;
    SfStepDesigner.prototype.Hide = function () {
        this.$Dialog.modal('hide');
    };
    ;
    return SfStepDesigner;
}());
//# sourceMappingURL=multiple_steps_designer.js.map