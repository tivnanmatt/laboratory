function SFTutorials()
{
    this.IsOpen=false;
    this.ContextTutorialsDictionary={};
    this.ContextTutorialLoaded=false;
    var self=this;
    rnJQuery('.sfHelpIconContainer').click(function()
    {
       self.ToggleTutorialScreen();
    });

    var self=this;
    rnJQuery('#btnHelpSearch').click(function(){self.ExecuteSearch()});
    rnJQuery('#tbHelpSearch').keypress(function(e)
    {
        if(e.which == 13) {
            self.ExecuteSearch();
        }
    });

    this.$VideoDialog=rnJQuery(
        '<div class="modal fade" style="display: none;z-index: 100000;">'+
            '<div class="modal-dialog" style="width: 80%;max-width: 900px;">'+
                '<div class="modal-content">'+
                    '<div class="modal-body">'+
                        '<div class="embed-responsive embed-responsive-16by9 video-container">'+
                        '</div>'+
                    '</div>'+
                    '<div class="modal-footer">'+
                        '<table style="width: 100%;">' +
                            '<tr>' +
                                '<td>'+
                                    '<h1 style="margin: 0;text-align: left;" class="title"></h1>'+
                                '</td>'+
                                '<td>'+
                                    '<button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>'+
                                '</td>'+
                            '</tr>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
    );

    this.$VideoDialog.on('hidden.bs.modal',function()
    {
        self.$VideoDialog.find('.video').removeAttr('src');
    });

    var $container=rnJQuery('<div class="bootstrap-wrapper"></div>');
    $container.append(this.$VideoDialog);
    rnJQuery('body').append($container);

    self.LoadContextTutorials();



    //this.$VideoDialog.modal('show');
}

SFTutorials.prototype.LoadContextTutorials=function()
{
    var self=this;
};

SFTutorials.prototype.ContextTutorialRequested=function(contextId)
{
    if(this.IsOpen)
        return;
    if(!this.ContextTutorialLoaded||typeof this.ContextTutorialsDictionary['c'+contextId]=='undefined')
        return;
    this.FillTutorialsList(this.ContextTutorialsDictionary['c'+contextId]);
    rnJQuery('.videoList').css('display','block');
    this.BlinkHelperIcon(rnJQuery('.sfHelpIconContainer').find('span'),5);
};

SFTutorials.prototype.BlinkHelperIcon=function($helperIcon,times)
{
    var self=this;
    $helperIcon.animate({
        color:'red'
    },1000,function(){
            $helperIcon.animate({
                color:'#444'
            },1000,function()
            {
                if(times>0)
                {
                    self.BlinkHelperIcon($helperIcon,times-1);
                }
            });
        }

    );


};

SFTutorials.prototype.ExecuteSearch=function()
{
    rnJQuery('.waitPanel').show('slide',{direction:"up"});
    var searchCriteria=rnJQuery('#tbHelpSearch').val();
    var self=this;


};

SFTutorials.prototype.TutorialsLoaded=function(data)
{
    rnJQuery('.waitPanel').hide('slide',{direction:"up"});
    if(data.success!=true)
    {
        alert('An error occurred, please try again later');
        return;
    }

    var self=this;
    rnJQuery('.videoList').hide('slide',{direction:"left"},function(){
        rnJQuery('.videoList').empty();
        if(data.data.Tutorials.length==0)
        {
            rnJQuery('.videoList').append('<span>Sorry, there are no tutorials for this topic</span>')
        }else{
            self.FillTutorialsList(data.data.Tutorials);
        }
        rnJQuery('.videoList').show('slide',{direction:"left"});
    });
};

SFTutorials.prototype.FillTutorialsList=function(tutorials)
{
    rnJQuery('.videoList').empty();
    for(var i=0;i<tutorials.length;i++)
        rnJQuery('.videoList').append(this.CreateTutorialItem(tutorials[i]));
};

SFTutorials.prototype.CreateTutorialItem=function(tutorial)
{
    var item;
    if(tutorial.type=='v')
        item= rnJQuery('<a href="'+tutorial.link+'" class="list-group-item"><span class="glyphicon glyphicon-facetime-video" style="vertical-align: top;"></span>'+RedNaoEscapeHtml(tutorial.title)+'</a>');
    else
        item= rnJQuery('<a href="'+tutorial.link+'" class="list-group-item" target="_blank"><span class="glyphicon glyphicon-globe" style="vertical-align: top;"></span>'+RedNaoEscapeHtml(tutorial.title)+'</a>');

    this.OpenVideoPopUp(item,tutorial);
    return item;
};

SFTutorials.prototype.OpenVideoPopUp=function(item,tutorial)
{
    var self=this;
    if(tutorial.type=='v')
        item.click(function(e)
        {
            e.preventDefault();
            self.$VideoDialog.find('.title').text(tutorial.title);
            self.$VideoDialog.find('.video').attr('src',tutorial.link+'?autoplay=1');
            self.$VideoDialog.modal('show');
        });

};

SFTutorials.prototype.ToggleTutorialScreen=function()
{
    var newWidth=0;
    if(!this.IsOpen)
        newWidth=400;

    rnJQuery('.sfHelpContent').animate(
        {
            width:newWidth
        },{
            duration:1000,
            easing:'easeInOutExpo'
        }
    );
    this.IsOpen=!this.IsOpen;
};




rnJQuery(function()
{
   new SFTutorials();
});