import {ActionBase} from "./ActionBase";
declare let smartFormsRootPath:string;
declare let rnJQuery:JQueryStatic;
export abstract class MouseAction extends ActionBase{
    protected $mouse:JQuery;
    public MoveMouseToElement($target:JQuery,position:"top"|"center"="center",offsetTop:number=0,offsetLeft:number=0):Promise<void>
    {
        return new Promise<void>((resolve => {
            let mouse:JQuery=this.GetMouse();
            let moveAction=()=>{
                let result=this.CalculatePositionAndDistanceToElement($target,position,offsetTop,offsetLeft);
                this.$mouse.velocity({top:result.Top,left:result.Left},result.Distance,()=>resolve());
            };
            if(this.$mouse.css('opacity')=="0")
                this.GetMouse().velocity({opacity:1},100,"easeInExp",moveAction);
            else
                moveAction();
        }));


    }

    public CalculatePositionAndDistanceToElement($target:JQuery,position:"top"|"center"="center",offsetTop:number=0,offsetLeft:number=0):DistanceAndTimeResult
    {
        let offset=this.$mouse.offset();
        let currentTop=offset.top;
        let currentLeft=offset.left;

        offset=$target.offset();
        let newTop = offset.top + $target.height() / 2 - 10;
        let newLeft = offset.left + $target.width() / 2 - 10;
        if(position=="top") {
            newTop=offset.top;
        }

        newTop+=offsetTop;
        newLeft+=offsetLeft;
        let distance = Math.sqrt(Math.pow(newTop - currentTop, 2) + Math.pow(newLeft - currentLeft, 2));
        return{
            Distance:distance,
            Top:newTop,
            Left:newLeft
        }
    }

    public SetMouseCoordinates(coordinates:JQueryCoordinates)
    {
        this.GetMouse().css('left',coordinates.left);
        this.GetMouse().css('top',coordinates.top);
    }

    protected GetMouse() {
        if(this.$mouse==null)
        {
            this.$mouse=rnJQuery(`<img style="left:0;top:0;position:absolute;z-index:${this.GetZIndex(2000)};" src="${smartFormsRootPath+'images/handPointer.png'}"/>`);
            rnJQuery('body').append(this.$mouse);

        }
        return this.$mouse;
    }

    protected HideMouse(){
        this.GetMouse().velocity({opacity:0},200,"easeOutExp");
    }
}

export interface DistanceAndTimeResult{
    Distance:number,
    Top:number,
    Left:number
}