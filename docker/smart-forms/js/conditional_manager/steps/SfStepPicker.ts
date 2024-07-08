class SfStepPicker extends SfConditionalStepBase<SfStepPickerOptions> {
    private $container:JQuery;
    constructor(translations, formBuilder, stepConfiguration,stepList) {
        super(translations, formBuilder, stepConfiguration,stepList);

    }



    public InitializeScreen(container) {
        this.$container=container;

        container.css('text-align', 'left');
        container.css('padding-left', '5px');
        container.css('padding-right', '5px');


        container.append('<h2 style="text-align: left">' + this.Translations[this.StepConfiguration.Label] + '</h2>');

        let count=0;
        if( SmartFormsAddNewVar.FormBuilder.MultipleStepsDesigner!=null)
            for(let step of SmartFormsAddNewVar.FormBuilder.MultipleStepsDesigner.Options.Steps)
            {
                let checked='';
                if(!this.StepConfiguration.IsNew)
                {
                    if(this.StepConfiguration.Options.StepsToShow.find(x=>x==step.Id)!=null)
                        checked='checked="checked"';
                }
                count++;
                let icon;
                if(step.Icon=='def')
                    icon='<span style="margin-left: 3px" class="badge badge-info">' + count + '</span> ';
                else
                    icon='<span class="' + step.Icon + '"></span> ';
                container.append(
                    `<div class="row" style="padding-left:20px;display: flex;vertical-align: middle;align-items: center;">
                            <input ${checked} class="stepItem" type="checkbox" value="${step.Id}" style="margin:0"/>
                            ${icon}<span style="margin-left: 3px;font-size: 15px;" >${step.Text}</span>
                         </div>`
                );
            }


        let name = 'Invalid value';
    };

    public Exit() {

    };

    public Commit() {
        this.StepConfiguration.Options.StepsToShow=[];
        this.$container.find('.stepItem:checked').each((index,value)=>{
            this.StepConfiguration.Options.StepsToShow.push(rnJQuery(value).val());
        });
        if(this.StepConfiguration.Options.StepsToShow.length==0)
        {
            alert('Please select at least one step');
            return false;
        }
        return true;
    }

}


(window as any).SfStepPicker=SfStepPicker;

interface SfStepPickerOptions extends SfConditionalStepOptions{
    StepsToShow:any[];
}