import { ActionBase } from "./Actions/ActionBase";
import { SmartTutorial } from "./SmartTutorial";
export declare class Slide {
    private actionList;
    tutorial: SmartTutorial;
    currentAction: ActionBase;
    currentActionIndex: number;
    private highlights;
    constructor();
    AddAction(action: ActionBase): this;
    private ExecuteNextAction;
    Clear(nextSlide: Slide): void;
    Execute(): void;
    private Finish;
}
