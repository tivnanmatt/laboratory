declare var smartFormsLoadForm;
var $smWarningMessage=null;

function LoadPreview(data,showMessage:boolean)
{
    data.form_id=0;
    rnJQuery(data.container).empty();
    smartFormsLoadForm(data);
    if(showMessage)
    {
        if($smWarningMessage==null)
        {
            $smWarningMessage=rnJQuery('<div class="bootstrap-wrapper" style="position: fixed;bottom:0;width: 100%;font-size: 20px;">' +
                '<div class="alert alert-warning" role="alert" style="text-align: center;margin:0;"><span class="glyphicon glyphicon-warning-sign"></span>Important! The preview does NOT record the entires and does NOT send any email notification</div>' +
                '</div>');

            rnJQuery('body').append($smWarningMessage);
        }

    }
}
(<any>window).LoadPreview=LoadPreview;

