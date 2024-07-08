

/************************************************************************************* Base ***************************************************************************************************/
function SmartFormsBaseStyleSet(formElement,jQueryElementToStyle,attributesCointainer,elementName)
{
    this.FormElement=formElement;
    this.JQueryElementToStyle=jQueryElementToStyle;
    this.ElementName=elementName;
    this.AttributesCointainer=attributesCointainer;

    this.SetupElementHighlight();
}

SmartFormsBaseStyleSet.prototype.SetupElementHighlight=function()
{
    var self=this;
    this.JQueryElementToStyle.find('.'+this.ElementName).hover(
        function(event){
            event.stopPropagation();
            self.JQueryElementToStyle.find('.'+self.ElementName).addClass('redNaoStylerHighlight');
        },
        //unhover
        function(event){
            event.stopPropagation();
            self.JQueryElementToStyle.find('.'+self.ElementName).removeClass('redNaoStylerHighlight');


        }).click(function(){
            self.StartEdition();
        });

};

SmartFormsBaseStyleSet.prototype.StartEdition=function(jQueryTable)
{
    rnJQuery('.rnEditorContainer').show();
    this.AttributesCointainer.empty();
    var properties=this.GetSetProperties();
    var Style=this.GetCurrentElementStyle();
    rnJQuery('#rnCustomStyleContent').val('');
    if(Style!=null)
    {
        rnJQuery('#rnStyleApplyTo').val(Style.Scope);
        if(typeof Style.CustomCSS!='undefined')
            rnJQuery('#rnCustomStyleContent').val(Style.CustomCSS.CSS);
    }
    else
    {
        rnJQuery('#rnStyleApplyTo').val(1);
    }
    for(var i=0;i<properties.length;i++)
    {
        properties[i].AppendToElement(this.AttributesCointainer);
    }

    var self=this;
    rnJQuery('#rnStyleApplyTo').unbind('click').bind('click',function(){self.ScopeChanged();});
    rnJQuery('#rnApplyCustomRule').unbind('click').bind('click',function(){self.ApplyCustomCSS();});

};

SmartFormsBaseStyleSet.prototype.ApplyCustomCSS=function()
{
    var cssText=rnJQuery.trim(rnJQuery('#rnCustomStyleContent').val());
    if(cssText.length==0)
    {
        this.RemoveSection('CustomCSS');
        return;
    }

    var section=this.GetOrCreateSection('CustomCSS');
    section.CSS=cssText;
    this.FormElement.ApplyTagStyleForElement(this.ElementName);
};

SmartFormsBaseStyleSet.prototype.GetOrCreateSection=function(sectionName)
{
    if(typeof this.FormElement.Options.Styles[this.ElementName]=='undefined')
        this.FormElement.Options.Styles[this.ElementName]={Scope:rnJQuery('#rnStyleApplyTo').val(),Properties:{}};
    if(typeof this.FormElement.Options.Styles[this.ElementName][sectionName]=='undefined')
        this.FormElement.Options.Styles[this.ElementName][sectionName]={};

    return this.FormElement.Options.Styles[this.ElementName][sectionName];

};


SmartFormsBaseStyleSet.prototype.RemoveSection=function(sectionName)
{
    delete this.FormElement.Options.Styles[this.ElementName][sectionName];
    var count=0;
    for(var i=0 in this.FormElement.Options.Styles[this.ElementName])
        count++;

    if(count==0)
        delete this.FormElement.Options.Styles[sectionName];

};

SmartFormsBaseStyleSet.prototype.ScopeChanged=function()
{
    var Style=this.GetCurrentElementStyle();
    if(Style==null)
        return;
    Style.Scope=rnJQuery('#rnStyleApplyTo').val();
    this.FormElement.ApplyTagStyleForElement(this.ElementName);
};

SmartFormsBaseStyleSet.prototype.GetCurrentElementStyle=function()
{
    if(!RedNaoPathExists(this.FormElement,'Options.Styles.'+this.ElementName))
        return null;

    return this.FormElement.Options.Styles[this.ElementName];
};

SmartFormsBaseStyleSet.prototype.GetSetProperties=function()
{

};

/************************************************************************************* Title Style Set ***************************************************************************************************/
function SmartFormsTitleStyleSet(formElement,jQueryElementToStyle,attributesCointainer,elementName)
{
    SmartFormsBaseStyleSet.call(this,formElement,jQueryElementToStyle,attributesCointainer,elementName);
}
SmartFormsTitleStyleSet.prototype=Object.create(SmartFormsBaseStyleSet.prototype);


SmartFormsTitleStyleSet.prototype.GetSetProperties=function()
{
    var properties=[];
    properties.push(new RedNaoFontFamilyStyleProperty(this,this.FormElement,this.ElementName,"Font-Family","Font Family"));
    properties.push(new RedNaoColorStyleProperty(this,this.FormElement,this.ElementName,"Color","Title Color"));
    properties.push(new RedNaoColorStyleProperty(this,this.FormElement,this.ElementName,"border-bottom-color","Border Color"));
    return properties;
};



