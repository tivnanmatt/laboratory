
class RedNaoFormulaManager {
    public Formulas: RedNaoFormula[] = [];
    public Data: any;

    constructor() {
        this.Formulas = [];
        this.Data = {};

        let self = this;
        RedNaoEventManager.Subscribe('formPropertyChanged', function (data) {
            self.PropertyChanged(data)
        });
        RedNaoEventManager.Subscribe('CalculateFormula', function (data) {
            return self.CalculateFormula(data.FormulaInstance, data.Formula, data.Values);
        })
    }


    private CalculateFormula(instance:RedNaoFormula, formula, values) {
        return (()=>{
            let Remote=instance.GetRemote();
            formula = new Function('formData,Remote,current', 'return ' + formula.CompiledFormula);
            return formula(values,Remote,instance.FormElement);
        })();

    }

    public PropertyChanged(data) {
        this.SetFormulaValue(data.Field, data.FieldName, data.Value);
        this.UpdateFormulaFieldsIfNeeded(data.FieldName,data.SubField);
        RedNaoEventManager.Publish('FormValueChanged', {FieldName: data.FieldName, Data: this.Data});

        let actionData: any = {FieldName: data.FieldName, Data: this.Data, Actions: []};
        RedNaoEventManager.Publish('ProcessConditionsAfterValueChanged', actionData);

        actionData = actionData.Actions;
        let i;
        for (i = 0; i < actionData.length; i++) {
            this.ExecuteAfterComplete(actionData[i],"hide");
        }

        for (i = 0; i < actionData.length; i++) {
            this.ExecuteAfterComplete(actionData[i],"show");
        }

    };

    public ExecuteAfterComplete(actionData:any,type:'hide'|'show')
    {
        actionData.then((result)=>{
            if(result==null)
                return;
            if(typeof result.Actions!='undefined'&&Array.isArray(result.Actions))
                for(let current of result.Actions)
                {
                    current.Execute();
                }else
                if(result.ActionType==type)
                    result.Execute();
        })
    }


    public SetFormulaValue(field, fieldName, data) {
        let fieldData = field.GetDataStore();
        fieldData.OriginalValues = data;
        fieldData.numericalValue = 0;
        if (typeof data.value != 'undefined')
            fieldData.value = data.value;

        if (typeof data.selectedValues != 'undefined')
            fieldData.selectedValues = data.selectedValues;
        if (typeof data.amount != 'undefined') {
            fieldData.amount = data.amount;
            fieldData.numericalValue=data.amount;
        }
        if (RedNaoPathExists(fieldData, 'value')) {
            fieldData.label = fieldData.value.toString();
            if (fieldData.value == '')
                fieldData.value = 0;
            else if (!isNaN(fieldData.value)) {
                fieldData.value = parseFloat(data.value);
                fieldData.numericalValue = data.value;
            }
            if (typeof data.numericalValue != 'undefined')
                fieldData.numericalValue = data.numericalValue;

        } else {
            if (typeof fieldData.selectedValues != 'undefined') {
                fieldData.label = "";
                for (let i = 0; i < fieldData.selectedValues.length; i++) {
                    fieldData.label += ";" + fieldData.selectedValues[i].label;
                }
                if (fieldData.label.length > 0)
                    fieldData.label = fieldData.label.substring(1);

            } else {
                fieldData.label = '';
                fieldData.numericalValue = 0;
            }

        }

        this.Data[fieldName] = fieldData;
    }

    public UpdateFormulaFieldsIfNeeded(fieldName,subField) {
        for (let i = 0; i < this.Formulas.length; i++) {
            if (this.Formulas[i].FieldUsedInFormula(fieldName)&&(!this.Formulas[i].FormElement.IsInternal||(this.Formulas[i].FormElement.IsInternal&&this.Formulas[i].FormElement.OriginalId!=subField)))
                this.Formulas[i].UpdateFieldWithValue(this.Data);
        }


    }

    public RefreshAllFormulas = function () {
        for (let i = 0; i < this.Formulas.length; i++)
            this.Formulas[i].UpdateFieldWithValue(this.Data);


    };

    public AddFormula(formElement, formula) {
        this.Formulas.push(new RedNaoFormula(formElement, formula))
    }
}

(window as any).RedNaoFormulaManagerVar=new RedNaoFormulaManager();
declare let RedNaoPathExists:any;