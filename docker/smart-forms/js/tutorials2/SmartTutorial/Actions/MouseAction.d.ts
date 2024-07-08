import { ActionBase } from "./ActionBase";
export declare abstract class MouseAction extends ActionBase {
    protected $mouse: JQuery;
    MoveMouseToElement($target: JQuery, position?: "top" | "center", offsetTop?: number, offsetLeft?: number): Promise<void>;
    CalculatePositionAndDistanceToElement($target: JQuery, position?: "top" | "center", offsetTop?: number, offsetLeft?: number): DistanceAndTimeResult;
    SetMouseCoordinates(coordinates: JQueryCoordinates): void;
    protected GetMouse(): JQuery;
    protected HideMouse(): void;
}
export interface DistanceAndTimeResult {
    Distance: number;
    Top: number;
    Left: number;
}
