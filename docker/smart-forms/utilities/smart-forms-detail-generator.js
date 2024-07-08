var smartFormsNotifications=null;
function SmartFormDetailGenerator()
{
    smartFormsNotifications=rnJQuery('#smart-forms-notification').RDNotifications();
    smartFormsNotifications.ShowWarning('Starting from version 3.0 a new feature was added that need to index your entry table. <a style="cursor: hand;cursor: pointer;"  id="startIndexing">Click Here To Start</a> (depending on the volumen of the table this could take several minutes).');
    var self=this;
    rnJQuery('#startIndexing').click(function()
    {
        rnJQuery('#smart-forms-notification').empty().append(
            '<div class="progress">'+
                '<div class="progress-bar progress-bar-striped active"  role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%">'+
                    'Indexing Entry Table'+
                '</div>'+
            '</div>'
            );
        self.GenerateDetail();
    });
}

SmartFormDetailGenerator.prototype.GenerateDetail=function()
{
    rnJQuery.ajax({
        url:ajaxurl,
        dataType:"json",
        data:{
            action:"rednao_smart_forms_generate_detail",
            nonde:saveNonce
        },
        success:function()
        {
            smartFormsNotifications.ShowSuccess('Operation executed successfully');
        },
        error:function()
        {
            smartFormsNotifications.ShowError('An error occurred, please try again later');
        }
    });
};


var smartFormsDetailGeneratorVar=null;

rnJQuery(function()
{
    smartFormsDetailGeneratorVar=new SmartFormDetailGenerator();
});