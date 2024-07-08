declare var TinyMCEProperty:any;
declare var RedNaoEscapeHtml:any;

namespace SmartFormsFields {
    export class rednaotermofservice extends sfFormElementBase<TermOfServiceOptions>{
        private IsDynamicField=true;
        GetValueString() {
            return {
                LinkType:this.Options.LinkType,
                PopUpText:this.Options.PopUpText,
                PopUpTitle:this.Options.PopUpTitle,
                Text:this.Options.Text
            }
        }

        constructor(options:any,serverOptions:any)
        {
            super(options,serverOptions);
            if(this.IsNew)
            {
                this.Options.ClassName='rednaotermofservice';
                this.Options.LinkType="PopUp";
                this.Options.PopUpTitle="Term of service";
                this.Options.PopUpText="<p>Term of service content.</p>";
                this.Options.LinkURL="";
                this.Options.Label="Term of service";
                this.Options.Text="I agree to the $$Term of Services$$";
                this.Options.CustomCSS='';

            }
        }

        StoresInformation(): boolean {
            return true;
        }


        SetData(data: any) {

        }

        IsValid(): boolean {
            if(!this.JQueryElement.find('.redNaoInputCheckBox').is(':checked'))
                this.AddError('root',this.InvalidInputMessage);
            else
                this.RemoveError('root');

            return this.InternalIsValid();
        }

        GenerationCompleted($element: any) {
            let links=$element.find('a');

            if(smartFormsDesignMode) {
                for (let currentLink of links) {
                    currentLink.addEventListener('click',(e)=>{
                        e.preventDefault();
                    });
                }

                return;
            }

            for(let currentLink of links)
            {
                if(this.Options.LinkType=="OpenLink")
                    return;
                (currentLink as HTMLLIElement).setAttribute('target','_blank');
                 currentLink.addEventListener('click',(e)=>{
                     e.preventDefault();
                     var $dialog=rnJQuery(
                         `<div class="modal fade"  tabindex="-1">
                         <div class="modal-dialog">
                         <div class="modal-content">
                         <div class="modal-header">
                         <h4 style="display: inline" class="modal-title">${RedNaoEscapeHtml(this.Options.PopUpTitle)}</h4>
                         </div>
                         <div class="modal-body">
                            ${this.Options.PopUpText}
                         </div>
                         <div class="modal-footer">
                         <button type="button" class="btn btn-success">Close</button>
                         </div>
                         </div>
                         </div>
                         </div>`);

                     var container=rnJQuery('<div class="bootstrap-wrapper"></div>');
                     container.append($dialog);
                     rnJQuery('body').append(container);
                     $dialog.modal('show');

                     $dialog.on('hidden.bs.modal',function(){
                         $dialog.remove();
                     });

                     $dialog.find(".btn-success").click(function()
                     {
                         $dialog.modal('hide');
                     });

                 })
            }
        }

        GenerateInlineElement():string {
            let id=this.Options.FormId+this.Id;
            let label='';
            let text=this.Options.Text;

            let startIndex=text.indexOf('$$');
            let endIndex=0;
            if(startIndex>=0)
            {
                endIndex=text.indexOf('$$',startIndex+2)
            }

            let textToReplace='';
            if(endIndex>=0) {
                textToReplace = text.substring(startIndex, endIndex + 2);
            }


            if(textToReplace!='')
            {
                let linkLabel=textToReplace.replace(/\$\$/g,'');
                let linkURL='#';
                if(this.Options.LinkType=="OpenLink")
                    linkURL=this.Options.LinkURL;
                let link='<a target="_blank" href="'+linkURL+'">'+RedNaoEscapeHtml(linkLabel)+'</a>';
                text=text.replace(textToReplace,link);
            }





            if(this.Options.Label.trim()!='')
                label=  '<div class="rednao_label_container col-sm-3"><label class="rednao_control_label">'+RedNaoEscapeHtml(this.Options.Label)+'</label></div>';
            return `${label}<div class="redNaoControls col-sm-9">    
                    <div class="checkbox-inline" style="display: flex;align-items: center;">
                        <input type="checkbox" class="redNaoInputCheckBox" id="${id}" name="${this.Id}"  value="1"/>
                        <label style="padding-left: 18px !important;margin:0" class="redNaoCheckBox redNaoCheckBox-inline" for="${id}">&nbsp;</label>
                        <label style="margin:0">${text}</label>
                    </div>
                </div>`;

        }

        CreateProperties() {
            let properties=[
                new SimpleTextProperty(this,this.Options,"Label","Label",{ManipulatorType:'basic'}),
                new SimpleTextProperty(this,this.Options,"Text","Text",{ManipulatorType:'basic',RefreshFormData:true,MultipleLine:true,Notes:'Surround the link with <span style="color:red">$$</span> e.g. <span style="color:red">$$Term of Services$$</span>'}),
            ];

            properties.push(
                new ComboBoxProperty(this,this.Options,"LinkType","LinkType",{ManipulatorType:'basic',
                    Values:[
                        {label:'Open Link',value:'OpenLink'},
                        {label:'Popup',value:'PopUp'}],
                    ChangeCallBack:(newValue,oldValue)=>{
                        this.Properties=[];
                        this.CreateProperties();
                        SmartFormsAddNewVar.FormBuilder.FillPropertiesPanel(this)

                    }})
            );



            if(this.Options.LinkType=="PopUp")
            {
                properties.push(new SimpleTextProperty(this,this.Options,"PopUpTitle","PopUp Title",{ManipulatorType:'basic'}));
                properties.push(new TinyMCEProperty(this,this.Options,"PopUpText","PopUp Text",{ManipulatorType:'basic'}));
            }else{
                properties.push(new SimpleTextProperty(this,this.Options,"LinkURL","Link URL",{ManipulatorType:'basic'}));
            }

            this.Properties.push(new PropertyContainer('general','General').AddProperties(properties));

            this.Properties.push(new PropertyContainer('advanced','Advanced').AddProperties([
                new CustomCSSProperty(this,this.Options)
            ]));

        }


    }


}


interface TermOfServiceOptions extends FieldOptions{
    Text:string;
    LinkType:'OpenLink'|"PopUp",
    PopUpTitle:string,
    PopUpText:string,
    LinkURL:string;
    LinkText:string,
}