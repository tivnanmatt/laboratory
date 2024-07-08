import {ActionBase} from "./Actions/ActionBase";
import {SmartTutorial} from "./SmartTutorial";
import {HighlightAction} from "./Actions/HighlightAction";
declare let rnJQuery:JQueryStatic;
export class Slide{
    private actionList:ActionBase[]=[];
    public tutorial:SmartTutorial;
    public currentAction:ActionBase;
    public currentActionIndex:number;
    private highlights:HighlightAction[]=[];
    constructor()
    {

    }

    public AddAction(action:ActionBase)
    {
        this.actionList.push(action);
        if(action instanceof HighlightAction)
            this.highlights.push(action);
        return this;
    }



    private async ExecuteNextAction() {
        this.currentActionIndex++;
        if(this.actionList.length==this.currentActionIndex)
            this.Finish();
        else
        {
            this.currentAction=this.actionList[this.currentActionIndex];
            this.currentAction.tutorial=this.tutorial;
            await this.currentAction.Execute();
            this.ExecuteNextAction();
        }

    }

    Clear(nextSlide: Slide) {
        for(let action of this.actionList) {
            let preventClear=false;
            action.ClearTooltips();
            if (action instanceof HighlightAction&&nextSlide!=null)
                for (let nextHighlights of nextSlide.highlights)
                    if (action.$target[0] == nextHighlights.$target[0]) {
                        nextHighlights.previousStyle=action.previousStyle;
                        preventClear = true;
                    }
            if(!preventClear)
                action.Clear();


        }

    }

    Execute() {
        this.currentActionIndex=-1;
        this.ExecuteNextAction();
    }

    private Finish() {

    }
}