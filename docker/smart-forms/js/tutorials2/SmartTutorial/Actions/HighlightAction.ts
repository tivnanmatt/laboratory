import {ActionBase} from "./ActionBase";
declare let rnJQuery:JQueryStatic;
export class HighlightAction extends ActionBase{


    constructor($elementToHighlight:JQuery)
    {
       super();
       this.$target=$elementToHighlight;
    }

    ExecuteInternal() {
        if(this.$target.data('tutorial-highlighted')==true)
            return;
        this.$target.velocity({opacity:.0},100,"easeOutExp",()=>{
            this.$target.data('tutorial-highlighted',true);
            this.$target.css('z-index', this.GetZIndex(1));
            this.$target.css('position', 'relative');
            this.$target.velocity({opacity:1},100,"easeInExp");
        });
    }

    ClearInternal() {
        this.$target.velocity({opacity:.0},100,"easeOutExp",()=>{
            this.ClearStyles();
            this.$target.removeData('tutorial-highlighted');
            this.$target.velocity({opacity:1},100,"easeOutExp");
        });
    }
}