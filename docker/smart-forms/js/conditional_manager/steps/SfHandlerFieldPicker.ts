import {ToastService} from "../../../react/src/shared/utilities/services/ToastService";

class SfHandlerFieldPicker extends SfConditionalStepBase<any> {
    private Select:JQuery;
    constructor(translations, formBuilder, stepConfiguration,stepList) {
        super(translations, formBuilder, stepConfiguration,stepList);
    }


    public InitializeScreen(container) {
        this.FormBuilder.Disable();
        container.css('text-align', 'left');
        container.css('padding-left', '5px');
        container.css('padding-right', '5px');
        let jQueryDocument = rnJQuery(document);
        let self = this;
        rnJQuery('#redNaoElementlist').on("click.FieldPicker", '.rednao-control-group', function (e) {
            e.stopPropagation();
            self.FormElementClicked(rnJQuery(this));
        });
        rnJQuery('#sfMainContainer').append('<div class="smartFormsSlider smartFormsFieldPickerOverlay"><div class="ui-widget-overlay" style="z-index: 1001;width:' + jQueryDocument.width() + 'px;height:' + jQueryDocument.height() + '" ></div></div>');
        rnJQuery('.rednaoformbuilder').addClass('smartFormsFieldPick');
        let pickerInterface = rnJQuery('<div class="fieldPickContainer" style="margin:10px;"></div>');

        let options = "";
        let selectedFields = [];
        if (!this.StepConfiguration.IsNew)
            selectedFields = this.StepConfiguration.Options.AffectedItems;


        for (let i = 0; i < this.FormBuilder.RedNaoFormElements.length; i++) {
            options += '<option ' + (selectedFields.indexOf(this.FormBuilder.RedNaoFormElements[i].Options.Id) >= 0 ? 'selected="selected"' : '') + '  value="' + this.FormBuilder.RedNaoFormElements[i].Options.Id + '">' + this.FormBuilder.RedNaoFormElements[i].GetFriendlyName() + '</option>';

            if(this.FormBuilder.RedNaoFormElements[i].Options.ClassName=='rednaorepeater')
            {
                let repeaterLabel=this.FormBuilder.RedNaoFormElements[i].Options.Label;
                let repeaterId=this.FormBuilder.RedNaoFormElements[i].Options.Id;
                for(let field of this.FormBuilder.RedNaoFormElements[i].Fields)
                {
                    let fieldId=repeaterId+'.'+field.Options.Id;

                    options += '<option ' + (selectedFields.indexOf(fieldId) >= 0 ? 'selected="selected"' : '') + '  value="' + fieldId + '">' + field.Options.Label + '</option>';
                }
            }
        }
        this.Select = rnJQuery('<select size="margin-left:10px;" multiple="multiple" id="redNaoFieldPicked" style="width:100%">' + options + '</select>');
        pickerInterface.append(this.Select);
        this.Select.select2({
            allowClear: true
        }).on("change", function () {
            self.SelectChanged();
        });
        container.append('<h2 style="text-align: left">' + this.Translations[this.StepConfiguration.Label] + '</h2>');
        container.append(pickerInterface);


    };

    public Exit() {
        this.FormBuilder.Enable();
        rnJQuery('#redNaoElementlist').off("click.FieldPicker");
        rnJQuery('.fieldPickerSelected').removeClass('fieldPickerSelected');
        rnJQuery('.rednaoformbuilder').removeClass('smartFormsFieldPick');
        rnJQuery('.smartFormsFieldPickerOverlay').remove();
    };

    public Commit() {
        let selectedValues = this.Select.select2('val');
        if (selectedValues.length == 0) {
            alert(this.Translations["SelectAtLeastOneField"]);
            return false;
        }
        this.StepConfiguration.Options.AffectedItems = selectedValues;
        return true;
    };

    public FormElementClicked(elementClickedJQuery) {

        let fieldId = this.FormBuilder.GetFormElementByContainer(elementClickedJQuery).Id;
        for (let i = 0; i < this.FormBuilder.RedNaoFormElements.length; i++) {
            if (this.FormBuilder.RedNaoFormElements[i].Options.ClassName == 'rednaorepeater') {
                let repeaterId = this.FormBuilder.RedNaoFormElements[i].Options.Id;
                for (let field of this.FormBuilder.RedNaoFormElements[i].Fields) {
                    let repeaterFieldId = repeaterId + '.' + field.Options.Id;

                    if(field.Options.Id==fieldId) {
                        fieldId = repeaterFieldId;

                    }
                }
            }
        }


        let currentlySelectedValues=this.Select.select2('val');
        let alreadyHasRepeaterItems=currentlySelectedValues.some(x=>x.indexOf('.')>=0);

        if((fieldId.indexOf('.')>=0&&currentlySelectedValues.some(x=>x.indexOf('.')==-1))||
            (fieldId.indexOf('.')==-1&&currentlySelectedValues.some(x=>x.indexOf('.')>=0))
        )
        {
            alert('You can\'t mix repeater fields with non repeater fields in a condition');
            return;
        }



        if(fieldId.indexOf('.')>=0){
            let repeaterId=fieldId.split('.')[0];

            for(let selectedFields of currentlySelectedValues)
            {
                let currentRepeaterId=selectedFields.split('.')[0];
                if(currentRepeaterId!=repeaterId) {
                    alert('You can\'t add fields of different repeaters in the same condition');
                    return;
                }
            }


        }







        let selectedFields = this.Select.select2('val');
        if (rnJQuery.inArray(fieldId, selectedFields) >= 0)
            return;
        selectedFields.push(fieldId);
        this.Select.select2('val', selectedFields).change();
    };

    public SelectChanged() {
        let selectedFields = this.Select.select2('val');
        rnJQuery('.fieldPickerSelected').removeClass('fieldPickerSelected');
        for (let i = 0; i < selectedFields.length; i++) {
            rnJQuery('#' + selectedFields[i]).addClass('fieldPickerSelected');
        }
    };

}

(window as any).SfHandlerFieldPicker=SfHandlerFieldPicker;