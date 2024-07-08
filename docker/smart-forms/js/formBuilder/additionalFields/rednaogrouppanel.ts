declare let PropertyContainer:any;
namespace SmartFormsFields {
    export class rednaogrouppanel extends sfFormElementBase<any>{
        IsFieldContainer:boolean=true;
        GetValueString() {

        }

        private IsDynamicField=true;
        constructor(options:any,serverOptions:any)
        {
            super(options,serverOptions);
            if(this.IsNew)
            {
                this.Options.ClassName='rednaogrouppanel';
                this.Options.Label="Group Panel";
                this.Options.CustomCSS='';
            }
        }

        StoresInformation(): boolean {
            return false;
        }


        SetData(data: any) {

        }

        IsValid(): boolean {
            return true;
        }

        GenerationCompleted($element: any) {
            for(let field of this.Fields)
            {
               // field.GenerationCompleted(field.JQueryElement);
            }
        }

        GenerateInlineElement():string {
            if(smartFormsDesignMode)
            {
                return `<div style="position: relative">
                            <div class="fieldContainerOfFields">                                                                                                     
                            </div>
                            <span style="left:0;background-color: #99CC99;color: white;padding-left: 2px;padding-right: 2px;position: absolute;top: -8px;-webkit-border-radius: 5px;-moz-border-radius: 5px;border-radius: 5px;">Group Panel</span>
                            
                        </div>`;
            }else{
                return `<div style="position: relative">
                            <div class="fieldContainerOfFields">                                                                                                     
                            </div>                                                        
                        </div>`;
            }
        }

        CreateProperties() {
            this.Properties.push(new PropertyContainer('advanced','Advanced').AddProperties([
                new IdProperty(this,this.Options),
                new CustomCSSProperty(this,this.Options)
            ]));

        }


    }


}
