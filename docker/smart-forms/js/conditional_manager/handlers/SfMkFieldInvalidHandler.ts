class SfMkFieldInvalidHandler extends SfConditionalHandlerBase {
    public Fields: any;
    public FormElements: sfFormElementBase<any>[];

    constructor(options) {
        super(options);
        this.Options.Type = "SfMkFieldInvalidHandler";
        this.Fields = "";
        this.FormElements = null;
    }

    public ExecutingPromise() {
        //this.ExecuteFalseAction();
    }

    public GetConditionalSteps() {
        if (this.IsNew) {
            this.Options.GeneralInfo = {};
            this.Options.FieldPicker = {};
            this.Options.Condition = {};
            this.Options.ErrorMessage = {};
        }
        return [
            {Type: "SfNamePicker", Label: 'HowDoYouWantToName', Options: this.Options.GeneralInfo, Id: this.Id},
            {Type: "SfHandlerFieldPicker", Label: 'whichFieldYouWantToMakeInvalid', Options: this.Options.FieldPicker},
            {Type: "SfHandlerConditionGenerator", Label: 'WhenDoYouWantToMakeInvalid', Options: this.Options.Condition},
            {Type: "SfTextPicker", Label: 'WhatMessageWhenInvalid', Options: this.Options.ErrorMessage}
        ];
    };

    public Initialize(form, data) {
        this.Form = form;
        this.Condition = this.Options.Condition;
        this.PreviousActionWas = -1;
        RedNaoEventManager.Subscribe('BeforeValidatingForm', (args) => {
            args.Promises.push(this.ProcessCondition(this.Form.GetCurrentData()).then((result)=>{
                if(result!=null)result.Execute()}));
        });

    };

    public GetFormElements() {
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
        let errorId = "mfi" + this.Id;
        for (let i = 0; i < formElements.length; i++) {
            formElements[i].AddError(errorId, this.Options.ErrorMessage.Text);
        }
    };

    public ExecuteFalseAction(from,index:number=null) {
        let formElements=null;
        if(index===null)
            formElements = this.GetFormElements();
        else{
            formElements=this.GetRepeaterElements(index);
        }

        let errorId = "mfi" + this.Id;
        for (let i = 0; i < formElements.length; i++)
            formElements[i].RemoveError(errorId);
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

(window as any).SfMkFieldInvalidHandler=SfMkFieldInvalidHandler;