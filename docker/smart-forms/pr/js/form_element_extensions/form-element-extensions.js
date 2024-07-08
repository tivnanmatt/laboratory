function SmartFormsPRAddExtension(elementName)
{
    sfFormElementBase.Extensions.push({Name:elementName,Create:function(options){return new sfFileUpload(options)}});
}

SmartFormsPRAddExtension('sfFileUpload');
/************************************************************************************* File Upload ***************************************************************************************************/
function sfFileUpload(options)
{
    sfFormElementBase.call(this,options);
    this.Title="Title";

    if(this.IsNew)
    {
        this.Options.ClassName="sfFileUpload";
        this.Options.Title="Title";
        this.Options.Label="Upload File";
        this.Options.Multiple="n";
        this.Options.IsRequired="n";
        this.Options.Placeholder='Choose a file';
        this.Options.MaximumFileSize='0';
        this.Options.MaximumFileSizeMessage='Invalid file size';
        this.Options.UploadButton='Upload Button';
        this.Options.AllowedExtensions='';
    }else{
        this.SetDefaultIfUndefined('Placeholder','Choose a file');
        this.SetDefaultIfUndefined('MaximumFileSizeMessage','Invalid file size');
        this.SetDefaultIfUndefined('UploadButton','Upload');
        this.SetDefaultIfUndefined('MaximumFileSize','0');
        this.SetDefaultIfUndefined('AllowedExtensions','*.*');

    }


}

sfFileUpload.prototype=Object.create(sfFormElementBase.prototype);

sfFileUpload.prototype.CreateProperties=function()
{

    this.Properties.push(new PropertyContainer('general','General').AddProperties([
        new SimpleTextProperty(this,this.Options,"Label","Label",{ManipulatorType:'basic'}),
        new SimpleTextProperty(this,this.Options,"AllowedExtensions","Allowed Extensions",{ManipulatorType:'basic',Notes:'Add the extensions separated by comma, e.g. .jpeg,.png'}),
        new SimpleTextProperty(this,this.Options,"MaximumFileSize","Maximum File Size (in mb)",{ManipulatorType:'basic',Notes:'0 for no maximum, your might also need to <a href="https://www.bitcatcha.com/blog/increase-maximum-upload-file-size-in-wordpress/">configure</a> your site to allow big files'}),
        new SimpleTextProperty(this,this.Options,"MaximumFileSizeMessage","Maximum File Size Message",{ManipulatorType:'basic'}),
        new SimpleTextProperty(this,this.Options,"Placeholder","Placeholder",{ManipulatorType:'basic'}),
        new SimpleTextProperty(this,this.Options,"UploadButton","Upload Button",{ManipulatorType:'basic'}),
        new CheckBoxProperty(this,this.Options,"IsRequired","Required",{ManipulatorType:'basic'}),
        new CheckBoxProperty(this,this.Options,"Multiple","Multiple files",{ManipulatorType:'basic'}),
        new IdProperty(this,this.Options)
    ]));

};

sfFileUpload.prototype.GenerateInlineElement=function()
{
    return '<div class="rednao_label_container col-sm-3"><label class="rednao_control_label" >'+this.Options.Label+'</label></div>\
            <div class="redNaoControls col-sm-9"></div>';
};


