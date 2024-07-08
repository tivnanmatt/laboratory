function RedNaoFormulaWindow()
{
    rnJQuery( "#redNaoFormulaAccordion" ).accordion({ clearStyle: true, autoHeight: false });
    var self=this;
    rnJQuery('#smartFormsHumanReadableCheck').click(function(){
        self.ToggleDisplayFormat();
    });
    this.Dialog=rnJQuery("#redNaoFormulaComponent").dialog(
        {   width:"720",
            resizable:false,
            height:"400",
            modal:true,
            autoOpen:false,
            create: function(event, ui){
                rnJQuery(event.target).closest('.ui-dialog').wrap('<div class="smartFormsSlider" />');
            },
            open: function(event, ui){
                rnJQuery('.ui-widget-overlay').wrap('<div class="smartFormsSlider" />');

            },
            beforeClose:function(){
                var formula=rnJQuery('#redNaoFormulaTextArea').val();
                if(formula=="")
                {
                    delete self.SelectedFormElementOptions.Formulas[self.PropertyName];
                    if(self.Image!=null)
                        self.Image.attr('src',smartFormsRootPath+'images/formula.png')
                }
                else{
                    var data={};
                    data.Value=formula;
                    self.GetCompiledData(data,formula);
                    if(self.Image!=null)
                        self.Image.attr('src',smartFormsRootPath+'images/formula_used.png');
                    self.SelectedFormElementOptions.Formulas[self.PropertyName]=data;
                }



                return true;

            }


        });


}



RedNaoFormulaWindow.prototype.ToggleDisplayFormat=function()
{
    alert('a');
    if(rnJQuery(this).is(':checked'))
        this.ShowFieldIDs();
    else
        this.ShowFieldLabel();
};

RedNaoFormulaWindow.prototype.ShowFieldIDs=function()
{

};

RedNaoFormulaWindow.prototype.ShowFieldLabel=function()
{

};

RedNaoFormulaWindow.prototype.GetCompiledData=function(data,formula)
{
    var myArray = formula.match(/field ([^\]]+)/g);
    if(myArray==null)
        myArray=[];
    var compiledFormula='';
    var fieldsUsed=[];
    for(var i=0;i<myArray.length;i++)
    {
        var field=myArray[i].replace(' ','').replace('field','');
        fieldsUsed.push(field);
        field=this.GetValuePropertiesFromField(field);
        formula=formula.replace('['+myArray[i]+']',field);
    }

    compiledFormula+=formula;
    data.RefreshFormData=(typeof this.AdditionalInformation.RefreshFormData=='undefined'?'n':'y');
    data.CompiledFormula=compiledFormula;
    data.FieldsUsed=fieldsUsed;
    data.PropertyName=this.PropertyName;
    data.AdditionalInformation=this.AdditionalInformation;

};

RedNaoFormulaWindow.prototype.GetValuePropertiesFromField=function(fieldId)
{
    var formulaElement=this.GetFormElementFromFormulaFieldId(fieldId);
    if(formulaElement!=null)
        return 'formData.'+formulaElement.Id// formulaElement.GetValuePath();

    return '';
};

RedNaoFormulaWindow.prototype.GetFormElementFromFormulaFieldId=function(field)
{
    for(var i=0;i<this.FormElements.length;i++)
    {
        if(this.FormElements[i].Id==field)
        {
            return this.FormElements[i];
        }
    }

    return null;
};

