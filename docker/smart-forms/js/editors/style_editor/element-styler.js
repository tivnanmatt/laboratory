//noinspection JSUnusedGlobalSymbols
var sfElementStylerExtensions=[];

function GetElementStyler(formElement,elementToStyle,attributesCointainer)
{
    if(formElement.Options.ClassName=="rednaotitle")
        return new RedNaoTitleStyler(formElement,elementToStyle,attributesCointainer);
    if(formElement.Options.ClassName=="rednaotextinput")
        return new RedNaoTextInputStyler(formElement,elementToStyle,attributesCointainer);
    if(formElement.Options.ClassName=="rednaoprependedtext")
        return new RedNaoPrependTextInputStyler(formElement,elementToStyle,attributesCointainer);
    if(formElement.Options.ClassName=="rednaoappendedtext")
        return new RedNaoAppendTextInputStyler(formElement,elementToStyle,attributesCointainer);
    if(formElement.Options.ClassName=="rednaoprependedcheckbox")
        return new RedNaoPrependCheckBoxStyler(formElement,elementToStyle,attributesCointainer);
    if(formElement.Options.ClassName=="rednaoappendedcheckbox")
        return new RedNaoAppendCheckBoxStyler(formElement,elementToStyle,attributesCointainer);
    if(formElement.Options.ClassName=="rednaotextarea")
        return new RedNaoTextAreaStyler(formElement,elementToStyle,attributesCointainer);
    if(formElement.Options.ClassName=="rednaodatepicker")
        return new RedNaoTextAreaStyler(formElement,elementToStyle,attributesCointainer);
    if(formElement.Options.ClassName=="rednaoname")
        return new RedNaoNameStyler(formElement,elementToStyle,attributesCointainer);
    if(formElement.Options.ClassName=="rednaophone")
        return new RedNaoPhoneStyler(formElement,elementToStyle,attributesCointainer);
    if(formElement.Options.ClassName=="rednaoemail")
        return new RedNaoTextInputStyler(formElement,elementToStyle,attributesCointainer);
    if(formElement.Options.ClassName=="rednaonumber")
        return new RedNaoTextInputStyler(formElement,elementToStyle,attributesCointainer);
    if(formElement.Options.ClassName=="rednaoaddress")
        return new RedNaoAddressStyler(formElement,elementToStyle,attributesCointainer);
    if(formElement.Options.ClassName=="rednaomultipleradios")
        return new RedNaoRadioStyler(formElement,elementToStyle,attributesCointainer);
    if(formElement.Options.ClassName=="rednaomultiplecheckboxes")
        return new RedNaoCheckBoxStyler(formElement,elementToStyle,attributesCointainer);
    if(formElement.Options.ClassName=="rednaoselectbasic")
        return new RedNaoSelectBasicStyler(formElement,elementToStyle,attributesCointainer);
    if(formElement.Options.ClassName=="rednaosubmissionbutton")
        return new RedNaoSubmissionButtonStyler(formElement,elementToStyle,attributesCointainer);
    if(formElement.Options.ClassName=="sfFileUpload")
        return new RedNaoFileUploadStyler(formElement,elementToStyle,attributesCointainer);

    for(var i=0;i<RedNaoBaseElementStyler.Extensions.length;i++)
        if(RedNaoBaseElementStyler.Extensions[i].Name==formElement.Options.ClassName)
            return RedNaoBaseElementStyler.Extensions[i].Create(formElement,elementToStyle,attributesCointainer);

    throw 'Element Type Not Found';

}


/************************************************************************************* Base Element Styler ***************************************************************************************************/

function RedNaoBaseElementStyler(formElement,elementToStyle,attributesCointainer)
{
    this.FormElement=formElement;
    this.ElementToStyle=elementToStyle;
    this.AttributesCointainer=attributesCointainer;
    this.StyleSets={};

    this.SetupSelectableElements();
}

RedNaoBaseElementStyler.Extensions=[];

RedNaoBaseElementStyler.prototype.SetupSelectableElements=function()
{

};


/************************************************************************************* Title Element Styler ***************************************************************************************************/
function RedNaoTitleStyler(formElement,elementToStyle,attributesCointainer)
{
    RedNaoBaseElementStyler.call(this,formElement,elementToStyle,attributesCointainer);
}
RedNaoTitleStyler.prototype=Object.create(RedNaoBaseElementStyler.prototype);


RedNaoTitleStyler.prototype.SetupSelectableElements=function()
{
    this.StyleSets.Title=new SmartFormsTitleStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoLegend");
};

/************************************************************************************* Text Input Element Styler ***************************************************************************************************/
function RedNaoTextInputStyler(formElement,elementToStyle,attributesCointainer)
{
    RedNaoBaseElementStyler.call(this,formElement,elementToStyle,attributesCointainer);
}
RedNaoTextInputStyler.prototype=Object.create(RedNaoBaseElementStyler.prototype);


RedNaoTextInputStyler.prototype.SetupSelectableElements=function()
{
    this.StyleSets.Label=new SmartFormsLabelStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"rednao_control_label");
    this.StyleSets.Input=new SmartFormsInputStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoInputText");
    this.StyleSets.Prepend=new SmartFormsPrependStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoPrepend");
};

