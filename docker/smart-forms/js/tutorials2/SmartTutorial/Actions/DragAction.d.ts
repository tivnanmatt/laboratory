import { MouseAction } from "./MouseAction";
export declare class DragAction extends MouseAction {
    $dragSource: JQuery;
    $dragTarget: any;
    generateElementToDrag: () => JQuery;
    originalOffset: JQueryCoordinates;
    $elementToDrag: JQuery;
    timeout: any;
    actionCancelled: boolean;
    constructor($dragSource: JQuery, $dragTarget: any, generateElementToDrag: () => JQuery);
    ExecuteInternal(): Promise<void>;
    ClearInternal(): void;
}
