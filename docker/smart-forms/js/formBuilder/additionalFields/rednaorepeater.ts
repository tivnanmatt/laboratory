declare let SmartFormRepeaterDataStore:any;
declare let RedNaoFormulaManagerVar:any;
namespace SmartFormsFields {
    export class rednaorepeater extends sfFormElementBase<RepeaterOptions>{
        private latestRowId:number=0;
        public AnimateInsertion=false;
        IsFieldContainer:boolean=true;
        public DynamicItems:DynamicRow[]=[];
        GetValueString() {
            let rows:any[]=[];
            for(let row of this.DynamicItems)
            {
                let data:any={};
                rows.push(data);
                for(let dynamicField of row.Fields)
                {
                    if(dynamicField.StoresInformation())
                        data[dynamicField.Id]=dynamicField.GetValueString();
                }
            }


            return {value:rows};
        }

        private IsDynamicField=true;
        constructor(options:any,serverOptions:any)
        {
            super(options,serverOptions);
            this.HandleFieldsInternally=true;
            if(this.IsNew)
            {
                this.Options.ClassName='rednaorepeater';
                this.Options.Label="Repeater";
                this.Options.CustomCSS='';
                this.Options.NumberOfItems=1;
                this.Options.ManuallyAdd='y';
                this.Options.IncludeItemNumberInLabels='y';
                this.Options.FieldOptions=[];

            }

            RedNaoEventManager.Subscribe('formPropertyChanged',  (data)=> {
                for(let option of this.Options.FieldOptions)
                {
                    if(typeof data.Field.OriginalId=='undefined')
                        return;
                    if(data.Field.OriginalId==option.Id)
                    {
                        this.FirePropertyChanged(option.Id);
                    }
                }
            });
        }

        InitializeField(){
            this.latestRowId=0;
            this.AnimateInsertion=false;
            if(this.DynamicItems!=null&&this.DynamicItems.length>0)
                for(let row of this.DynamicItems)
                    for(let field of row.Fields)
                        SmartFormsModules.ContainerManager.DeleteContainerOfField(field);
            this.DynamicItems=[];
            this.Fields=[];
            if(this.JQueryElement!=null)
                this.JQueryElement.find('.fieldContainerOfFields').empty();


        }

        GenerationCompleted($element: any) {
            if(!smartFormsDesignMode) {

                this.JQueryElement.find('.repeaterAddButton').click((e)=>{
                    e.preventDefault();
                    this.AddNewItem(true);
                });

            }
            let numberOfItems=this.Options.NumberOfItems;
            if(isNaN(parseInt(numberOfItems.toString())))
                return;
            if(smartFormsDesignMode)
                numberOfItems=1;

            let currentAddedItemsCount=this.DynamicItems.length;

            let delta=numberOfItems-currentAddedItemsCount;
            if(delta>0)
            {
                if(delta>99)
                    delta=99;
                for(let i=0;i<delta;i++)
                    this.AddNewItem(this.AnimateInsertion);
            }
            if(delta<0)
            {
                for(let i=0;i>delta;i--)
                    this.RemoveItem(this.AnimateInsertion);
            }
            this.AnimateInsertion=true;
            this.RefreshRowNumbers();
            this.FirePropertyChanged();

        }


        RefreshElement(propertyName?: string, previousValue?: any) {
            this.JQueryElement.find('.rednao-control-group').each((fieldIndex: number, fieldElement: any) => {
                let fieldId=rnJQuery(fieldElement).attr('id');
                let fieldOptions=this.Options.FieldOptions.find(x=>x.Id==fieldId);
                if(fieldOptions==null)
                    return;

                rnJQuery(fieldElement).find('.rednao_label_container label').text(fieldOptions.Label);
            });
            return super.RefreshElement(propertyName, previousValue);
        }

