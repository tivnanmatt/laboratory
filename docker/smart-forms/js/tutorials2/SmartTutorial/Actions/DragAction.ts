import {MouseAction} from "./MouseAction";
declare let rnJQuery:JQueryStatic;
export class DragAction  extends MouseAction{
    public originalOffset:JQueryCoordinates=null;
    public $elementToDrag:JQuery;
    public timeout:any;
    public actionCancelled:boolean=false;
    constructor(public $dragSource:JQuery,public $dragTarget,public generateElementToDrag:()=>JQuery)
    {
        super();
    }

    async ExecuteInternal() {
        this.timeout=null;
        if(this.originalOffset==null)
            this.originalOffset=this.GetMouse().offset();
        this.SetMouseCoordinates(this.originalOffset);

        await this.MoveMouseToElement(this.$dragSource);
        if(this.actionCancelled)
            return;
        this.$elementToDrag=this.generateElementToDrag();
        this.$elementToDrag.css('visibility','hidden');
        this.$elementToDrag.css('z-index',this.GetZIndex(1002));
        rnJQuery('body').append(this.$elementToDrag);

        let mouseOffset=this.$mouse.offset();
        this.$elementToDrag.css('position','absolute');
        this.$elementToDrag.css('top',mouseOffset.top-this.$elementToDrag.first().height()/2);
        this.$elementToDrag.css('left',mouseOffset.left-this.$elementToDrag.first().width()/2);
        this.$elementToDrag.css('visibility','visible');

        this.MoveMouseToElement(this.$dragTarget,"top",30);
        let result=this.CalculatePositionAndDistanceToElement(this.$dragTarget,"top",30);
        this.$elementToDrag.velocity({top:result.Top-this.$elementToDrag.first().height()/2,left:result.Left-this.$elementToDrag.first().width()/2},result.Distance,()=>{

            this.timeout=setTimeout(()=>{
                this.$elementToDrag.remove();
                this.ExecuteInternal();
            },1500);


        });
    }



    ClearInternal() {
        this.actionCancelled=true;
        if(this.$elementToDrag!=null) {
            this.$elementToDrag.velocity("stop", true);
            this.$elementToDrag.remove();
            this.$elementToDrag=null;
        }
        if(this.timeout==null) {
            clearTimeout(this.timeout);
            this.timeout=null;
        }
        this.HideMouse();


    }


}