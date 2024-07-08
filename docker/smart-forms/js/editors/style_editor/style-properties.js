function RedNaoBaseStyleProperty(styleSetter,formElement,elementName,cssProperty,propertyLabel)
{
    this.StyleSetter=styleSetter;
    this.FormElement=formElement;
    this.ElementName=elementName;
    this.CssProperty=cssProperty;
    this.PropertyLabel=propertyLabel;
}

RedNaoBaseStyleProperty.prototype.AppendToElement=function(jqueryElement)
{
    var createdElement=rnJQuery(this.GenerateInlineElement());
    jqueryElement.append(createdElement);
    this.GenerationCompleted(createdElement);
};

RedNaoBaseStyleProperty.prototype.GetPropertyValue=function()
{
    if(RedNaoPathExists(this.FormElement.Options,'Styles.'+this.ElementName+'.Properties.' +this.CssProperty))
        return this.FormElement.Options.Styles[this.ElementName].Properties[this.CssProperty];

    return null;
};

RedNaoBaseStyleProperty.prototype.SetPropertyValue=function(value)
{
    Properties=this.StyleSetter.GetOrCreateSection('Properties');
    Properties[this.CssProperty]=value;
};

RedNaoBaseStyleProperty.prototype.RemoveProperty=function()
{
    if(typeof this.FormElement.Options.Styles[this.ElementName]=='undefined')
        return;
    if(typeof this.FormElement.Options.Styles[this.ElementName].Properties=='undefined')
        return;

    if(typeof this.FormElement.Options.Styles[this.ElementName].Properties[this.CssProperty] =='undefined')
        return;

    delete this.FormElement.Options.Styles[this.ElementName].Properties[this.CssProperty];

    var count=0;
    for(var property in this.FormElement.Options.Styles[this.ElementName].Properties)
    {
        count ++;
        break;
    }
    if(count==0)
    {
        this.StyleSetter.RemoveSection('Properties');
    }

};

/************************************************************************************* Font Family Style ***************************************************************************************************/

function RedNaoFontFamilyStyleProperty(styleSetter,formElement,elementName,cssProperty,propertyLabel)
{
    RedNaoBaseStyleProperty.call(this,styleSetter,formElement,elementName,cssProperty,propertyLabel);

    this.Fonts=fonts = [smartFormsTranslation.Default,
                                    '"Arial","Helvetica","sans-serif"',
                                    '"Arial Black","Gadget","sans-serif"',
                                    '"Comic Sans MS","cursive"',
                                    '"Courier New","Courier","monospace"',
                                    '"Georgia","serif"',
                                    '"Impact","Charcoal","sans-serif"',
                                    '"Lucida Console","Monaco","monospace"',
                                    '"Lucida Sans Unicode","Lucida Grande","sans-serif"',
                                    '"Palatino Linotype","Book Antiqua","Palatino,serif"',
                                    '"Tahoma","Geneva","sans-serif"',
                                    '"Times New Roman","Times","serif"',
                                    '"Trebuchet MS","Helvetica","sans-serif"',
                                    '"Verdana","Geneva","sans-serif"'];



}
RedNaoFontFamilyStyleProperty.prototype=Object.create(RedNaoBaseStyleProperty.prototype);

RedNaoFontFamilyStyleProperty.prototype.GenerateInlineElement=function()
{
    var selectedFont=this.GetPropertyValue();
    if(selectedFont==null)
        selectedFont=smartFormsTranslation.Default;

    var fontOptions="";
    for(var i=0;i<fonts.length;i++)
    {
        if(fonts[i]==selectedFont)
            fontOptions+="<option value='"+fonts[i]+"' selected='sel'>"+fonts[i]+"</option>";
        else
            fontOptions+="<option value='"+fonts[i]+"'>"+fonts[i]+"</option>";

    }

    return "<tr>" +
        "   <td>" +
        this.PropertyLabel +
        "</td>" +
        "   <td> " +
        "<select id='smartDonationsEditFont'  style='width:500px'>"+
        fontOptions+
        "</select>"  +
        "   </td>" +
        "</tr>" ;
};

RedNaoFontFamilyStyleProperty.prototype.GenerationCompleted=function(jQueryElement)
{
    var self=this;
    jQueryElement.find('#smartDonationsEditFont').change(function(){
        var selectedValue=rnJQuery(this).val();
        if(selectedValue==smartFormsTranslation.Default)
            self.RemoveProperty();
        else
            self.SetPropertyValue(selectedValue);

        self.FormElement.ApplyTagStyleForElement(self.ElementName);
    });
};


/************************************************************************************* RedNaoColorStyleProperty ***************************************************************************************************/

function RedNaoColorStyleProperty(styleSetter,formElement,elementName,cssProperty,propertyLabel)
{
    RedNaoBaseStyleProperty.call(this,styleSetter,formElement,elementName,cssProperty,propertyLabel);
}
RedNaoColorStyleProperty.prototype=Object.create(RedNaoBaseStyleProperty.prototype);

RedNaoColorStyleProperty.prototype.GenerateInlineElement=function()
{
    var selectedColor=this.GetPropertyValue();
    if(selectedColor!=null)
        selectedColor=selectedColor.substring(1);
    return "<tr> " +
                "<td>" +
                    this.PropertyLabel +
                    "</td>" +
                    "<td>" +
                    "<input placeholder='"+smartFormsTranslation.Default+"'  class='color'  "+ (selectedColor!=null?("value='"+selectedColor+"'"):"")+"/>"+
                "</td>" +
            "</tr>";
};

RedNaoColorStyleProperty.prototype.GenerationCompleted=function(jQueryElement)
{
    jscolor.init();
    var self=this;
    jQueryElement.find('.color').change(function(){
        var selectedColor=rnJQuery(this).val();

        if(selectedColor=="")
            self.RemoveProperty();
        else
            self.SetPropertyValue('#'+selectedColor);

        self.FormElement.ApplyTagStyleForElement(self.ElementName);

    });
};

