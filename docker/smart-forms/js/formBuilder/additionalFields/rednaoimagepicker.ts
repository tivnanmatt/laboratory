
namespace SmartFormsFields {
    export class rednaoimagepicker extends sfFormElementBase<any>{

        private IsDynamicField=true;
        private amount:number=0;
        constructor(options:any,serverOptions:any)
        {
            super(options,serverOptions);
            if(this.IsNew)
            {
                this.Options.ClassName='rednaoimagepicker';
                this.Options.Label='Image Picker';
                this.Options.ImageWidth=0;
                this.Options.ImageHeight=0;
                this.Options.MultipleSelection='n';
                this.Options.ShowLabels='y';
                this.Options.Options=[{label:'Image1',url:smartFormsPath+'images/sflogo.jpg',value:0,sel:'n'},{label:'Image2',url:smartFormsPath+'images/sflogo.jpg',value:0,sel:'n'}];
                this.Options.CustomCSS='';
            }

        }

        GetValueString():any {
            this.amount=0;
            if(this.IsIgnored())
                return {selectedValues:[]};
            var data:any={};
            data.selectedValues=[];
            var select2SelectedValues=[];

            var $selectedOptions=this.JQueryElement.find('select option:selected');

            for(var i=0;i<$selectedOptions.length;i++)
            {
                var optionIndex=parseInt(rnJQuery($selectedOptions[i]).val());
                if(!isNaN(optionIndex))
                    select2SelectedValues.push(optionIndex);
            }


            for(var i=0;i<select2SelectedValues.length;i++)
            {
                var option=this.Options.Options[select2SelectedValues[i]];
                this.amount=parseFloat(option.value);
                if(isNaN(this.amount))
                    this.amount=0;

                data.selectedValues.push(
                    {
                        value:rnJQuery.trim(option.label),
                        amount:this.amount,
                        label:rnJQuery.trim(option.label),
                        url:option.url
                    }
                );
            }

            return data;
        }

        SetData(data: any) {
            var values=[];
            this.JQueryElement.find('select option:selected').removeAttr('selected');
            for(var i=0;i<data.selectedValues.length;i++)
            {
                for(var t=0;t<this.Options.Options.length;t++)
                {
                    if(data.selectedValues[i].amount==rnJQuery.trim(this.Options.Options[t].value)&&data.selectedValues[i].label==rnJQuery.trim(this.Options.Options[t].label))
                    {
                        values.push(t);
                    }

                }
            }
            this.JQueryElement.find('select').val(values);
            this.JQueryElement.find('select').data('picker').sync_picker_with_select();


        }

        IsValid(): boolean {
            if(this.Options.IsRequired=='y'&&this.JQueryElement.find('select').val()==null)
            {
                rnJQuery('#'+this.Id).addClass('has-error');
                this.AddError('root',this.InvalidInputMessage);
            }
            else
                this.RemoveError('root');

            return this.InternalIsValid();
        }


        GetDataStore(): any {
            return new SmartFormMultipleItemsDataStore();
        }

        GenerationCompleted($element: any) {
            var showLabels=false;
            if(this.Options.ShowLabels=='y')
                showLabels=true;
            this.JQueryElement.find('select').imagepicker({'show_label':showLabels});
            if(!isNaN(this.Options.ImageWidth)&&parseInt(this.Options.ImageWidth)>0)
                this.JQueryElement.find('.image_picker_image').css('width',this.Options.ImageWidth);


            if(!isNaN(this.Options.ImageHeight)&&parseInt(this.Options.ImageHeight)>0)
                this.JQueryElement.find('.image_picker_image').css('height',this.Options.ImageHeight);
            this.JQueryElement.find('select').change(()=>{this.FirePropertyChanged();});

        }

        GenerateInlineElement():string {
            var select=`<div class="rednao_label_container col-sm-3">
                            <label class="rednao_control_label " >${RedNaoEscapeHtml(this.Options.Label)}</label>
                         </div>
                         <div class="redNaoControls col-sm-9">
                            <select ${this.Options.MultipleSelection=='y'?'multiple="multiple"':''}>`;

            for(let i=0;i<this.Options.Options.length;i++)
            {
                var selected=this.Options.Options[i].sel=='y';
                select+=`<option ${selected?'selected="selected"':''} data-value="${RedNaoEscapeHtml(this.Options.Options[i].value)}" data-img-src="${this.Options.Options[i].url.replace("\"", "&quot;")}" value="${i}">${RedNaoEscapeHtml(this.Options.Options[i].label)}</option>`;
            }
            select+='</div>';
            return select;
        }

        CreateProperties() {
            let optionsProperty=new ArrayProperty(this,this.Options,"Options","Options",{ManipulatorType:'basic',AllowImages:true});
            this.Properties.push(new PropertyContainer('general','General').AddProperties([
                new SimpleTextProperty(this,this.Options,"Label","Label",{ManipulatorType:'basic'}),
                new CheckBoxProperty(this,this.Options,"IsRequired","Required",{ManipulatorType:'basic'}),
                new CheckBoxProperty(this,this.Options,"MultipleSelection","Allow Multiple Selection",{ManipulatorType:'basic',ChangeCallBack:function(newValue,oldValue){
                    if(newValue=='y')
                        optionsProperty.AdditionalInformation.SelectorType='checkbox';
                    else
                        optionsProperty.AdditionalInformation.SelectorType='radio';

                    optionsProperty.RefreshProperty();
                }}),
                optionsProperty
            ]));

            this.Properties.push(new PropertyContainer('icons','Icons and Tweaks').AddProperties([
                new CheckBoxProperty(this,this.Options,"ShowLabels","Show Image Labels",{ManipulatorType:'basic'}),
                new SimpleTextProperty(this,this.Options,"ImageWidth","Image Width",{ManipulatorType:'basic'}),
                new SimpleTextProperty(this,this.Options,"ImageHeight","Image Height",{ManipulatorType:'basic'})

            ]));


            this.Properties.push(new PropertyContainer('advanced','Advanced').AddProperties([
                new CustomCSSProperty(this,this.Options)
            ]));


        }


    }


}
