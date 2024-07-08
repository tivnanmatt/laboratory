class SfShowStepHandler extends SfConditionalHandlerBase {


    public Fields: any;
    public FormElements: sfFormElementBase<any>[];
    public $StepList:{id:string,$element:JQuery,OriginalWidth?:number}[]=[];

    constructor(options) {
        super(options);
        this.Options.Type = "SfShowStepHandler";
        this.Fields = "";
        this.FormElements = null;
    }

    public ExecutingPromise() {

    }

    public GetConditionalSteps() {
        if (this.IsNew) {
            this.Options.GeneralInfo = {};
            this.Options.StepPicker = {};
            this.Options.Condition = {};
        }
        return [
            {Type: "SfNamePicker", Label: 'HowDoYouWantToName', Options: this.Options.GeneralInfo, Id: this.Id},
            {Type: "SfStepPicker", Label: 'SelectTheStepsToBeShow', Options: this.Options.StepPicker},
            {Type: "SfHandlerConditionGenerator", Label: 'WhenDoYouWantToDisplay', Options: this.Options.Condition}
        ];
    };

    public Initialize(form, data) {
        this.Form = form;

        let stepPickerOptions:SfStepPickerOptions=this.Options.StepPicker;
        this.Form.JQueryForm.find('.rnMLStep').each((index,value)=> {
            if (stepPickerOptions.StepsToShow.find(x =>x== rnJQuery(value).data('step-id')))
                this.$StepList.push({$element:rnJQuery(value),id:rnJQuery(value).data('step-id')});
        });
        this.PreviousActionWas = -1;
        this.Condition = this.Options.Condition;
        this.SubscribeCondition(this.Options.Condition, data);
        this.ProcessCondition(data).then((result)=>{if(result!=null)result.Execute()});
    };


    public GetFormElements():sfFormElementBase<any>[] {
        if (this.FormElements == null) {
            this.FormElements = [];
            for (let i = 0; i < this.Options.FieldPicker.AffectedItems.length; i++) {
                let fieldId = this.Options.FieldPicker.AffectedItems[i];
                for (let t = 0; t < this.Form.FormElements.length; t++)
                    if (this.Form.FormElements[t].Id == fieldId)
                        this.FormElements.push(this.Form.FormElements[t]);


            }
        }
        return this.FormElements;
    };


    public ExecuteTrueAction(index:number=null) {
        for(let step of this.$StepList)
        {
            if(typeof step.OriginalWidth=="undefined")
                continue;
            this.Form.MultipleStepsManager.UnIgnoreStep(step.id);
            step.$element.css('display','block');
            step.$element.velocity({width:step.OriginalWidth,'padding-left':30,'padding-right':20},200,'easeInExp',()=>{step.$element.css('width','')});
        }

        if(this.Form!=null&&this.Form.MultipleStepsManager!=null)
            this.Form.MultipleStepsManager.RefreshNextButtonText();

    };

    public ExecuteFalseAction(from,index:number=null) {
        for(let step of this.$StepList)
        {
            this.Form.MultipleStepsManager.IgnoreStep(step.id);
            step.OriginalWidth=step.$element.width();
            step.$element.velocity({width:0,'padding-left':0,'padding-right':0},200,'easeOutExp',()=>{step.$element.css('display','none')});
        }
        if(this.Form!=null&&this.Form.MultipleStepsManager!=null)
            this.Form.MultipleStepsManager.RefreshNextButtonText();
    };

}

(window as any).SfShowStepHandler=SfShowStepHandler;