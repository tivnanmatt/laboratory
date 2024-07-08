var SfMultipleStepsBase = /** @class */ (function () {
    function SfMultipleStepsBase(options, $container, formElements, formGenerator) {
        var _this = this;
        this.$Container = $container;
        this.FormElements = formElements;
        this.$StepForm = null;
        this.StepCatalog = null;
        this.SortedSteps = null;
        this.FormGenerator = formGenerator;
        this.$CurrentErrorMessage = null;
        if (options == null)
            this.Options = {
                Steps: [],
                LatestId: 0,
                PreviousText: 'Prev',
                NextText: 'Next',
                CompleteText: 'Complete'
            };
        else {
            this.Options = options;
            if (typeof this.Options.PreviousText == 'undefined')
                this.Options.PreviousText = 'Prev';
            if (typeof this.Options.NextText == 'undefined')
                this.Options.NextText = 'Next';
            if (typeof this.Options.CompleteText == 'undefined')
                this.Options.CompleteText = 'Complete';
        }
        RedNaoEventManager.Subscribe('FormSubmitted', function (data) {
            if (_this.$Container != null) {
                _this.$Container.find('.rnNextButton').RNWait('start');
            }
        });
        RedNaoEventManager.Subscribe('FormSubmittedCompleted', function (data) {
            if (_this.$Container != null) {
                _this.$Container.find('.rnNextButton').RNWait('stop');
            }
        });
    }
    SfMultipleStepsBase.prototype.Generate = function () {
        var _this = this;
        this.$Container.empty();
        this.$StepForm = rnJQuery('<div class="fuelux">' +
            '<div class="wizard">' +
            '<div class="steps-container">' +
            '<ul class="steps" style="margin-left: 0">' +
            '</ul>' +
            '</div>' +
            '<div class="step-content">' +
            '</div>' +
            '<div class="actions">' +
            '<button class="btn btn-default btn-prev redNaoMSButton rnPrevButton" disabled="disabled"><span class="glyphicon glyphicon-arrow-left"></span>' + this.Options.PreviousText + '</button>' +
            '<button class="btn btn-default btn-next redNaoMSButton rnNextButton" data-last="' + this.Options.CompleteText + '">' + this.Options.NextText + '<span class="glyphicon glyphicon-arrow-right"></span></button>' +
            '</div>' +
            '</div>' +
            '</div>');
        this.$Container.append(this.$StepForm);
        this.CreateSteps();
        this.CreateFields();
        this.$StepForm.wizard();
        this.$StepForm.on('actionclicked.fu.wizard', function (event, data) { _this.OnStepChanged(event, data); });
        this.$StepForm.on('changed.fu.wizard', function () {
            _this.RefreshNextButtonText();
        });
        var self = this;
        this.$StepForm.on('finished.fu.wizard', function (e) {
            e.preventDefault();
            self.FormCompleted();
        });
        //noinspection SpellCheckingInspection
        this.$StepForm.on('actionclicked.fu.wizard', function (e, data) {
            var skipValidation = false;
            if (typeof data != 'undefined' && typeof data.data != 'undefined')
                skipValidation = data.data.skipValidation;
            if (data.direction == 'next' && !skipValidation) {
                self.MoveToTop();
                e.preventDefault();
                self.ProcessCurrentStep().then(function (result) {
                    if (result) {
                        for (var i = 0; i < self.FormElements.length; i++)
                            self.FormElements[i].DestroyPopOver();
                        skipValidation = true;
                        _this.$StepForm.wizard('next', { data: { skipValidation: true } });
                    }
                });
            }
        });
        this.GenerationCompleted();
    };
    ;
    SfMultipleStepsBase.prototype.MoveToTop = function () {
        /*   try
           {
               var scroll = this.FormGenerator.JQueryForm.offset();
               if ((window.pageYOffset + window.innerHeight) > scroll.top)
                   rnJQuery('html, body').animate({scrollTop: scroll.top}, 200);
           }catch(err)
           {
   
           }*/
    };
    ;
    SfMultipleStepsBase.prototype.FormCompleted = function () {
        var _this = this;
        this.ProcessCurrentStep().then(function (result) {
            if (result)
                _this.FormGenerator.JQueryForm.submit();
        });
    };
    ;
    SfMultipleStepsBase.prototype.ProcessCurrentStep = function () {
        var currentStep = this.GetCurrentStep();
        return this.StepIsValid(currentStep);
    };
    ;
    SfMultipleStepsBase.prototype.StepIsValid = function (step) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.FormGenerator.GetRootContainer().find('.redNaoValidationMessage').remove();
            _this.FormGenerator.GetRootContainer().find('.redNaoInputText,.redNaoRealCheckBox,.redNaoInputRadio,.redNaoInputCheckBox,.redNaoSelect,.redNaoTextArea,.redNaoInvalid,.has-error').removeClass('redNaoInvalid').removeClass('has-error');
            var afterValidation = function () {
                var firstInvalidField = null;
                var isValid = true;
                for (var i = 0; i < step.Fields.length; i++) {
                    step.Fields[i].ClearInvalidStyle();
                    if (!step.Fields[i].IsIgnored() && !step.Fields[i].IsValid()) {
                        isValid = false;
                        if (firstInvalidField == null)
                            firstInvalidField = step.Fields[i];
                    }
                }
                if (_this.$CurrentErrorMessage != null) {
                    _this.$CurrentErrorMessage.slideUp('1000', 'easeOutQuint');
                    _this.$CurrentErrorMessage = null;
                }
                if (!isValid) {
                    _this.$CurrentErrorMessage = rnJQuery('<div class="alert alert-danger" role="alert" style="display: none;margin-bottom: 0;clear:both;">' +
                        '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                        '<span class="sr-only">Error:</span>' +
                        RedNaoEscapeHtml(_this.FormGenerator.client_form_options.InvalidInputMessage) +
                        '</div>');
                    _this.$StepForm.find('#_' + step.Id).append(_this.$CurrentErrorMessage);
                    _this.$CurrentErrorMessage.slideDown('1000', 'easeOutQuint');
                    _this.FormGenerator.ScrollTo(firstInvalidField.JQueryElement);
                }
                resolve(isValid);
            };
            var args = { Generator: _this, Promises: [] };
            RedNaoEventManager.Publish('BeforeValidatingForm', args);
            if (args.Promises.length > 0)
                Promise.all(args.Promises).then(afterValidation);
            else
                afterValidation();
        });
    };
    ;
    SfMultipleStepsBase.prototype.GetCurrentStep = function () {
        var id = this.$StepForm.find('.step-pane.active').data('step-id');
        return this.StepCatalog[id];
    };
    ;
    SfMultipleStepsBase.prototype.GenerationCompleted = function () {
    };
    ;
    SfMultipleStepsBase.prototype.CreateSteps = function () {
        if (this.Options.Steps.length == 0) {
            this.Options.LatestId++;
            this.Options.Steps.push({
                Text: 'Default',
                Icon: 'def',
                Id: 's' + this.Options.LatestId,
                Index: this.Options.Steps.length
            });
        }
        var $stepsContainer = this.$StepForm.find('.steps');
        for (var i = 0; i < this.Options.Steps.length; i++) {
            var iconHtml = void 0;
            switch (this.Options.Steps[i].Icon) {
                case 'def':
                    iconHtml = '<span class="badge badge-info">' + (i + 1) + '</span> ';
                    break;
                case '':
                    iconHtml = '';
                    break;
                default:
                    iconHtml = '<span class="' + this.Options.Steps[i].Icon + '"></span> ';
            }
            $stepsContainer.append('<li data-step="' + (i + 1) + '" data-step-id="' + this.Options.Steps[i].Id + '" class="rnMLStep' + (i == 0 ? ' active' : '') + '">' + iconHtml + RedNaoEscapeHtml(this.Options.Steps[i].Text) + '<span class="chevron"></span></li>');
        }
    };
    ;
    SfMultipleStepsBase.prototype.ProcessStepInfo = function () {
        var i;
        var t;
        this.StepCatalog = {};
        for (i = 0; i < this.Options.Steps.length; i++) {
            var currentStepOptions = this.Options.Steps[i];
            this.StepCatalog[currentStepOptions.Id] = {
                Index: currentStepOptions.Index,
                Id: currentStepOptions.Id,
                Text: currentStepOptions.Text,
                Fields: [],
                IsIgnored: false
            };
        }
        this.SortSteps();
    };
    ;
    SfMultipleStepsBase.prototype.SortSteps = function () {
        this.SortedSteps = [];
        for (var stepId in this.StepCatalog) {
            var currentStep = this.StepCatalog[stepId];
            var t = void 0;
            for (t = 0; t < this.SortedSteps.length; t++)
                if (currentStep.Index < this.SortedSteps[t].Index)
                    break;
            this.SortedSteps.splice(t, 0, currentStep);
        }
    };
    ;
    SfMultipleStepsBase.prototype.IgnoreStep = function (stepId) {
        this.StepCatalog[stepId].IsIgnored = true;
        this.RefreshFieldValue(stepId);
    };
    SfMultipleStepsBase.prototype.UnIgnoreStep = function (stepId) {
        this.StepCatalog[stepId].IsIgnored = false;
        this.RefreshFieldValue(stepId);
    };
    SfMultipleStepsBase.prototype.RefreshFieldValue = function (stepId) {
        for (var _i = 0, _a = this.StepCatalog[stepId].Fields; _i < _a.length; _i++) {
            var field = _a[_i];
            field.FirePropertyChanged();
        }
    };
    SfMultipleStepsBase.prototype.CreateFields = function () {
        this.ProcessStepInfo();
        var i;
        var t;
        for (i = 0; i < this.FormElements.length; i++) {
            var id = this.FormElements[i].GetStepId();
            var currentStepOfField = this.StepCatalog[id];
            if (typeof currentStepOfField == 'undefined') {
                currentStepOfField = this.SortedSteps[0];
            }
            currentStepOfField.Fields.push(this.FormElements[i]);
        }
        var dataStepIndex = 1;
        for (var stepName in this.StepCatalog) {
            var currentStepInfo = this.StepCatalog[stepName];
            var $stepContainer = rnJQuery('<div class="step-pane active" data-step="' + dataStepIndex + '" id="_' + currentStepInfo.Id + '" data-step-id="' + currentStepInfo.Id + '"></div>');
            dataStepIndex++;
            this.$StepForm.find('.step-content').append($stepContainer);
            for (t = 0; t < currentStepInfo.Fields.length; t++)
                currentStepInfo.Fields[t].AppendElementToContainer($stepContainer);
        }
    };
    ;
    SfMultipleStepsBase.prototype.OnStepChanged = function (event, data) {
        var stepIndex = data.step - 1;
        if (data.direction == "next")
            stepIndex++;
        else
            stepIndex--;
        var nextStep = this.SortedSteps[stepIndex];
        if (nextStep.IsIgnored) {
            event.preventDefault();
            if (data.direction == "next") {
                this.SkipNextStepAndMoveForward();
                event.stopImmediatePropagation();
            }
            else
                this.SkipPreviousStepAndMoveBackward(data.step);
        }
    };
    SfMultipleStepsBase.prototype.GetNextValidStepIndex = function () {
        var currentStep = this.$StepForm.wizard('selectedItem').step;
        for (var i = currentStep; i < this.SortedSteps.length; i++)
            if (!this.SortedSteps[i].IsIgnored) {
                return i + 1;
            }
        return -1;
    };
    SfMultipleStepsBase.prototype.GetPreviousValidStepIndex = function () {
        var currentStep = this.$StepForm.wizard('selectedItem').step;
        for (var i = currentStep - 2; i >= 0; i--)
            if (!this.SortedSteps[i].IsIgnored) {
                return i + 1;
            }
        return -1;
    };
    SfMultipleStepsBase.prototype.SkipNextStepAndMoveForward = function () {
        var _this = this;
        this.ProcessCurrentStep().then(function (isValid) {
            if (!isValid)
                return;
            var nextStep = _this.GetNextValidStepIndex();
            if (nextStep == -1)
                _this.$StepForm.trigger('finished.fu.wizard');
            else {
                _this.$StepForm.wizard('selectedItem', { step: nextStep });
            }
        });
    };
    SfMultipleStepsBase.prototype.SkipPreviousStepAndMoveBackward = function (currentStep) {
        var nextStep = this.GetPreviousValidStepIndex();
        if (nextStep == -1)
            return;
        else {
            this.$StepForm.wizard('selectedItem', { step: nextStep });
        }
    };
    SfMultipleStepsBase.prototype.RefreshNextButtonText = function () {
        if (this.GetNextValidStepIndex() < 0)
            rnJQuery(rnJQuery('.rnNextButton').contents()[0]).replaceWith(RedNaoEscapeHtml(this.Options.CompleteText));
        else
            rnJQuery(rnJQuery('.rnNextButton').contents()[0]).replaceWith(RedNaoEscapeHtml(this.Options.NextText));
    };
    return SfMultipleStepsBase;
}());
//# sourceMappingURL=multiple_steps_base.js.map