/************************************************************************************* PrependTextInput ***************************************************************************************************/
function RedNaoPrependTextInputStyler(formElement,elementToStyle,attributesCointainer)
{
    RedNaoBaseElementStyler.call(this,formElement,elementToStyle,attributesCointainer);
}
RedNaoPrependTextInputStyler.prototype=Object.create(RedNaoBaseElementStyler.prototype);


RedNaoPrependTextInputStyler.prototype.SetupSelectableElements=function()
{
    this.StyleSets.Label=new SmartFormsLabelStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"rednao_control_label");
    this.StyleSets.Input=new SmartFormsInputStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoInputText");
    this.StyleSets.Prepend=new SmartFormsPrependStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoPrepend");
};

/************************************************************************************* AppendTextInput ***************************************************************************************************/
function RedNaoAppendTextInputStyler(formElement,elementToStyle,attributesCointainer)
{
    RedNaoBaseElementStyler.call(this,formElement,elementToStyle,attributesCointainer);
}
RedNaoAppendTextInputStyler.prototype=Object.create(RedNaoBaseElementStyler.prototype);


RedNaoAppendTextInputStyler.prototype.SetupSelectableElements=function()
{
    this.StyleSets.Label=new SmartFormsLabelStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"rednao_control_label");
    this.StyleSets.Input=new SmartFormsInputStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoInputText");
    this.StyleSets.Prepend=new SmartFormsPrependStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoAppend");
};

/************************************************************************************* PrependCheckBox ***************************************************************************************************/
function RedNaoPrependCheckBoxStyler(formElement,elementToStyle,attributesCointainer)
{
    RedNaoBaseElementStyler.call(this,formElement,elementToStyle,attributesCointainer);
}
RedNaoPrependCheckBoxStyler.prototype=Object.create(RedNaoBaseElementStyler.prototype);


RedNaoPrependCheckBoxStyler.prototype.SetupSelectableElements=function()
{
    this.StyleSets.Label=new SmartFormsLabelStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"rednao_control_label");
    this.StyleSets.Input=new SmartFormsInputStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoInputText");
    this.StyleSets.Prepend=new SmartFormsCheckBoxStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoPrepend");
};

/************************************************************************************* AppendCheckBox ***************************************************************************************************/
function RedNaoAppendCheckBoxStyler(formElement,elementToStyle,attributesCointainer)
{
    RedNaoBaseElementStyler.call(this,formElement,elementToStyle,attributesCointainer);
}
RedNaoAppendCheckBoxStyler.prototype=Object.create(RedNaoBaseElementStyler.prototype);


RedNaoAppendCheckBoxStyler.prototype.SetupSelectableElements=function()
{
    this.StyleSets.Label=new SmartFormsLabelStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"rednao_control_label");
    this.StyleSets.Input=new SmartFormsInputStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoInputText");
    this.StyleSets.Prepend=new SmartFormsCheckBoxStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoAppend");
};

/************************************************************************************* TextArea ***************************************************************************************************/
function RedNaoTextAreaStyler(formElement,elementToStyle,attributesCointainer)
{
    RedNaoBaseElementStyler.call(this,formElement,elementToStyle,attributesCointainer);
}
RedNaoTextAreaStyler.prototype=Object.create(RedNaoBaseElementStyler.prototype);


RedNaoTextAreaStyler.prototype.SetupSelectableElements=function()
{
    this.StyleSets.Label=new SmartFormsLabelStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"rednao_control_label");
    this.StyleSets.Input=new SmartFormsInputStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoTextAreaInput");
};

/************************************************************************************* Date ***************************************************************************************************/
function RedNaoDatePickerStyler(formElement,elementToStyle,attributesCointainer)
{
    RedNaoBaseElementStyler.call(this,formElement,elementToStyle,attributesCointainer);
}
RedNaoDatePickerStyler.prototype=Object.create(RedNaoBaseElementStyler.prototype);


RedNaoDatePickerStyler.prototype.SetupSelectableElements=function()
{
    this.StyleSets.Label=new SmartFormsLabelStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"rednao_control_label");
    this.StyleSets.Input=new SmartFormsInputStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoDatePicker");
    this.StyleSets.Prepend=new SmartFormsPrependStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoPrepend");
};

/************************************************************************************* Name ***************************************************************************************************/
function RedNaoNameStyler(formElement,elementToStyle,attributesCointainer)
{
    RedNaoBaseElementStyler.call(this,formElement,elementToStyle,attributesCointainer);
}
RedNaoNameStyler.prototype=Object.create(RedNaoBaseElementStyler.prototype);


RedNaoNameStyler.prototype.SetupSelectableElements=function()
{
    this.StyleSets.Label=new SmartFormsLabelStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"rednao_control_label");
    this.StyleSets.Input=new SmartFormsInputStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoInputFirstName");
    this.StyleSets.LastName=new SmartFormsInputStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoInputLastName");
    this.StyleSets.Prepend=new SmartFormsPrependStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoPrepend");
};