/************************************************************************************* Label Style Set ***************************************************************************************************/
function SmartFormsLabelStyleSet(formElement,jQueryElementToStyle,attributesCointainer,elementName)
{
    SmartFormsBaseStyleSet.call(this,formElement,jQueryElementToStyle,attributesCointainer,elementName);
}
SmartFormsLabelStyleSet.prototype=Object.create(SmartFormsBaseStyleSet.prototype);

SmartFormsLabelStyleSet.prototype.GetSetProperties=function()
{
    var properties=[];
    properties.push(new RedNaoFontFamilyStyleProperty(this,this.FormElement,this.ElementName,"Font-Family","Font Family"));
    properties.push(new RedNaoColorStyleProperty(this,this.FormElement,this.ElementName,"Color","Color"));
    return properties;
};

/************************************************************************************* Input Style Set ***************************************************************************************************/
function SmartFormsInputStyleSet(formElement,jQueryElementToStyle,attributesCointainer,elementName)
{
    SmartFormsBaseStyleSet.call(this,formElement,jQueryElementToStyle,attributesCointainer,elementName);
}
SmartFormsInputStyleSet.prototype=Object.create(SmartFormsBaseStyleSet.prototype);

SmartFormsInputStyleSet.prototype.GetSetProperties=function()
{
    var properties=[];
    properties.push(new RedNaoFontFamilyStyleProperty(this,this.FormElement,this.ElementName,"Font-Family","Font Family"));
    properties.push(new RedNaoColorStyleProperty(this,this.FormElement,this.ElementName,"Color","Color"));
    return properties;
};

/************************************************************************************* Prepend Style Set ***************************************************************************************************/
function SmartFormsPrependStyleSet(formElement,jQueryElementToStyle,attributesCointainer,elementName)
{
    SmartFormsBaseStyleSet.call(this,formElement,jQueryElementToStyle,attributesCointainer,elementName);
}
SmartFormsPrependStyleSet.prototype=Object.create(SmartFormsBaseStyleSet.prototype);

SmartFormsPrependStyleSet.prototype.GetSetProperties=function()
{
    var properties=[];
    properties.push(new RedNaoFontFamilyStyleProperty(this,this.FormElement,this.ElementName,"Font-Family","Font Family"));
    properties.push(new RedNaoColorStyleProperty(this,this.FormElement,this.ElementName,"Color","Color"));
    properties.push(new RedNaoColorStyleProperty(this,this.FormElement,this.ElementName,"background-color","Background Color"));
    return properties;
};

/************************************************************************************* Checkbox Style Set ***************************************************************************************************/
function SmartFormsCheckBoxStyleSet(formElement,jQueryElementToStyle,attributesCointainer,elementName)
{
    SmartFormsBaseStyleSet.call(this,formElement,jQueryElementToStyle,attributesCointainer,elementName);
}
SmartFormsCheckBoxStyleSet.prototype=Object.create(SmartFormsBaseStyleSet.prototype);

SmartFormsCheckBoxStyleSet.prototype.GetSetProperties=function()
{
    var properties=[];
    properties.push(new RedNaoColorStyleProperty(this,this.FormElement,this.ElementName,"background-color","Background Color"));
    return properties;
};

/************************************************************************************* Button Style Set ***************************************************************************************************/
function SmartFormsButtonStyleSet(formElement,jQueryElementToStyle,attributesCointainer,elementName)
{
    SmartFormsBaseStyleSet.call(this,formElement,jQueryElementToStyle,attributesCointainer,elementName);
}
SmartFormsButtonStyleSet.prototype=Object.create(SmartFormsBaseStyleSet.prototype);

SmartFormsButtonStyleSet.prototype.GetSetProperties=function()
{
    var properties=[];
    properties.push(new RedNaoFontFamilyStyleProperty(this,this.FormElement,this.ElementName,"Font-Family","Font Family"));
    properties.push(new RedNaoColorStyleProperty(this,this.FormElement,this.ElementName,"Color","Color"));
    properties.push(new RedNaoColorStyleProperty(this,this.FormElement,this.ElementName,"background-color","Background Color"));

    return properties;
};

/************************************************************************************* File Button Style Set ***************************************************************************************************/
function SmartFormsFileButtonStyleSet(formElement,jQueryElementToStyle,attributesCointainer,elementName)
{
    SmartFormsBaseStyleSet.call(this,formElement,jQueryElementToStyle,attributesCointainer,elementName);
}
SmartFormsFileButtonStyleSet.prototype=Object.create(SmartFormsBaseStyleSet.prototype);

SmartFormsFileButtonStyleSet.prototype.GetSetProperties=function()
{
    var properties=[];
    properties.push(new RedNaoFontFamilyStyleProperty(this,this.FormElement,this.ElementName,"Font-Family","Font Family"));
    properties.push(new RedNaoColorStyleProperty(this,this.FormElement,this.ElementName,"Color","Color"));
    properties.push(new RedNaoColorStyleProperty(this,this.FormElement,this.ElementName,"background-color","Background Color"));

    return properties;
};

