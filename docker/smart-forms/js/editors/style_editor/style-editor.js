function RedNaoStyleEditor()
{
    var self=this;
    this.PreviewScreen=rnJQuery('#smartFormStyleEditorContainer');
    this.AttributesCointainer=rnJQuery('#styleEditorAttributes');
    this.Dialog=rnJQuery("#redNaoStyleEditor").dialog(
        {   width:"1200",
            height:"715",
            modal:true,
            autoOpen:false,
            create: function(event, ui){
                rnJQuery('.ui-dialog').wrap('<div class="smartFormsSlider" />');
            },
            open: function(event, ui){
                rnJQuery('.ui-widget-overlay').wrap('<div class="smartFormsSlider" />');

            },
            beforeClose:function(event,ui)
            {

            }


        });
}

RedNaoStyleEditor.prototype.OpenStyleEditor=function(formElement,formElementJQuery)
{
    rnJQuery('#rnStyleEditorAttribute').click();
    this.Dialog.dialog('open');
    this.PreviewScreen.empty();
    var div=rnJQuery("<div></div>");
    this.PreviewScreen.append(div);
    var elementToStyle=formElement.GenerateHtml(div);
    rnJQuery('#allOfTypeOption').text('Every '+formElement.Title +' field');

    RedNaoDragManager.prototype.MakeItemDraggable(formElementJQuery);
    RedNaoDragManager.prototype.MakeItemDraggable(elementToStyle);


    this.AttributesCointainer.empty();
    rnJQuery('.rnEditorContainer').hide();
    this.AttributesCointainer.append("<table style='width: 100%;height: 100%;'><tr><td style='vertical-align:middle'><h1 style='width: 100%;text-align: center;'>"+smartFormsTranslation.ClickInAnElementToEditIt+"</h1></td></tr></table>");
    this.Styler=GetElementStyler(formElement,elementToStyle,this.AttributesCointainer);

};


var RedNaoStyleEditorVar=null;
rnJQuery(function(){
    RedNaoStyleEditorVar=new RedNaoStyleEditor();
});