sfFileUpload.prototype.GetFileUploadComponent=function(jQueryFileContainer)
{
    var component= rnJQuery('<div class="sfUploadFileElement input-group">\
                                <input class="sfUploadFilePath form-control" placeholder="'+RedNaoEscapeHtml(this.Options.Placeholder)+'" disabled="disabled" type="text" />\
                                <span class="sfUploadFileContainer input-group-addon">\
                                    <span class="sfUploadFileButtonText">'+RedNaoEscapeHtml(this.Options.UploadButton)+'</span>\
                                    <input accept="'+this.Options.AllowedExtensions+'" class="sfUploadFileButton" type="file" name="'+this.Id+'" class="upload"/>\
                                </span>\
                              <div class="sfDeleteButton sfDeletebutton_invisible" style="display: table-cell !important"></div></div>');

    var self=this;
    var clickEvent;
    component.find('.sfUploadFileButton').click(function(){
        component.closest('.form-group').addClass('is-focused');
        clickEvent=function(event){
            if(event.target!=component.find('.sfUploadFileButton')[0])
            {
                component.closest('.form-group').removeClass('is-focused');
                rnJQuery('body').unbind('click', clickEvent);
            }
        };
        rnJQuery('body').click(clickEvent);
    });

    var me=this;
    component.find('.sfUploadFileButton').change(
    function(e){
        rnJQuery('body').unbind('click',clickEvent);
        component.closest('.form-group').removeClass('is-focused');
        var selectedPath=component.find('.sfUploadFileButton').val();

        let maximumFileSize=Number(me.Options.MaximumFileSize);
        if(isNaN(maximumFileSize))
            maximumFileSize=0;

        if(e.target.files.length>0&&maximumFileSize>0)
        {
            let size=e.target.files[0].size;
            if(size>0&&e.target.files[0].size/1048576.0>maximumFileSize)
            {
                alert(me.Options.MaximumFileSizeMessage);
                e.target.value='';
                return;
            }
        }

        if(e.target.files.length>0) {
            let name = e.target.files[0].name;
            let extensions = me.Options.AllowedExtensions.trim().split(',');
            if (extensions.length > 0) {
                if (!extensions.some(x => name.endsWith(x.toLowerCase().trim()))) {
                    alert('Invalid file type');
                    e.target.value = '';
                    return;
                }
            }
        }


        var index=selectedPath.lastIndexOf('\\');
        if(index>=0)
        {
            selectedPath=selectedPath.substring(index+1);
        }
        component.find('.sfUploadFilePath').val(selectedPath);
        if(selectedPath=="")
        {
            component.find(".sfDeleteButton").removeClass("sfDeleteButton_visible").addClass("sfDeleteButton_invisible");
            self.DeleteComponent(component);
        }
        else
        {
            component.find(".sfDeleteButton").removeClass("sfDeleteButton_invisible").addClass("sfDeleteButton_visible");
            if(self.Options.Multiple=="y")
            {
                var emptyElements=0;
                rnJQuery('#'+self.Id+ ' .sfUploadFileButton').each(
                    function()
                    {
                        if(rnJQuery(this).val()=="")
                        {
                            emptyElements++;
                        }
                    }
                );
                if(emptyElements==0)
                    self.AppendComponent(jQueryFileContainer)
            }
        }
    });

    component.find(".sfDeleteButton").click(
    function()
    {
        self.DeleteComponent(component);
    });
    return component;
};

sfFileUpload.prototype.DeleteComponent=function(component)
{


    if(this.JQueryElement.find('.sfUploadFileButton').length>1)
        component.remove();
    else{
        this.JQueryElement.find( '.sfUploadFileButton').val('');
        this.JQueryElement.find('.sfUploadFilePath').val('');


    }
};

sfFileUpload.prototype.GenerationCompleted=function(jQueryElement)
{
    this.AppendComponent(jQueryElement);
};

sfFileUpload.prototype.AppendComponent=function(jQueryElement)
{
    var fileUploadComponent=this.GetFileUploadComponent(jQueryElement);
    jQueryElement.find('.redNaoControls').append(fileUploadComponent);
    if(smartFormsDesignMode)
    {
        jQueryElement.find('.sfUploadFilePath').removeAttr('disabled');
        jQueryElement.find('.sfUploadFileButton').remove();
    }

    jQueryElement.find('.sfUploadFileElement').removeClass('sfUploadFilePathMargin');
    jQueryElement.find('.sfUploadFileElement:not(:last-child)').addClass('sfUploadFilePathMargin');
};

sfFileUpload.prototype.GetValueString=function () {
    var data= [];
    var count=1;
    var self=this;
    if(this.IsIgnored())
        return [];
    this.JQueryElement.find('.sfUploadFileButton').each(function()
    {
        var jqueryFileElement=rnJQuery(this);
        if(rnJQuery.trim(jqueryFileElement.val())!="")
        {
            var fieldName="sfufn"+"@"+self.Id+"@"+count.toString();
            jqueryFileElement.attr('name',fieldName);
            data.push( {path:fieldName});
            count++;
        }else
            jqueryFileElement.removeAttr('name');
    });

    return data;

};

sfFileUpload.prototype.IsValid=function()
{
    if(this.Options.IsRequired=='n')
        return true;

    var isValid=false;
    this.JQueryElement.find('.sfUploadFileButton').each(
        function()
        {
            if(rnJQuery(this).val()!="")
            {
                isValid=true;
            }
        }
    );

    if(isValid)
        return true;

    var self=this;
    this.JQueryElement.find('.sfUploadFileButton').each(
        function()
        {
            if(rnJQuery(this).val()=="")
            {
                rnJQuery('#'+self.Id).addClass('has-error');
                isValid=false;
            }
        }
    );

    return false;
};

sfFileUpload.prototype.StoresInformation=function()
{
    return true;
};