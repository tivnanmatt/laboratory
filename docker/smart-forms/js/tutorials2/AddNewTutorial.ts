import {SmartTutorial} from "./SmartTutorial/SmartTutorial";
import {HighlightAction} from "./SmartTutorial/Actions/HighlightAction";
import {Slide} from "./SmartTutorial/Slide";
import {TitleAction} from "./SmartTutorial/Actions/TitleAction";
import {DragAction} from "./SmartTutorial/Actions/DragAction";
import {ClickAction} from "./SmartTutorial/Actions/ClickAction";

declare let rnJQuery:JQueryStatic;
declare let smartFormsShowTutorial:string;
declare let ajaxurl:string;
export class AddNewTutorial{
    private addNewInstance:any;
    private $questionContainer:any;
    private $container:JQuery;
    constructor(){
    }

    public Initialize(addNewInstance:any,$container:JQuery){
        this.$container=$container;
        this.addNewInstance=addNewInstance;
        /*if(smartFormsShowTutorial=="")
            this.AskIfTutorialIsWanted();
        else*/
            this.OpenForm();

    }

    private OpenForm() {
        rnJQuery('#rootContentDiv').removeClass('OpHidden');
        rnJQuery('#loadingScreen').velocity({opacity:0},800,"easeOutExp",function(){rnJQuery('#loadingScreen').remove();});
        this.$container.velocity({opacity:0},800,"easeOutExp",()=>{this.$container.remove();});
    }

    private AskIfTutorialIsWanted() {
        this.$questionContainer=rnJQuery(`<div class="bootstrap-wrapper" style="position: absolute;top:200px;text-align: center;opacity: 0;font-family: Verdana,serif;font-size: 25px;width:100%;">                
                <span><strong>Hello =), </strong> is this your first time using Smart Forms?</span>
                <div style="margin-top:20px;">
                    <button style="font-size:20px;padding: 10px 30px 10px 30px;" class="btn btn-success">Yes</button>
                    <button style="font-size:20px;padding: 10px 30px 10px 30px;"  class="btn btn-danger">No</button>
                </div>
            </div>`);

        this.$questionContainer.find('.btn-success').click(()=>{
            this.$questionContainer.velocity({opacity:0},"easeOutExp",()=>{this.$questionContainer.empty();this.GenerateSecondQuestion();});
        });

        this.$questionContainer.find('.btn-danger').click(()=>{
            rnJQuery.post(ajaxurl,{action:'smart_forms_skip_tutorial',nonce:saveNonce});
            this.OpenForm();
        });
        this.$container.velocity({opacity:0},500,"easeInExp",()=>{
            this.$container.remove();
            rnJQuery('#loadingScreen').append(this.$questionContainer);
            this.$questionContainer.velocity({opacity:1},500,"easeInExp");
        });

    }

    private GenerateSecondQuestion() {
        let $secondQuestion=rnJQuery(`<span><strong>Ah Welcome!</strong> can i give you a quick tutorial of the plugin?</span>
                                        <div style="margin-top:20px;">
                                            <button style="font-size:20px;padding: 10px 30px 10px 30px;" class="btn btn-success">Yes, show me</button>
                                            <button style="font-size:20px;padding: 10px 30px 10px 30px;"  class="btn btn-danger">No, thanks</button>
                                        </div>
                                    `);
        this.$questionContainer.append($secondQuestion);
        this.$questionContainer.velocity({opacity:1},"easeInExp");

        this.$questionContainer.find('.btn-success').click(()=>{
            this.$questionContainer.velocity({opacity:0},"easeOutExp",()=>{
                this.$questionContainer.empty();
                this.StartTutorialAccepted();
            });
        });

        this.$questionContainer.find('.btn-danger').click(()=>{
            rnJQuery.post(ajaxurl,{action:'smart_forms_skip_tutorial',nonce:saveNonce});
            this.OpenForm();
        });
    }

    private StartTutorialAccepted() {
        this.$questionContainer.append(`<span>Alright <strong>Lets Start!</strong></span>`);
        this.$questionContainer.velocity({opacity:1},"easeOutExp",()=>{
            setTimeout(()=>{
               this.StartTutorial();
            },1000);
        });

    }

    private StartTutorial() {
        this.OpenForm();
        let st:SmartTutorial=new SmartTutorial();
        st.AddSlide(new Slide()
            .AddAction(new HighlightAction(rnJQuery('#formSettingsScrollArea')).AddTooltip('Here are all the fields you can use',"right")));
        st.AddSlide(new Slide()
            .AddAction(new TitleAction('You just need to drag them'))
            .AddAction(new HighlightAction(rnJQuery('#formSettingsScrollArea')))
            .AddAction(new HighlightAction(rnJQuery('#newFormContainer')))
            .AddAction(new DragAction(rnJQuery('#components .rednaotextinput'),rnJQuery('#redNaoElementlist'),()=>{
              return rnJQuery('<div class="tutorialDraggedelement bootstrap-wrapper"><div class="form-horizontal span6 temp  tempForm" style="opacity: .2;position:static !important;" >' + rnJQuery('#components .rednaotextinput').html() + '</div></div>');
            }))
        );
        st.AddSlide(new Slide()
            .AddAction(new HighlightAction(rnJQuery('#components .redNaoSubmitButton')).AddTooltip("Remember to add a submit button, it is a draggable field just like the others","right"))
        );
        st.AddSlide(new Slide()
            .AddAction(new HighlightAction(rnJQuery('#smartFormsAfterSubmitTab')))
            .AddAction(new ClickAction(rnJQuery('#smartFormsAfterSubmitTab')).ClearAfterClick())
            .AddAction(new HighlightAction(rnJQuery('#smartFormsAfterSubmitDiv')))
            .AddAction(new HighlightAction(rnJQuery('#smartFormsAfterSubmitDiv tbody')).AddTooltip('Here you can configure what you want to happen after a form is submitted',"bottom"))
            .AddAction(new HighlightAction(rnJQuery('.sfAfterSubmitAction').eq(0)).AddTooltip('Send an email',"right"))
            .AddAction(new HighlightAction(rnJQuery('.sfAfterSubmitAction').eq(1)).AddTooltip('Redirect to another page (like a thank you page)',"right"))
            .AddAction(new HighlightAction(rnJQuery('.sfAfterSubmitAction').eq(2)).AddTooltip('Show a message',"right"))
        );
        st.AddSlide(new Slide()
            .AddAction(new HighlightAction(rnJQuery('#toplevel_page_smart_forms_menu li').eq(4))
                .AddTooltip("And lastly, you can find a bunch of tutorials here","right")
                .AfterExecute(()=>{rnJQuery('#toplevel_page_smart_forms_menu li').eq(4).css('background-color','darkred')})
                .AfterClear(()=>{rnJQuery('#toplevel_page_smart_forms_menu li').eq(4).css('background-color','transparent')})
            )
        );
        st.Start();
        st.OnFinish(()=>{
            rnJQuery('#smartFormsGeneralTab').click();
            rnJQuery.post(ajaxurl,{action:'smart_forms_skip_tutorial',nonce:saveNonce});
        })

    }
}

(<any>window).SmartFormsAddNewTutorial=new AddNewTutorial();