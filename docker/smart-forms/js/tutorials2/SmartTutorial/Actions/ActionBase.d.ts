import { SmartTutorial } from "../SmartTutorial";
export declare abstract class ActionBase {
    tutorial: SmartTutorial;
    $target: JQuery;
    static ArrowOffSet: number;
    private TooltipList;
    abstract ExecuteInternal(): any;
    abstract ClearInternal(): any;
    previousStyle: string;
    private afterExecute;
    private afterClear;
    Execute(): Promise<{}>;
    Clear(): void;
    AfterExecute(method: () => void): this;
    AfterClear(method: () => void): this;
    ClearStyles(): void;
    GetZIndex(increment?: number): number;
    AddTooltip(text: string, position: Position): ActionBase;
    ShowTooltips(): void;
    private SetPosition;
    ClearTooltips(): void;
}
export declare type Position = "left" | "right" | "top" | "bottom";
