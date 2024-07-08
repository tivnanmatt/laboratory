function SfLoadPlaceHolderIcon($element,$offsetLeft,$offsetRight,iconOptions)
{
    var $icon=rnJQuery('<span class="sfPlaceHolderIcon '+RedNaoEscapeHtml(iconOptions.ClassName)+' form-control-feedback"></span>').insertAfter($element);
    if(iconOptions.Orientation=='Right')
    {
        $element.parent().addClass('has-feedback');
        if($offsetRight!=null)
            $icon.attr('style','margin-right:'+$offsetRight.outerWidth()+'px !important;');
    }
    else
    {
        $element.parent().addClass('has-feedback-left');
        if($offsetLeft!=null)
            $icon.attr('style','margin-left:'+$offsetLeft.outerWidth()+'px !important;');
    }

    $element.focus(function()
    {
        $icon.addClass('sfActive');
    }).focusout(function(){
        $icon.removeClass('sfActive');
    });
}