        SetData(data: any) {
            for(let i=0;i<this.DynamicItems.length;i++)
                this.RemoveItem();

            let index=0;
            for(let row of data.value)
            {
                this.AddNewItem();
                let latestRow=this.DynamicItems[this.DynamicItems.length-1];
                for(let field of latestRow.Fields)
                {
                    if(typeof row[field.Id]!='undefined')
                        field.SetData(row[field.Id]);
                }

            }
            this.RefreshRowNumbers();
        }

        IsValid(): boolean {
            let isValid=true;
            for(let row of this.DynamicItems)
                for(let field of row.Fields)
                    if(!field.IsValid())
                        isValid=false;
            return isValid;
        }


        GetDataStore(): any {
            return new SmartFormRepeaterDataStore(this);
        }



        GenerateInlineElement():string {
            let component='';

            if(smartFormsDesignMode)
            {
                component= `<div style="position: relative;border-color: #aaaaaa !important;border-style: dashed !important;border-width: 2px !important;width:100%;">
                                <div class="fieldContainerOfFields" style="border-style:none !important;">                                                                                                     
                                </div>
                                <span style="left:0;background-color: #CC9999;color: white;padding-left: 2px;padding-right: 2px;position: absolute;top: -8px;-webkit-border-radius: 5px;-moz-border-radius: 5px;border-radius: 5px;">Repeater</span>
                                `;
            }else{
                component= `<div style="position: relative;width:100%">
    
                                <div class="fieldContainerOfFields">                                                                                                     
                                </div>`

            }

            if(this.Options.ManuallyAdd=="y")
                component+=`<div class="col-sm-12" style="text-align: right;"><button class="btn btn-default repeaterAddButton" href="#"><span class="fa fa-plus"></span></button></div>`;
            component+='<div style="clear: both;"></div></div>';
            return component;
        }

        CreateProperties() {

            this.Properties.push(new PropertyContainer('general','General').AddProperties([
                new SimpleNumericProperty(this,this.Options,"NumberOfItems","How many times do you want to repeat this section?",{ManipulatorType:'basic'}).SetEnableFormula(),
                new CheckBoxProperty(this,this.Options,"ManuallyAdd","Include add button",{ManipulatorType:'basic'})
            ]));


            this.Properties.push(new PropertyContainer('icons','Tweaks').AddProperties([
                new CheckBoxProperty(this,this.Options,"IncludeItemNumberInLabels","Include item number in labels",{ManipulatorType:'basic'})
            ]));

            this.Properties.push(new PropertyContainer('advanced','Advanced').AddProperties([
                new IdProperty(this,this.Options),
                new CustomCSSProperty(this,this.Options)
            ]));

        }


        private AddNewItem(animate=false) {
            let newDynamicRow:DynamicRow={
                Fields:[],
                RowId:this.latestRowId++,
                $Container:rnJQuery('<div class="repeaterRow"></div>')
            };
            this.DynamicItems.push(newDynamicRow);
            let $container=newDynamicRow.$Container;

            if(animate)
                $container.css({opacity:0,position:'absolute',overflow:'hidden'});

            this.JQueryElement.find('.fieldContainerOfFields').append($container);
            for(let field of this.Options.FieldOptions){
                let originalId=field.Id;
                if(!smartFormsDesignMode) {
                    field = Object.assign({}, field);
                    field.Id = field.Id + '_row_' + newDynamicRow.RowId;
                    field.ContainerOptions.Id += '_row_' + newDynamicRow.RowId;

                }
                field.FormId=this.Options.FormId;
                let fieldElement:sfFormElementBase<any>=sfRedNaoCreateFormElementByName(field.ClassName,field);
                fieldElement.OriginalId=originalId;
                fieldElement.IsInternal=true;
                fieldElement.FormId=this.FormId;
                fieldElement.Generator=this.Generator;
                fieldElement.RowIndex=newDynamicRow.RowId;
                fieldElement.InvalidInputMessage=this.InvalidInputMessage;
                fieldElement.ClientOptions=this.ClientOptions;
                this.Fields.push(fieldElement);
                fieldElement.AppendElementToContainer($container);
                fieldElement.FieldContainer=this;
                fieldElement._parentId=this.Options.Id;
                newDynamicRow.Fields.push(fieldElement);
                fieldElement.FirePropertyChanged();
                if(!smartFormsDesignMode&&typeof RedNaoFormulaManagerVar!='undefined') {
                    let formulas = RedNaoFormulaManagerVar.Formulas.filter(x => x.FormElement == fieldElement);
                    if (formulas != null)
                        for (let formula of formulas)
                            formula.UpdateFieldWithValue(RedNaoFormulaManagerVar.Data);
                }


            }
            $container.append('<div style="clear: both;"></div>');
            if(this.Options.ManuallyAdd=="y"&&!smartFormsDesignMode)
            {
                let $button=rnJQuery(`<div class="col-sm-12" style="text-align: right;"><button class="btn btn-default repeaterAddButton" href="#"><span class="fa fa-trash"></span></button></div>`);
                $button.find('.repeaterAddButton').click((e)=>{
                    e.preventDefault();
                    this.RemoveItem(true,this.DynamicItems.indexOf(newDynamicRow));

                });
                $container.append($button);
            }

            if(animate)
            {
                let height=$container.outerHeight();
                $container.height(0);
                $container.css('width','100%');
                $container.css('opacity','');
                $container.css('position','');
                $container.velocity({height:[height,0]},200,'easeInExp',()=>{
                    $container.css('overflow','');
                    $container.css('height','');
                    $container.css('width','');
                });
            }


            this.RefreshRowNumbers();
        }

