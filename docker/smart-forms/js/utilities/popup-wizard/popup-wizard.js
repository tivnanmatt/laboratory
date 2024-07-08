
function SmartFormsPopUpWizard(Options)
{
    this.Steps=Options.Steps;
    if(typeof Options.OnFinish=='undefined')
        this.OnFinish=function(data){};
    else
        this.OnFinish=Options.OnFinish;
    this.$Dialog=null;
    this.$StepsContainer=null;
    this.CurrentStepIndex=-1;
    this.CurrentLeft=0;
    this.SavedData={};
    if(typeof Options.SavedData!='undefined')
        this.SavedData=Options.SavedData


}



SmartFormsPopUpWizard.prototype.Show=function()
{
    if(this.$Dialog==null)
        this.InitializeDialog();
    this.$Dialog.modal('show');
    this.$StepsContainer.find('tr:first').empty();
    this.CurrentStepIndex=-1;
    this.CurrentLeft=0;
    this.CurrentStep=null;
    this.GoToNextStep();

};

SmartFormsPopUpWizard.prototype.GoToPreviousStep=function()
{
    this.CurrentStepIndex--;
    this.CurrentStep=this.Steps[this.CurrentStepIndex];
    this.CurrentLeft+=this.Steps[this.CurrentStepIndex].GetWidth();
    var self=this;
    this.$StepsContainer.animate({'left':this.CurrentLeft},{complete:function(){
        self.$StepsContainer.find('tr:first').children().last().remove();
    }});
    this.$Dialog.find('.modal-dialog').animate({'width':this.CurrentStep.GetWidth()+30});
};

SmartFormsPopUpWizard.prototype.GoToNextStep=function()
{
    if(this.CurrentStep!=null)
    {
        if(!this.CurrentStep.IsValid())
            return;
    }


    if(this.CurrentStepIndex==this.Steps.length-1)
    {
        this.$Dialog.modal('hide');
        this.OnFinish(this.GetData());
        return;
    }
    this.PreviousStep=this.CurrentStep;
    this.CurrentStepIndex++;
    this.CurrentStep=this.Steps[this.CurrentStepIndex];

    var $nextStepContainer=rnJQuery('<div style="box-sizing: border-box; text-align: left; padding-left: 5px; padding-right: 5px;width:'+this.CurrentStep.GetWidth()+'px"></div>');
    if(this.CurrentStep.GetTitle()!='')
        $nextStepContainer.append('<h2 style="text-align: left">'+this.CurrentStep.GetTitle()+'</h2>');

    var savedData=null;
    if(typeof this.SavedData[this.CurrentStep.GetID()]!='undefined')
        savedData=this.SavedData[this.CurrentStep.GetID()];
    $nextStepContainer.append(this.CurrentStep.GetContent(savedData));
    this.AddButtons($nextStepContainer);
    $nextStepContainer.data('sf-wizard-step',this.CurrentStep);

    this.$StepsContainer.find('tr:first').append(rnJQuery('<td style="vertical-align: top"></td>').append($nextStepContainer) );

    if(this.CurrentStepIndex!=0)
    {
        this.CurrentLeft -= this.PreviousStep.GetWidth();
        this.$StepsContainer.animate({'left': this.CurrentLeft});
    }
    this.$Dialog.find('.modal-dialog').animate({'width':this.CurrentStep.GetWidth()+30});
};

SmartFormsPopUpWizard.prototype.AddButtons=function(container)
{
    var buttonContainer=rnJQuery('<div style="width: 100%; margin-top:20px;overflow: hidden;"></div>');
    if(this.CurrentStepIndex>0)
        buttonContainer.append("<a  style='float:left' class='smartFormsSettingsButton smartFormsPrevious'>Previous</a>");
    var nextButtonLabel=this.CurrentStepIndex==(this.Steps.length-1)?'Finish':'Next';
    buttonContainer.append("<a  style='float:right' class='smartFormsSettingsButton smartFormsNext'>"+nextButtonLabel+"</a>");

    var self=this;
    if(this.CurrentStepIndex>0)
        buttonContainer.find('.smartFormsPrevious').click(function(){self.GoToPreviousStep();});
    buttonContainer.find('.smartFormsNext').click(function(){self.GoToNextStep();});
    container.append(buttonContainer);
};

SmartFormsPopUpWizard.prototype.InitializeDialog=function()
{
    this.$Dialog=rnJQuery(
        '<div class="modal fade" data-backdrop="static"  style="display: none"  tabindex="-1">'+
            '<div class="modal-dialog" style="width:580px">'+
                '<div class="modal-content">'+
                    '<div class="modal-body">'+
                        '<div style="padding:0px;overflow-x:hidden;">'+
                            '<table class="steps-container" style="width:100%;position:relative;left:0;">' +
                                '<tr></tr>'+
                            '</table>'+
                        '</div>'+

                    '</div>'+
                    '<button style="position: absolute !important;top: 0;font-size:25px;right: 5px;" type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>'+
                '</div>'+
            '</div>'+
        '</div>');

    var container=rnJQuery('<div class="bootstrap-wrapper"></div>');
    container.append(this.$Dialog);
    rnJQuery('body').append(container);
    this.$StepsContainer=this.$Dialog.find('.steps-container');
};

SmartFormsPopUpWizard.prototype.GetData=function()
{
    var data=this.SavedData;
    for(var i=0;i<this.Steps.length;i++)
        data[this.Steps[i].GetID()]=this.Steps[i].GetData();

    return data;
};
