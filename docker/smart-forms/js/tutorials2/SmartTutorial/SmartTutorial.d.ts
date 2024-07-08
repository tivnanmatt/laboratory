import { Slide } from "./Slide";
export declare class SmartTutorial {
    private $background;
    private $transparentBackground;
    private slides;
    ZIndex: number;
    currentSlideIndex: number;
    currentSlide: Slide;
    $nextButton: JQuery;
    private FinishAction;
    constructor();
    Start(): void;
    AddSlide(slide: Slide): void;
    ExecuteNextSlide(): Promise<void>;
    OnFinish(action: () => void): void;
    private Finish;
}
