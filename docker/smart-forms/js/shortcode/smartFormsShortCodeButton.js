(function() {
    javascriptUrl='';
    tinymce.create('tinymce.plugins.rednao_smart_forms', {
        init : function(ed, url) {
            javascriptUrl=url.substring(0,url.length-13);
            // Register command for when button is clicked
            ed.addCommand('rednao_smart_forms_short_code_clicked', function(a,donationId) {

                var shortCode=rnJQuery('#smartFormShortCodeSelect').val();
                if(shortCode==null)
                    return;
                tinymce.execCommand('mceInsertContent', false,shortCode);

                rnJQuery("#smartformsShortCodeDialog").dialog('close');
                rnJQuery("#smartformsShortCodeDialog").remove();
            }),

            // Register buttons - trigger above command when clicked
            ed.addButton('rednao_smart_forms_button', {title : 'Smart Forms', image: javascriptUrl + '/images/smartFormsIcon.png',
            onclick:function()
            {
                var data={
                    action:"rednao_smart_form_short_code_setup",
                    nonce:smartformsvars.nonce
                };

                rnJQuery.post(ajaxurl,data,smartFormsAjaxCompleted);

            }});
        }
    });


    tinymce.PluginManager.add('rednao_smart_forms_button', tinymce.plugins.rednao_smart_forms);
})();
var smartFormsShortCodeDialog;
function smartFormsAjaxCompleted(result,status)
{
    var shortCodeOptions=rnJQuery.parseJSON(result);


    if(smartFormsShortCodeDialog==null)
    {
        var $optionsSelect=rnJQuery('<select style="display: block;width:100%;margin-bottom: 10px;" ></select>');
        var $elementsSelect=rnJQuery('<select id="smartFormShortCodeSelect" style="display: block;width:100%;"></select>');
        var smartFormsPopUpForm='<div style=""><div id="smartformsShortCodeDialog"  title="Basic modal dialog">';
        smartFormsPopUpForm+='</div></div>';
        var dialog=rnJQuery(smartFormsPopUpForm);
        dialog.find('#smartformsShortCodeDialog').append($optionsSelect).append($elementsSelect);

        ConfigureDialogs(shortCodeOptions,$optionsSelect,$elementsSelect);

        smartFormsShortCodeDialog=dialog.dialog({
        modal:true,
        draggable:false,
        title:'Select a Form ',
        resizable:false,
        buttons:[
            {text: "Apply", click: function() {tinymce.execCommand('rednao_smart_forms_short_code_clicked', false, rnJQuery('#smartFormList').val())}},
            {text: "Cancel", click: function() {rnJQuery(this).dialog("close")}}
        ],
            create: function(event, ui){
                rnJQuery('.ui-dialog').wrap('<div class="smartFormsSlider" />');
            },
            open: function(event, ui){
                rnJQuery('.ui-widget-overlay').wrap('<div class="smartFormsSlider" />');
                rnJQuery(".smartFormsConfigurationFields").val('');
            }
        });
    }else{
        smartFormsShortCodeDialog.dialog('open');
        rnJQuery('#redNaoSelection').val('button');
    }

    function ConfigureDialogs(shortCodeOptions,$optionsSelect,$elementsSelect)
    {
        var isFirst=true;
        for(var i=0;i<shortCodeOptions.length;i++)
        {
            $optionsSelect.append('<option '+(isFirst?'selected="selected"':'')+'>'+RedNaoEscapeHtml(shortCodeOptions[i].Name)+'</option>');
            isFirst=false;
        }

        $optionsSelect.change(function ()
        {
            $elementsSelect.empty();
            var index=rnJQuery(this).find('option:selected').index();
            if(index<0)
                return;


            var selectedOption=shortCodeOptions[index];
            var isFirst=true;
            for(var i=0;i<selectedOption.Elements.length;i++)
            {
                $elementsSelect.append('<option value="['+selectedOption.ShortCode+']'+selectedOption.Elements[i].Id+'[/'+selectedOption.ShortCode+']" '+(isFirst?'selected="selected"':'')+'>'+RedNaoEscapeHtml(selectedOption.Elements[i].Name)+'</option>');
                isFirst=false;
            }
        }).change();

    }



}


