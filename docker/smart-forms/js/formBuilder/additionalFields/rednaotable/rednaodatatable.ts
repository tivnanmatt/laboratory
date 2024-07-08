let Handsontable:any;
namespace SmartFormsFields {
    export class rednaodatatable extends sfFormElementBase<any>{
        IsFieldContainer:boolean=true;
        public dg:any;
        constructor(options:any,serverOptions:any)
        {
            super(options,serverOptions);
            if(this.IsNew)
            {
                this.Options.ClassName='rednaodatatable';
                this.Options.Label="Table";
                this.Options.CustomCSS='';
            }
        }

        CreateProperties() {
            this.Properties.push(new SimpleTextProperty(this,this.Options,"Label","Label",{ManipulatorType:'basic'}));
            this.Properties.push(new SimpleTextProperty(this,this.Options,"ImageUrl","Image Url",{ManipulatorType:'basic'}));
            this.Properties.push(new SimpleTextProperty(this,this.Options,"ImageWidth","Image Width",{ManipulatorType:'basic'}));
            this.Properties.push(new SimpleTextProperty(this,this.Options,"ImageHeight","Image Height",{ManipulatorType:'basic'}));
            this.Properties.push(new CustomCSSProperty(this,this.Options));
        }


        GetValueString(): any {
            return 1;
        }

        SetData(data: any) {
        }

        IsValid(): boolean {
            return undefined;
        }

        GenerationCompleted($element: any) {

            this.dg = new Handsontable($element.find('.redNaoTable')[0], {
                data:[
                    ["a", "Ford", "Volvo", "Toyota", "Honda"],
                    ["2014", 10, 11, 12, 13],
                    ["2015", 20, 11, 14, 13],
                    ["2016", 30, 15, 12, 13]
                ],
                minSpareRows: 1,
                rowHeaders: true,
                colHeaders: true,
                contextMenu: true,
                stretchH: 'all',
            });
            if($element.is('.velocity-animating')){
                this.RefreshAfterAnimation($element);
            }
        }

        GenerateInlineElement(): string {

            if(this.Options.Label!='')
            {
                return  '<div class="rednao_label_container col-sm-3"><label class="rednao_control_label" for="textarea">'+RedNaoEscapeHtml(this.Options.Label)+'</label></div>'+
                    '<div class="redNaoControls col-sm-9">'+
                    `<div class="redNaoTable" src="${this.Options.ImageUrl}" style="min-width: 300px;min-height:200px;" ></div>`+
                    '</div>';
            }else{
                return '<div class="redNaoControls col-sm-12">'+
                    `<div class="redNaoTable"></div>`+
                    '</div>'
            }
        }


        private RefreshAfterAnimation($element) {
            setTimeout(()=>{
                if($element.is('.velocity-animating')){
                    this.RefreshAfterAnimation($element)
                }else
                    this.dg.render();
            },100);

        }
    }
}