import { MouseAction } from "./MouseAction";
export declare class ClickAction extends MouseAction {
    clearAfterClick: boolean;
    constructor($target: JQuery);
    ExecuteInternal(): Promise<void>;
    ClearInternal(): void;
    ClearAfterClick(): this;
}
