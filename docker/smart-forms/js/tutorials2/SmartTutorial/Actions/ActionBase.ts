import {SmartTutorial} from "../SmartTutorial";
declare let rnJQuery:JQueryStatic;
export abstract class ActionBase{

    public tutorial:SmartTutorial;
    public $target:JQuery;
    public static ArrowOffSet:number=15;
    private TooltipList:ToolTip[]=[];

    public abstract ExecuteInternal();
    public abstract ClearInternal();
    public previousStyle:string;
    private afterExecute:()=>void=null;
    private afterClear:()=>void=null;

    public  Execute()
    {
        return new Promise(resolve => {
            if(this.$target!=null&&this.previousStyle!=null)
                this.previousStyle=this.$target.attr('style');
            let result=this.ExecuteInternal();
            if(this.afterExecute!=null)
                this.afterExecute();
            if(result instanceof Promise)
                result.then(()=>{
                    this.ShowTooltips();
                    resolve();
                });
            else {
                this.ShowTooltips();
                resolve();
            }

        });

    }

    public Clear()
    {
        this.ClearInternal();
        if(this.afterClear!=null)
            this.afterClear();
    }

    public AfterExecute(method:()=>void){
        this.afterExecute=method;
        return this;
    }

    public AfterClear(method:()=>void){
        this.afterClear=method;
        return this;
    }

    public ClearStyles(){
        if(this.previousStyle==undefined)
            this.$target.removeAttr('style');
        else
            this.$target.attr('style',this.previousStyle);
    }

    public GetZIndex(increment:number=0):number{
        return this.tutorial.ZIndex+increment;
    }

    public AddTooltip(text:string,position:Position):ActionBase
    {
        this.TooltipList.push({Text:text,Position:position,$Container:null});
        return this;
    }

    public ShowTooltips()
    {
        for(let tooltip of this.TooltipList)
        {
            tooltip.$Container=rnJQuery(`<div style="opacity:0" class="tutorialBox">${tooltip.Text}</div>`);
            rnJQuery('body').append(tooltip.$Container);
            tooltip.$Container.css('z-index',this.GetZIndex(1000));
            this.SetPosition(tooltip);
            tooltip.$Container.velocity({opacity:1},200,'easeInExp')
        }

    }





    private SetPosition(tooltip: ToolTip) {
        let offset=this.$target.offset();
        let positionClass:string='';
        let tooltipTop:number=0;
        let tooltipLeft:number=0;
        switch (tooltip.Position)
        {
            case "right":
                positionClass='BoxRight';
                tooltipTop=offset.top+this.$target.height()/2-tooltip.$Container.outerHeight()/2;
                tooltipLeft=offset.left+this.$target.outerWidth()+ActionBase.ArrowOffSet;
                break;
            case "left":
                break;
            case "top":
                break;
            case "bottom":
                positionClass='BoxBottom';
                tooltipTop=offset.top+this.$target.outerHeight()+ActionBase.ArrowOffSet;
                tooltipLeft=offset.left+this.$target.outerWidth()/2-tooltip.$Container.outerWidth()/2;
                break;
        }

        tooltip.$Container.addClass(positionClass);
        tooltip.$Container.css('left',tooltipLeft);
        tooltip.$Container.css('top',tooltipTop);
    }

    ClearTooltips() {
        for(let tooltip of this.TooltipList)
            tooltip.$Container.velocity({opacity:0},200,'easeOutExp',()=>{tooltip.$Container.remove()})
    }
}

interface ToolTip{
    Text:string;
    Position:Position;
    $Container:JQuery;
}

export type Position="left"|"right"|"top"|"bottom";