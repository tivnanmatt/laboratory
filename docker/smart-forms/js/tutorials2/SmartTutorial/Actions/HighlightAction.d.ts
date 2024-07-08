import { ActionBase } from "./ActionBase";
export declare class HighlightAction extends ActionBase {
    constructor($elementToHighlight: JQuery);
    ExecuteInternal(): void;
    ClearInternal(): void;
}