        private RemoveItem(animate=false,index:number=-1) {

            if(this.DynamicItems.length==0)
                return;
            let itemToRemove;
            if(index==-1)
                index=this.DynamicItems.length-1;
            

            itemToRemove=this.DynamicItems[index];

            itemToRemove.$Container.css('overflow','hidden');

            let fieldsToRemove=this.DynamicItems[this.DynamicItems.length-1].Fields;
            for(let field of fieldsToRemove)
                this.Fields.splice(this.Fields.indexOf(field),1);
            this.DynamicItems.splice(index,1);
            if(this.DynamicItems.length>=index)
                for(let i=index;i<this.DynamicItems.length;i++)
                {
                    let dynamicField=this.DynamicItems[i];
                    for(let field of dynamicField.Fields)
                    {
                        field.Id=field.OriginalId+'_row_'+i;
                        field.RowIndex=i;
                        field.FirePropertyChanged();
                        field.JQueryElement.attr('id',field.Id);
                    }
                }
            this.latestRowId--;
            if(animate)
                itemToRemove.$Container.velocity({height:0},200,'easeOutExp',()=>{itemToRemove.$Container.remove();},()=>{
                    itemToRemove.$Container.remove();
                    this.RefreshRowNumbers();
                });
            else {
                itemToRemove.$Container.remove();
                this.RefreshRowNumbers();
            }

        }

        private RefreshRowNumbers() {
            this.JQueryElement.find('.repeaterRow').each((index:number,element:any)=>{
                let $repeaterSection=rnJQuery(element);
                $repeaterSection.attr('data-row-number',index);
                if(this.Options.IncludeItemNumberInLabels=="y") {
                    $repeaterSection.find('.rednao-control-group').each((fieldIndex: number, fieldElement: any) => {
                        let fieldId=rnJQuery(fieldElement).attr('id');
                        fieldId=fieldId.replace(/_row_[0-9]*/,'');
                        let fieldOptions=this.Options.FieldOptions.find(x=>x.Id==fieldId);
                        if(fieldOptions==null)
                            return;

                        rnJQuery(fieldElement).find('.rednao_label_container label').text(fieldOptions.Label+' #'+(index+1));
                    });
                }
            });
            this.FirePropertyChanged();
        }


    }


}

interface DynamicRow{
    RowId:number,
    Fields:sfFormElementBase<any>[],
    $Container:JQuery
}


interface RepeaterOptions extends FieldOptions{
    NumberOfItems:number;
    ManuallyAdd:'y'|'n';
    IncludeItemNumberInLabels:'y'|'n';
    FieldOptions:FieldOptions[];


}