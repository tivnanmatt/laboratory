class SfShowConditionalHandler extends SfConditionalHandlerBase {


    public Fields: any;
    public FormElements: sfFormElementBase<any>[];

    constructor(options) {
        super(options);
        this.Options.Type = "SfShowConditionalHandler";
        this.Fields = "";
        this.FormElements = null;
    }

    public ExecutingPromise() {

    }

    public GetConditionalSteps() {
        if (this.IsNew) {
            this.Options.GeneralInfo = {};
            this.Options.FieldPicker = {};
            this.Options.Condition = {};
        }
        return [
            {Type: "SfNamePicker", Label: 'HowDoYouWantToName', Options: this.Options.GeneralInfo, Id: this.Id},
            {Type: "SfHandlerFieldPicker", Label: 'typeOrSelectFieldsToBeShown', Options: this.Options.FieldPicker},
            {Type: "SfHandlerConditionGenerator", Label: 'WhenDoYouWantToDisplay', Options: this.Options.Condition}
        ];
    };

    public Initialize(form, data) {
        this.Form = form;

        this.PreviousActionWas = -1;
        this.Condition = this.Options.Condition;
        this.SubscribeCondition(this.Options.Condition, data);
        this.ProcessCondition(data).then((result)=>{if(result!=null)result.Execute()});
    };

    public HideFields() {
        this.Form.JQueryForm.find(this.GetFieldIds()).css('display', 'none');
        let formElements = this.GetFormElements();
        for (let i = 0; i < formElements.length; i++)
            formElements[i].Ignore();
    };

    public GetFieldIds() {
        if (this.Fields == "")
            for (let i = 0; i < this.Options.FieldPicker.AffectedItems.length; i++) {
                if (i > 0)
                    this.Fields += ",";
                this.Fields += '#' + this.Options.FieldPicker.AffectedItems[i];

            }
        return this.Fields;
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
        let formElements=null;
        if(index===null)
            formElements = this.GetFormElements();
        else{
            formElements=this.GetRepeaterElements(index);
        }
        for (let i = 0; i < formElements.length; i++)
            formElements[i].Show(this.Options.Id);
    };

    public ExecuteFalseAction(form,index:number=null) {
        let formElements=null;
        if(index===null)
            formElements = this.GetFormElements();
        else{
            formElements=this.GetRepeaterElements(index);
        }
        for (let i = 0; i < formElements.length; i++)
            formElements[i].Hide(this.Options.Id);
    };

    public GetRepeaterElements(index:number)
    {
        let fields=[];
        for (let i = 0; i < this.Options.FieldPicker.AffectedItems.length; i++) {
            let fieldId = this.Options.FieldPicker.AffectedItems[i];
            let repeaterId=fieldId.split('.')[0];
            let repeaterFieldId=fieldId.split('.')[1];
            for (let t = 0; t < this.Form.FormElements.length; t++)
                if (this.Form.FormElements[t].Id == repeaterId) {
                    for(let item of this.Form.FormElements[t].DynamicItems) {
                        for (let field of item.Fields) {
                            if (field.Id == repeaterFieldId+'_row_'+index)
                                fields.push(field);
                        }
                    }
                }


        }

        return fields;
    }

}

(window as any).SfShowConditionalHandler=SfShowConditionalHandler;