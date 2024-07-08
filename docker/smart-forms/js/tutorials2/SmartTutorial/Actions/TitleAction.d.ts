import { ActionBase } from "./ActionBase";
export declare class TitleAction extends ActionBase {
    title: string;
    $title: JQuery;
    constructor(title: string);
    ExecuteInternal(): this;
    ClearInternal(): void;
}
