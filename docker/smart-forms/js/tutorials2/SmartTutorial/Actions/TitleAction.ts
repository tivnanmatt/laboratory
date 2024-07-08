import {ActionBase} from "./ActionBase";
declare let rnJQuery:JQueryStatic;
export class TitleAction extends ActionBase{
    public $title:JQuery;
    constructor(public title:string){
        super();
    }

    ExecuteInternal() {
        this.$title=rnJQuery(`<div class="tutorialTitle" style="opacity: 0; width:auto;max-width: 70%;min-height: 0;padding:13px;min-width: 500px;"><span>${this.title}</span></div>`);
        rnJQuery('body').append(this.$title);
        this.$title.css('position','absolute');
        this.$title.css('top','150px');
        this.$title.css('left',rnJQuery(window).width()/2-this.$title.width()/2);
        this.$title.css('z-index', this.tutorial.ZIndex+1000);
        this.$title.velocity({opacity:1},200,"easeInExp");
        return this;
    }

    ClearInternal() {
        this.$title.velocity({opacity:0},200,"easeOutExp",()=>{this.$title.remove();});
    }

}