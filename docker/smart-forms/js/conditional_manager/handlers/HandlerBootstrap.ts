
require('./SfConditionalHandlerBase');
require('./SfShowConditionalHandler');
require('./SfMkFieldInvalidHandler');
require('./SfShowStepHandler');

let SmartFormsConditionalHandlerArray:any[]=[];
function SmartFormsGetConditionalHandlerByType(handlerId,options)
{
    let handlers=SmartFormsGetConditionalHandlerArray();
    for(let i=0;i<handlers.length;i++)
    {
        if(handlers[i].id==handlerId)
        {
            return handlers[i].create(options);
        }
    }
    throw ('Invalid handler');
}
function SmartFormsGetConditionalHandlerArray():{Label:string,id:string,create:(options:any)=>SfConditionalHandlerBase,ShouldShow:(builder:RedNaoFormBuilder)=>boolean}[]
{
    SmartFormsConditionalHandlerArray=[
        {Label:"Show fields depending on a condition",id:"SfShowConditionalHandler",create:function(options){return new SfShowConditionalHandler(options)},ShouldShow:(builder:RedNaoFormBuilder)=>{return true}},
        {Label:"Make fields invalid depending on a condition",id:"SfMkFieldInvalidHandler",create:function(options){return new SfMkFieldInvalidHandler(options)},ShouldShow:(builder:RedNaoFormBuilder)=>{return true}},
        {Label:"Show a multiple step tab depending on a condition",id:"SfShowStepHandler",create:function(options){return new SfShowStepHandler(options)},ShouldShow:(builder:RedNaoFormBuilder)=>{return builder.FormType=="sec"}},
    ];

    return SmartFormsConditionalHandlerArray;
}

function SmartFormsCalculateCondition(condition,values,instance,current=null)
{
    let compiledCondition=condition.CompiledCondition;
    if(typeof condition.Mode!='undefined'&&condition.Mode=='Formula')
        compiledCondition=condition.Formula.CompiledFormula;
    let Remote=null;
    if(instance==null)
        Remote=new SmartFormsRemote();
    else
        Remote=instance.GetRemote();
    condition=new Function('formData,Remote,current','return '+compiledCondition);
    return condition(values, Remote, current != null ? current : (instance==null?null:instance.FormElement));
}
RedNaoEventManager.Subscribe('CalculateCondition',function(data){return SmartFormsCalculateCondition(data.Condition,data.Values,data.Instance,data.Current!=null?data.Current:null);});


(window as any).SmartFormsGetConditionalHandlerByType=SmartFormsGetConditionalHandlerByType;
(window as any).SmartFormsGetConditionalHandlerArray=SmartFormsGetConditionalHandlerArray;
(window as any).SmartFormsCalculateCondition=SmartFormsCalculateCondition;