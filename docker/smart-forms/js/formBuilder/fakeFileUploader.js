
function fakeFileUploader(options)
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
    }


}

fakeFileUploader.prototype=Object.create(sfFormElementBase.prototype);

fakeFileUploader.prototype.CreateProperties=function()
{
    this.Properties.push(new SimpleTextProperty(this,this.Options,"Label","Label",{ManipulatorType:'basic'}));
    this.Properties.push(new CheckBoxProperty(this,this.Options,"Multiple","Multiple files",{ManipulatorType:'basic'}));
    this.Properties.push(new CheckBoxProperty(this,this.Options,"IsRequired","Required",{ManipulatorType:'basic'}));
};

fakeFileUploader.prototype.GenerateInlineElement=function()
{
    return '<div class="rednao_label_container col-sm-3"><label class="rednao_control_label" >'+this.Options.Label+'</label></div>\
            <div class="redNaoControls col-sm-9"></div>';
};


fakeFileUploader.prototype.GetFileUploadComponent=function(jQueryFileContainer)
{
    var component= rnJQuery('<div class="sfUploadFileElement input-group" style="width: 100%">\
                                <input class="sfUploadFileButton form-control" type="text" name="'+this.Id+'" class="upload form-control"/>\
                              <div class="sfDeleteButton sfDeletebutton_invisible" style="display: table-cell !important"></div></div>');

    var self=this;
    var clickEvent;
    component.find('.sfUploadFileButton').click(function(){
        component.closest('.form-group').addClass('is-focused');
        clickEvent=function(event){
            if(event.target!=component.find('.sfUploadFileButton')[0])
            {
                component.closest('.form-group').removeClass('is-focused');
                $('body').unbind('click', clickEvent);
            }
        };
        $('body').click(clickEvent);
    });

    component.find('.sfUploadFileButton').change(
    function(){
        $('body').unbind('click',clickEvent);
        component.closest('.form-group').removeClass('is-focused');
        var selectedPath=component.find('.sfUploadFileButton').val();
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

fakeFileUploader.prototype.DeleteComponent=function(component)
{

    if(rnJQuery('#'+this.Id+ ' .sfUploadFileButton').length>1)
        component.remove();
};

fakeFileUploader.prototype.GenerationCompleted=function(jQueryElement)
{
    this.AppendComponent(jQueryElement);
};

fakeFileUploader.prototype.SetData=function(data)
{
    this.JQueryElement.find('.sfUploadFileElement').remove();
    for(var i=0;i<data.length;i++)
    {
        var fileUploadComponent=this.GetFileUploadComponent(this.JQueryElement);
        fileUploadComponent.find('input').val(data[i].path);
        this.JQueryElement.find('.redNaoControls').append(fileUploadComponent);
    }
    this.AppendComponent(this.JQueryElement);
};



fakeFileUploader.prototype.AppendComponent=function(jQueryElement)
{
    var fileUploadComponent=this.GetFileUploadComponent(jQueryElement);
    jQueryElement.find('.redNaoControls').append(fileUploadComponent);

    jQueryElement.find('.sfUploadFileElement').removeClass('sfUploadFilePathMargin');
    jQueryElement.find('.sfUploadFileElement:not(:last-child)').addClass('sfUploadFilePathMargin');
};

fakeFileUploader.prototype.GetValueString=function () {
    var data= [];
    var count=1;
    var self=this;
    if(this.IsIgnored())
        return [];
    rnJQuery('#'+this.Id+ ' .sfUploadFileElement').each(function()
    {
        var path=rnJQuery.trim(rnJQuery(this).find('input').val());
        if(path=="")
            return;

        data.push({
            path:path,
            type:"image/png"
        });
    });

    return data;

};

fakeFileUploader.prototype.IsValid=function()
{
    if(this.Options.IsRequired=='n')
        return true;

    var isValid=false;
    rnJQuery('#'+this.Id+ ' .sfUploadFileButton').each(
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
    rnJQuery('#'+this.Id+ ' .sfUploadFileButton').each(
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

fakeFileUploader.prototype.StoresInformation=function()
{
    return true;
};
exports.fakeFileUploader=fakeFileUploader;