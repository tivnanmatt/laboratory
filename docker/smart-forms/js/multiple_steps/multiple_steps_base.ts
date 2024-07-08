class SfMultipleStepsBase {
    public $Container: JQuery;
    public Options: MultipleStepOptions;
    public FormElements: sfFormElementBase<any>[];
    public $StepForm: JQuery;
    public StepCatalog: any;
    public SortedSteps: RunnableStepData[];
    public FormGenerator: any;
    public $CurrentErrorMessage: any;

    constructor(options, $container, formElements, formGenerator) {
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


        RedNaoEventManager.Subscribe('FormSubmitted',(data)=>
        {
            if(this.$Container!=null)
            {
                this.$Container.find('.rnNextButton').RNWait('start');
            }
        });

        RedNaoEventManager.Subscribe('FormSubmittedCompleted',(data)=>
        {
            if(this.$Container!=null)
            {
                this.$Container.find('.rnNextButton').RNWait('stop');
            }
        });


    }

    public Generate() {
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
        this.$StepForm.on('actionclicked.fu.wizard',(event,data)=>{this.OnStepChanged(event,data)});
        this.$StepForm.on('changed.fu.wizard',()=>{
            this.RefreshNextButtonText();
        });
        let self = this;
        this.$StepForm.on('finished.fu.wizard', function (e) {
            e.preventDefault();
            self.FormCompleted();
        });


        //noinspection SpellCheckingInspection
        this.$StepForm.on('actionclicked.fu.wizard',  (e, data)=> {
            let skipValidation=false;
            if(typeof data!='undefined'&& typeof data.data!='undefined')
                skipValidation=data.data.skipValidation;
            if (data.direction == 'next'&&!skipValidation) {
                self.MoveToTop();
                e.preventDefault();
                self.ProcessCurrentStep().then((result)=>{
                    if(result)
                    {
                        for (let i = 0; i < self.FormElements.length; i++)
                            self.FormElements[i].DestroyPopOver();
                        skipValidation=true;
                        this.$StepForm.wizard('next',{data:{skipValidation:true}});
                    }
                });
            }
        });
        this.GenerationCompleted();
    };


    public MoveToTop() {
     /*   try
        {
            var scroll = this.FormGenerator.JQueryForm.offset();
            if ((window.pageYOffset + window.innerHeight) > scroll.top)
                rnJQuery('html, body').animate({scrollTop: scroll.top}, 200);
        }catch(err)
        {

        }*/
    };


    public FormCompleted() {
        this.ProcessCurrentStep().then((result)=>{
            if(result)
                this.FormGenerator.JQueryForm.submit();
        });

    };

    public ProcessCurrentStep() {
        let currentStep = this.GetCurrentStep();
        return this.StepIsValid(currentStep);

    };

    public StepIsValid(step) {
        return new Promise((resolve)=>{
            this.FormGenerator.GetRootContainer().find('.redNaoValidationMessage').remove();
            this.FormGenerator.GetRootContainer().find('.redNaoInputText,.redNaoRealCheckBox,.redNaoInputRadio,.redNaoInputCheckBox,.redNaoSelect,.redNaoTextArea,.redNaoInvalid,.has-error').removeClass('redNaoInvalid').removeClass('has-error');
            let afterValidation=()=>{
                let firstInvalidField = null;
                let isValid = true;
                for (let i = 0; i < step.Fields.length; i++) {
                    step.Fields[i].ClearInvalidStyle();
                    if (!step.Fields[i].IsIgnored() && !step.Fields[i].IsValid()) {
                        isValid = false;
                        if (firstInvalidField == null)
                            firstInvalidField = step.Fields[i];
                    }
                }
                if (this.$CurrentErrorMessage != null) {
                    this.$CurrentErrorMessage.slideUp('1000', 'easeOutQuint');
                    this.$CurrentErrorMessage = null;
                }

                if (!isValid) {
                    this.$CurrentErrorMessage = rnJQuery(
                        '<div class="alert alert-danger" role="alert" style="display: none;margin-bottom: 0;clear:both;">' +
                        '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                        '<span class="sr-only">Error:</span>' +
                        RedNaoEscapeHtml(this.FormGenerator.client_form_options.InvalidInputMessage) +
                        '</div>');
                    this.$StepForm.find('#_' + step.Id).append(this.$CurrentErrorMessage);
                    this.$CurrentErrorMessage.slideDown('1000', 'easeOutQuint');
                    this.FormGenerator.ScrollTo(firstInvalidField.JQueryElement);
                }
                resolve(isValid);
            };
            let args={Generator: this,Promises:[]};
            RedNaoEventManager.Publish('BeforeValidatingForm', args);
            if(args.Promises.length>0)
                Promise.all(args.Promises).then(afterValidation);
            else
                afterValidation();
        });


    };

    public GetCurrentStep() {
        let id = this.$StepForm.find('.step-pane.active').data('step-id');
        return this.StepCatalog[id];
    };

    public GenerationCompleted() {


    };

    public CreateSteps() {
        if (this.Options.Steps.length == 0) {
            this.Options.LatestId++;
            this.Options.Steps.push({
                Text: 'Default',
                Icon: 'def',
                Id: 's' + this.Options.LatestId,
                Index: this.Options.Steps.length
            })
        }

        let $stepsContainer = this.$StepForm.find('.steps');
        for (let i = 0; i < this.Options.Steps.length; i++) {
            let iconHtml;
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

    public ProcessStepInfo() {
        let i;
        let t;
        this.StepCatalog = {};
        for (i = 0; i < this.Options.Steps.length; i++) {
            let currentStepOptions = this.Options.Steps[i];
            this.StepCatalog[currentStepOptions.Id]  =<RunnableStepData>{
                Index: currentStepOptions.Index,
                Id:currentStepOptions.Id,
                Text: currentStepOptions.Text,
                Fields:[],
                IsIgnored:false
            };
        }
        this.SortSteps();
    };

    public SortSteps() {
        this.SortedSteps = [];
        for (let stepId in this.StepCatalog) {
            let currentStep = this.StepCatalog[stepId];
            let t;
            for (t = 0; t < this.SortedSteps.length; t++)
                if (currentStep.Index < this.SortedSteps[t].Index)
                    break;
            this.SortedSteps.splice(t, 0, currentStep);
        }
    };

    public IgnoreStep(stepId:string)
    {
        this.StepCatalog[stepId].IsIgnored=true;
        this.RefreshFieldValue(stepId);
    }

    public UnIgnoreStep(stepId:string)
    {
        this.StepCatalog[stepId].IsIgnored=false;
        this.RefreshFieldValue(stepId);

    }

    public RefreshFieldValue(stepId:string)
    {
        for(let field of (this.StepCatalog[stepId] as RunnableStepData).Fields)
        {
            field.FirePropertyChanged();
        }
    }


    public CreateFields() {
        this.ProcessStepInfo();

        let i;
        let t;
        for (i = 0; i < this.FormElements.length; i++) {
            let id = this.FormElements[i].GetStepId();
            let currentStepOfField = this.StepCatalog[id];
            if (typeof currentStepOfField == 'undefined') {
                currentStepOfField = this.SortedSteps[0];
            }

            currentStepOfField.Fields.push(this.FormElements[i]);
        }

        let dataStepIndex = 1;
        for (let stepName in this.StepCatalog) {
            let currentStepInfo = this.StepCatalog[stepName];
            let $stepContainer = rnJQuery('<div class="step-pane active" data-step="' + dataStepIndex + '" id="_' + currentStepInfo.Id + '" data-step-id="' + currentStepInfo.Id + '"></div>');
            dataStepIndex++;
            this.$StepForm.find('.step-content').append($stepContainer);
            for (t = 0; t < currentStepInfo.Fields.length; t++)
                currentStepInfo.Fields[t].AppendElementToContainer($stepContainer);
        }
    };

    private OnStepChanged(event: any, data: {step:number,direction:'next'|'previous'}) {
        let stepIndex=data.step-1;
        if(data.direction=="next")
            stepIndex++;
        else
            stepIndex--;
        let nextStep=this.SortedSteps[stepIndex];
        if(nextStep.IsIgnored)
        {
            event.preventDefault();
            if(data.direction=="next") {
                this.SkipNextStepAndMoveForward();
                event.stopImmediatePropagation();
            }
            else
                this.SkipPreviousStepAndMoveBackward(data.step);

        }
    }

    private GetNextValidStepIndex(){
        let currentStep=this.$StepForm.wizard('selectedItem').step;
        for(let i=currentStep;i<this.SortedSteps.length;i++)
            if(!this.SortedSteps[i].IsIgnored) {
                return i+1;
            }

        return -1;
    }

    private GetPreviousValidStepIndex(){
        let currentStep=this.$StepForm.wizard('selectedItem').step;
        for(let i=currentStep-2;i>=0;i--)
            if(!this.SortedSteps[i].IsIgnored) {
                return i+1;
            }

        return -1;
    }

    private SkipNextStepAndMoveForward() {
        this.ProcessCurrentStep().then((isValid)=>{
            if(!isValid)
                return;
            let nextStep=this.GetNextValidStepIndex();
            if(nextStep==-1)
                this.$StepForm.trigger('finished.fu.wizard');
            else
            {
                this.$StepForm.wizard('selectedItem',{step:nextStep});
            }
        });


    }

    private SkipPreviousStepAndMoveBackward(currentStep: number) {
        let nextStep=this.GetPreviousValidStepIndex();
        if(nextStep==-1)
            return;
        else
        {
            this.$StepForm.wizard('selectedItem',{step:nextStep});
        }
    }

    public RefreshNextButtonText() {
        if(this.GetNextValidStepIndex()<0)
            rnJQuery(rnJQuery('.rnNextButton').contents()[0]).replaceWith(RedNaoEscapeHtml(this.Options.CompleteText));
        else
            rnJQuery(rnJQuery('.rnNextButton').contents()[0]).replaceWith(RedNaoEscapeHtml(this.Options.NextText));
    }
}

interface MultipleStepOptions{
    CompleteText:string;
    LatestId:number;
    NextText:string;
    PreviousText:string;
    Steps:StepHeaderData[];
}

interface StepHeaderData{
    Icon:string;
    Id:string;
    Index:number;
    Text:string;
}

interface RunnableStepData{
    Index:number;
    Fields:sfFormElementBase<any>[];
    Id:string;
    Text:string;
    IsIgnored:boolean;
}