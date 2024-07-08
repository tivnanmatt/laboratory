/**
 * Created by edseventeen on 11/23/13.
 */
function RedNaoInternalEventManager()
{
    this.Events={};
}

RedNaoInternalEventManager.prototype.Subscribe=function(eventName,callBack)
{
    if(typeof this.Events[eventName]=='undefined')
        this.Events[eventName]=[];

    this.Events[eventName].push(callBack);
};

RedNaoInternalEventManager.prototype.Publish=function(eventName,args)
{
    var eventArray=this.Events[eventName];
    if(typeof  eventArray=='undefined')
        return;

    var result;
    for(var i=0;i<eventArray.length;i++)
    {
        try{
            if(typeof args=='undefined')
                result=eventArray[i]();
            else
                result=eventArray[i](args);
        }catch (Exception){
            console.log('Error catched',Exception);
        }
    }

    return result;
};

if(typeof RedNaoEventManager=='undefined')
{
    var RedNaoEventManager=new RedNaoInternalEventManager();
}