RedNaoFormulaWindow.prototype.OpenFormulaEditor=function(redNaoFormElements,selectedFormElementOptions,propertyName,additionalInformation,image)
{
    this.FormElements=redNaoFormElements;
    this.Image=image;

    var text=selectedFormElementOptions.Formulas[propertyName];
    if(typeof text=='undefined')
        text="";
    else
        text=text.Value;//text=this.GetHumanRedeableFormula(text.Value);
    this.DisplayFormat="human";

    rnJQuery('#smartFormsHumanReadableCheck').removeAttr('checked');
    rnJQuery('#redNaoFormulaTextArea').val(text);


    this.SelectedFormElementOptions=selectedFormElementOptions;
    this.AdditionalInformation=additionalInformation;
    this.PropertyName=propertyName;
    this.Dialog.dialog('open');

    var formList=rnJQuery('#redNaoFormulaFormFields');
    formList.empty();
    for(var i=0;i<redNaoFormElements.length;i++)
    {
        if(redNaoFormElements[i].StoresInformation())
        {
            var jQueryElement='<li><button onclick="RedNaoFormulaWindowVar.AddFieldToFormula(\''+redNaoFormElements[i].Options.Id+'\');">'+redNaoFormElements[i].Options.Label+'</button></li>';
            formList.append(jQueryElement);

        }
    }


    var customActions=rnJQuery('#redNaoFormulaCommonActions');
    customActions.empty();
    for(i=0;i<smartFormsFormulaCustomActions.length;i++)
    {
        customActions.append(this.CreateCustomAction(smartFormsFormulaCustomActions[i]));
    }

    var fixedValues=rnJQuery('#redNaoFormulaFixedValues');
    fixedValues.empty();
    for(i=0;i<smartFormsFormulaFixedValues.length;i++)
    {
        fixedValues.append(this.CreateCustomAction(smartFormsFormulaFixedValues[i]));
    }

};

RedNaoFormulaWindow.prototype.CreateCustomAction=function(customAction)
{
    var jQueryElement=rnJQuery('<li><button id="asdf123" data-placement="left"  title="'+customAction.ToolTip+'" >'+customAction.Label+'</button></li>');
    jQueryElement.find('button').tooltip();
    jQueryElement.click(function()
    {
        if(customAction.Type=='text')
            rnJQuery('#redNaoFormulaTextArea').insertAtCaret(customAction.GetText());
    });
    return jQueryElement;
};

RedNaoFormulaWindow.prototype.GetHumanRedeableFormula=function(formula)
{
    var myArray = formula.match(/field ([^\]]+)/g);
    var humanRedeableFormula=formula;
    for(var i=0;i<myArray.length;i++)
    {
        var fieldId=myArray[i].replace(' ','').replace('field','');
        var formElement=this.GetFormElementFromFormulaFieldId(fieldId);
        if(formElement==null)
            var fieldToUse=fieldId;
        else
            var fieldToUse=formElement.Options.Label;
        humanRedeableFormula=humanRedeableFormula.replace(myArray[i],'field '+fieldToUse);
    }

    return humanRedeableFormula;

};

RedNaoFormulaWindow.prototype.Validate=function()
{
    var formula= rnJQuery('#redNaoFormulaTextArea').val();
    var myArray = formula.match(/field ([^\]]+)/g);

    for(var i=0;i<myArray.length;i++)
        formula=formula.replace('['+myArray[i]+']','1');
    try{
        var a=eval(formula);
        alert('Formula validated successfully');
    }catch(exception)
    {
        alert('An error ocurred \n'+exception);
    }

};

RedNaoFormulaWindow.prototype.AddFieldToFormula=function(id)
{
    rnJQuery('#redNaoFormulaTextArea').insertAtCaret("[field "+id.trim()+"]");

};



RedNaoFormulaWindow.prototype.CloseFormulaEditor=function(redNaoFormElements)
{
    this.Dialog.dialog('close');
};



rnJQuery.fn.extend({
    insertAtCaret: function(myValue){
        return this.each(function(i) {
            if (document.selection) {
                //For browsers like Internet Explorer
                this.focus();
                var sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();
            }
            else if (this.selectionStart || this.selectionStart == '0') {
                //For browsers like Firefox and Webkit based
                var startPos = this.selectionStart;
                var endPos = this.selectionEnd;
                var scrollTop = this.scrollTop;
                this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
                this.focus();
                this.selectionStart = startPos + myValue.length;
                this.selectionEnd = startPos + myValue.length;
                this.scrollTop = scrollTop;
            } else {
                this.value += myValue;
                this.focus();
            }
        });
    }
});


var RedNaoFormulaWindowVar=new RedNaoFormulaWindow();



