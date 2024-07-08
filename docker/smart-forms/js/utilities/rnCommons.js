rnJQuery.RNWPAjax=function(action,data,success,fail)
{
    data.action=action;
    //noinspection JSUnresolvedVariable
    rnJQuery.ajax({
        data:data,
        url:ajaxurl,
        dataType:'json',
        method:'post',
        success:success,
        error:function(result){
            if(typeof fail =='undefined')
                alert('An error occurred, please try again');
            else
                fail(result);
        }
    })
};


rnJQuery.RNLog=function(message)
{
    if(window.console)
        console.log(message);
};


rnJQuery.RNLoadLibrary=function(scripts,styles,callBack)
{
    var manager=rnJQuery.RNLoadLibrary.Manager;
    manager.StartLoadingScript(scripts,styles,callBack);
};
rnJQuery.RNLoadLibrary.Manager=new RNLoadLibraryManager();

function RNLoadLibraryManager()
{
    this.AlreadyLoadedUrls=[];
    this.ScriptsBeingLoaded=[];
}

RNLoadLibraryManager.prototype.StartLoadingScript=function(scripts,styles,callBack)
{
    var alreadyLoaded=rnJQuery.RNLoadLibrary.prototype.AlreadyLoadedUrls;
    var i;
    if(styles!=null)
        for(i=0;i<styles.length;i++)
        {
            if(this.AlreadyLoadedUrls.indexOf(styles[i])>=0)
                continue;
            rnJQuery('head').append('<link rel="stylesheet" type="text/css" href="'+styles[i]+'">');
            this.AlreadyLoadedUrls.push(styles[i]);
        }

    if(scripts!=null)
        this.LoadScripts(scripts,callBack,0);
    else
        callBack();

};


RNLoadLibraryManager.prototype.LoadScripts=function(scripts,callBack,scriptIndex)
{

    if(scripts.length<=scriptIndex)
    {
        callBack();
        return;
    }

    if(this.AlreadyLoadedUrls.indexOf(scripts[scriptIndex])>=0)
    {
        this.LoadScripts(scripts, callBack, scriptIndex + 1);
        return;
    }


    var callBackDataToQueue={
        Index:scriptIndex,
        Scripts:scripts,
        CallBack:callBack
    };

    var scriptQueue=null;
    for(var i=0;i<this.ScriptsBeingLoaded.length;i++)
        if(this.ScriptsBeingLoaded[i].ScriptURL==scripts[scriptIndex])
        {
            scriptQueue=this.ScriptsBeingLoaded[i].Queue;
            break;
        }
    if(scriptQueue==null)
    {
        var scriptBeingLoadedItem={
            ScriptURL: scripts[scriptIndex],
            Queue:[callBackDataToQueue]
        };

        this.ScriptsBeingLoaded.push(scriptBeingLoadedItem);

        var self=this;
        rnJQuery.getScript(scripts[scriptIndex],function(){
            self.AlreadyLoadedUrls.push(scripts[scriptIndex]);
            self.ScriptLoaded(scripts[scriptIndex]);
        });

    }else
        scriptQueue.push(callBackDataToQueue);
};

RNLoadLibraryManager.prototype.ScriptLoaded=function(scriptUrl)
{
    var scriptQueue;
    var i;
    for(i=0;i<this.ScriptsBeingLoaded.length;i++)
        if(this.ScriptsBeingLoaded[i].ScriptURL==scriptUrl)
        {
            scriptQueue=this.ScriptsBeingLoaded[i].Queue;
            this.ScriptsBeingLoaded.splice(i,1);
            break;
        }

    for(i=0;i<scriptQueue.length;i++)
        this.LoadScripts(scriptQueue[i].Scripts,scriptQueue[i].CallBack,scriptQueue[i].Index+1);
};