/************************************************************************************* Phone ***************************************************************************************************/
function RedNaoPhoneStyler(formElement,elementToStyle,attributesCointainer)
{
    RedNaoBaseElementStyler.call(this,formElement,elementToStyle,attributesCointainer);
}
RedNaoPhoneStyler.prototype=Object.create(RedNaoBaseElementStyler.prototype);


RedNaoPhoneStyler.prototype.SetupSelectableElements=function()
{
    this.StyleSets.Label=new SmartFormsLabelStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"rednao_control_label");
    this.StyleSets.Input=new SmartFormsInputStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoInputArea");
    this.StyleSets.Phone=new SmartFormsInputStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoInputPhone");
    this.StyleSets.Prepend=new SmartFormsPrependStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoPrepend");
};

/************************************************************************************* Address ***************************************************************************************************/
function RedNaoAddressStyler(formElement,elementToStyle,attributesCointainer)
{
    RedNaoBaseElementStyler.call(this,formElement,elementToStyle,attributesCointainer);
}
RedNaoAddressStyler.prototype=Object.create(RedNaoBaseElementStyler.prototype);


RedNaoAddressStyler.prototype.SetupSelectableElements=function()
{
    this.StyleSets.Label=new SmartFormsLabelStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"rednao_control_label");
    this.StyleSets.Input=new SmartFormsInputStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoStreetAddress1");
    this.StyleSets.address1=new SmartFormsInputStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoStreetAddress2");
    this.StyleSets.city=new SmartFormsInputStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoCity");
    this.StyleSets.state=new SmartFormsInputStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoState");
    this.StyleSets.zip=new SmartFormsInputStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoZip");
    this.StyleSets.country=new SmartFormsInputStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoCountry");
    this.StyleSets.Prepend=new SmartFormsPrependStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoPrepend");

};

/************************************************************************************* Multiple Radio ***************************************************************************************************/
function RedNaoRadioStyler(formElement,elementToStyle,attributesCointainer)
{
    RedNaoBaseElementStyler.call(this,formElement,elementToStyle,attributesCointainer);
}
RedNaoRadioStyler.prototype=Object.create(RedNaoBaseElementStyler.prototype);


RedNaoRadioStyler.prototype.SetupSelectableElements=function()
{
    this.StyleSets.Label=new SmartFormsLabelStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"rednao_control_label");
    this.StyleSets.Input=new SmartFormsInputStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoRadio");


};

/************************************************************************************* Multiple Checkbox ***************************************************************************************************/
function RedNaoCheckBoxStyler(formElement,elementToStyle,attributesCointainer)
{
    RedNaoBaseElementStyler.call(this,formElement,elementToStyle,attributesCointainer);
}
RedNaoCheckBoxStyler.prototype=Object.create(RedNaoBaseElementStyler.prototype);


RedNaoCheckBoxStyler.prototype.SetupSelectableElements=function()
{
    this.StyleSets.Label=new SmartFormsLabelStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"rednao_control_label");
    this.StyleSets.Input=new SmartFormsInputStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoCheckBox ");


};

/************************************************************************************* Select Basic ***************************************************************************************************/
function RedNaoSelectBasicStyler(formElement,elementToStyle,attributesCointainer)
{
    RedNaoBaseElementStyler.call(this,formElement,elementToStyle,attributesCointainer);
}
RedNaoSelectBasicStyler.prototype=Object.create(RedNaoBaseElementStyler.prototype);


RedNaoSelectBasicStyler.prototype.SetupSelectableElements=function()
{
    this.StyleSets.Label=new SmartFormsLabelStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"rednao_control_label");
    this.StyleSets.Input=new SmartFormsInputStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoSelect");
};

/************************************************************************************* Submission Button ***************************************************************************************************/
function RedNaoSubmissionButtonStyler(formElement,elementToStyle,attributesCointainer)
{
    RedNaoBaseElementStyler.call(this,formElement,elementToStyle,attributesCointainer);
}
RedNaoSubmissionButtonStyler.prototype=Object.create(RedNaoBaseElementStyler.prototype);


RedNaoSubmissionButtonStyler.prototype.SetupSelectableElements=function()
{
    this.StyleSets.Label=new SmartFormsButtonStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"redNaoSubmitButton");
};

/************************************************************************************* File Upload Styler ***************************************************************************************************/
function RedNaoFileUploadStyler(formElement,elementToStyle,attributesCointainer)
{
    RedNaoBaseElementStyler.call(this,formElement,elementToStyle,attributesCointainer);
}
RedNaoFileUploadStyler.prototype=Object.create(RedNaoBaseElementStyler.prototype);


RedNaoFileUploadStyler.prototype.SetupSelectableElements=function()
{
    this.StyleSets.Label=new SmartFormsLabelStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"rednao_control_label");
    this.StyleSets.Input=new SmartFormsInputStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"sfUploadFilePath");
    this.StyleSets.Button=new SmartFormsFileButtonStyleSet(this.FormElement,this.ElementToStyle,this.AttributesCointainer,"sfUploadFileContainer");


};