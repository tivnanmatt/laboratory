
namespace SmartFormsFields {
    export class rednaosignature extends sfFormElementBase<any>{
        private IsDynamicField=true;
        private amount:number=0;
        constructor(options:any,serverOptions:any)
        {
            super(options,serverOptions);
            if(this.IsNew)
            {
                this.Options.ClassName='rednaosignature';
                this.Options.Label='Signature';
                this.Options.CustomCSS='';
                this.Options.Height=150;
            }

            rnJQuery(window).resize(()=>{
                this.ExecuteResize();
            });

        }

        GetValueString():any {
            if(this.IsIgnored())
                return {value:'',native:'',image:''};
            var result=this.JQueryElement.find('.signatureContainer').jSignature('getData','svgbase64');
            if(result==null||result.length==null)
                result='';
            else
                result=result[1];

            var base30=this.JQueryElement.find('.signatureContainer').jSignature('getData','base30');
            if(base30==null||base30.length==null)
                base30='';
            else
                base30=base30[1];
            let image=this.JQueryElement.find('.signatureContainer').jSignature('getData','image');
            if(image!=null&&image.length>1)
                image=image[1];
            return {value:result,native:base30,image:image,tok:new Date().getTime()+'_'+Math.random()};
        }

        SetData(data: any) {
            if(typeof data.native!='undefined'&&data.native!='')
            {
                this.JQueryElement.find('.signatureContainer').jSignature('setData',"data:image/jsignature;base30,"+data.native);
            }
        }

        IsValid(): boolean {

            if(this.Options.IsRequired=='y'&&typeof rnJQuery('.signatureContainer').jSignature('getData','native')[0]=='undefined')
            {
                rnJQuery('#'+this.Id).addClass('has-error');
                this.AddError('root',this.InvalidInputMessage);
            }
            else
                this.RemoveError('root');

            return this.InternalIsValid();
        }

        ExecuteResize(){
            let width:number=this.JQueryElement.find('.redNaoControls').width();
            let data=this.JQueryElement.find('.signatureContainer').jSignature('getData','base30');
            this.JQueryElement.find('.signatureContainer').empty().jSignature({width:width,height:this.Options.Height});
            this.JQueryElement.find('.signatureContainer').jSignature('setData',"data:image/jsignature;base30,"+data[1]);
        }

        GenerationCompleted($element: any) {
            let width:number=this.JQueryElement.find('.redNaoControls').width();
            this.JQueryElement.find('.signatureContainer').jSignature({width:width,height:this.Options.Height});
            this.JQueryElement.find('.sfClearSignature').click(()=>{
                this.JQueryElement.find('.signatureContainer').jSignature('reset');
            });

            rnJQuery(()=>{
                let width:number=this.JQueryElement.find('.redNaoControls').width();
                if(this.JQueryElement.find('.signatureContainer').children().length==0)
                    this.JQueryElement.find('.signatureContainer').jSignature({width:width,height:this.Options.Height});
            });

        }

        GenerateInlineElement():string {
            var select=`<div class="rednao_label_container col-sm-3">
                            <label class="rednao_control_label " >${RedNaoEscapeHtml(this.Options.Label)}</label>
                         </div>
                         <div class="redNaoControls col-sm-9">
                            <div class="signatureAndClearContainer">
                                 <a href="#" class="btn btn-danger sfClearSignature"><span class="glyphicon glyphicon-trash" title="Clear"></span></a>
                                 <div class="signatureContainer"></div>
                            </div>
                        </div>
                        `;
            return select;
        }

        CreateProperties() {


            this.Properties.push(new PropertyContainer('general','General').AddProperties([
                new SimpleTextProperty(this,this.Options,"Label","Label",{ManipulatorType:'basic'}),
                new CheckBoxProperty(this,this.Options,"IsRequired","Required",{ManipulatorType:'basic'})
            ]));

            this.Properties.push(new PropertyContainer('icons','Icons and Tweaks').AddProperties([
                new SimpleTextProperty(this,this.Options,"Height","Height",{ManipulatorType:'basic'})
            ]));


            this.Properties.push(new PropertyContainer('advanced','Advanced').AddProperties([
                new CustomCSSProperty(this,this.Options)
            ]));
        }


    }


}
