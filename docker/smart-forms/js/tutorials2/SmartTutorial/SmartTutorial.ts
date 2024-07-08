import {Slide} from "./Slide";
declare let rnJQuery:JQueryStatic;
export class SmartTutorial{
    private $background:JQuery;
    private $transparentBackground:JQuery;
    private slides:Slide[]=[];
    public ZIndex=1000;
    public currentSlideIndex=-1;
    public currentSlide:Slide;
    public $nextButton:JQuery;
    private FinishAction: () => void=null;

    constructor(){

    }

    Start() {
        this.$background=rnJQuery('<div style="background:black;opacity:.5;position:fixed;top:0;bottom:0;right:0;left:0;z-index: '+this.ZIndex+';"></div>');
        this.$transparentBackground=rnJQuery('<div class="bootstrap-wrapper" style="background:transparent;position:fixed;top:0;bottom:0;right:0;left:0;z-index: '+(this.ZIndex+2000)+';"></div>');
        this.$nextButton=rnJQuery(`<span style="position:absolute;bottom:20px;right:20px;font-size: 30px;vertical-align: middle;color:white;cursor: pointer;" >
                                                    <span style="vertical-align: middle;" class="glyphicon glyphicon-hand-right"></span>
                                                    <span style="vertical-align: middle;margin-left:1px;" >Next</span>
                                         </span>`);
        this.$transparentBackground.append(this.$nextButton);

        this.$nextButton.click(()=>{
            this.ExecuteNextSlide();
        });
        rnJQuery('body').append(this.$background);
        rnJQuery('body').append(this.$transparentBackground);
        this.currentSlideIndex=-1;
        this.ExecuteNextSlide();

    }

    public AddSlide(slide:Slide)
    {
        slide.tutorial=this;
        this.slides.push(slide);
    }


    public async ExecuteNextSlide()
    {
        this.currentSlideIndex++;
        if (this.currentSlide != null) {
            this.currentSlide.Clear(this.currentSlideIndex < this.slides.length ? this.slides[this.currentSlideIndex] : null);
        }
        if(this.currentSlideIndex==this.slides.length){
            this.Finish();
        }
        this.currentSlide = this.slides[this.currentSlideIndex];
        this.currentSlide.Execute();

        if(this.currentSlideIndex+1==this.slides.length)
        {
            await this.$nextButton.velocityAsync({opacity:0},200,"easeOutExp");
            this.$nextButton.empty();
            this.$nextButton.append(`<span style="vertical-align: middle;" class="glyphicon glyphicon-remove"></span>
                                              <span style="vertical-align: middle;margin-left:1px;" >Close Tutorial</span>`)
            this.$nextButton.velocity({opacity:1},200,"easeInExp");
        }


    }

    public OnFinish(action:()=>void)
    {
        this.FinishAction=action;
    }

    private async Finish() {
        this.$background.velocity({opacity:0},200,"easeOutExp",()=>{this.$background.remove();});
        await this.$transparentBackground.velocityAsync({opacity:0},200,"easeOutExp");
        this.$transparentBackground.remove();
        if(this.FinishAction!=null)
            this.FinishAction();
    }
}