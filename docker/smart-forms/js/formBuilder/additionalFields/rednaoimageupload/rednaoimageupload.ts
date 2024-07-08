
namespace SmartFormsFields {
    export class rednaoimageupload extends sfFormElementBase<any>{
        public Title:string;


        private IsDynamicField=true;
        constructor(options:any,serverOptions:any)
        {
            super(options,serverOptions);
            this.Title="Currency";
            if(this.IsNew)
            {
                this.Options.ClassName="rednaoimageupload";
                this.Options.Label="Image Upload";
                this.Options.Placeholder="Drag or click here to upload an image";
                this.Options.AllowMultipleFiles='n';
                this.Options.AllowedExtensions='.png, .jpeg, jpg';
            }else{
            }
        }

        CreateProperties()
        {
            this.Properties.push(new PropertyContainer('general','Common').AddProperties([
                new SimpleTextProperty(this,this.Options,"Label","Label",{ManipulatorType:'basic'}),
                new SimpleTextProperty(this,this.Options,"Placeholder","Placeholder",{ManipulatorType:'basic'}),
                new SimpleTextProperty(this,this.Options,"AllowedExtensions","Allowed Extensions",{ManipulatorType:'basic'}),
                new CheckBoxProperty(this,this.Options,"IsRequired","Required",{ManipulatorType:'basic'}),
                new CheckBoxProperty(this,this.Options,"AllowMultipleFiles","Allow multiple",{ManipulatorType:'basic'}),

            ]));


            this.Properties.push(new PropertyContainer('advanced','Advanced').AddProperties([
                new IdProperty(this,this.Options),
                new CustomCSSProperty(this,this.Options)
            ]));

        }

        GenerateInlineElement()
        {
           return `<div class="rednao_label_container col-sm-3"><label class="rednao_control_label" >${this.Options.Label}</label></div>
                <div class="redNaoControls col-sm-9">
                   <table style="width:100%">
                        <tbody class="rendaoFileContainer">
                        
                        </tbody>
                   </table>
               </div>
           `;
        }

        GetDataStore(): any {
            return new SmartFormCurrencyDataStore('numericalValue');
        }

        GetValueString()
        {
            var data= [];
            var count=1;
            var self=this;
            if(this.IsIgnored())
                return [];
            this.JQueryElement.find('.rednaoFileUpload').each(function()
            {
                var jqueryFileElement=rnJQuery(this);
                if(rnJQuery.trim(jqueryFileElement.val())!="")
                {
                    var fieldName="sfufn"+"@"+self.Id+"@"+count.toString();
                    jqueryFileElement.attr('name',fieldName);
                    data.push( {path:fieldName});
                    count++;
                }else
                    jqueryFileElement.removeAttr('name');
            });

            return data;
        }

        SetData(data)
        {
            this.JQueryElement.find('.redNaoInputText').val(data.value);
        }

        GetValuePath()
        {
            return 'formData.'+this.Id+'.value';
        }

        IsValid()
        {

            if(this.Options.IsRequired=='n') {
                this.RemoveError('root');
                return this.InternalIsValid();
            }

            var isValid=false;
            this.JQueryElement.find('.rednaoFileUpload').each(
                function()
                {
                    if(rnJQuery(this).val()!="")
                    {
                        isValid=true;
                    }

                }
            );

            if(isValid)
            {
                this.RemoveError('root');
                return this.InternalIsValid();
            }

            var self=this;
            this.JQueryElement.find('.rednaoFileUpload').each(
                function()
                {
                    if(rnJQuery(this).val()=="")
                    {
                        rnJQuery('#'+self.Id).addClass('has-error');
                        self.AddError('root',self.InvalidInputMessage);
                        return self.InternalIsValid();
                    }
                }
            );

            this.AddError('root',this.InvalidInputMessage);
            return this.InternalIsValid();
        }


        GenerationCompleted(jQueryElement)
        {
           this.AppendElement(jQueryElement);


        }

        TextChanged(){
            let text=this.GetUnFormattedAmount(this.JQueryElement.find( '.redNaoInputText').val());
            this.JQueryElement.find( '.redNaoInputText').val(this.GetFormattedAmount(text));
            this.FirePropertyChanged();
        }

        GetFormattedAmount(amount:number){
            if(isNaN(amount))
                amount=0;
            let text=amount.toFixed(this.Options.NumberOfDecimals);
            var x = text.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            if(this.Options.ThousandSeparator!='') {
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + this.Options.ThousandSeparator + '$2');
                }
            }

            if(x2.length>0)
            {
                x2=x2.slice(1);
                x2=this.Options.DecimalSeparator+x2;
            }
            text= x1 + x2;
            if(this.Options.CurrencyPosition=='left')
                return this.Options.CurrencySymbol+text;
            if(this.Options.CurrencyPosition=='left-space')
                return this.Options.CurrencySymbol+' '+text;
            if(this.Options.CurrencyPosition=='right')
                return text+this.Options.CurrencySymbol;
            if(this.Options.CurrencyPosition=='right-space')
                return text+' '+this.Options.CurrencySymbol;


        }

        GetUnFormattedAmount(text:string){
            while(text.indexOf(this.Options.ThousandSeparator)>0)
            {
                text=text.replace(this.Options.ThousandSeparator,'');
            }

            text=text.replace(this.Options.DecimalSeparator,'.');
            text=text.replace(this.Options.CurrencySymbol,'');

            let val:number= parseFloat(text);
            if(isNaN(val))
                return 0;
            return val;
        }


        private AppendElement(jQueryElement: any) {
            let $element=rnJQuery(`<tr class="rendaoFileItem">
                <td style="border: none;padding:0;">
                    <div style="padding:5px;border:1px dashed;cursor: pointer;flex-grow: 1" class="rednaoFileContainer">
                        ${this.Options.Placeholder}
                    </div>
                    <input style="display: none;" type="file" class="rednaoFileUpload">
                </td>
                <td style="border: none;width:25px;">  
                    <div style="margin-left: 5px">   
                        <span  class="rednaoDeleteButton fa fa-minus-circle" style="font-size: 18px;display: none;cursor: pointer;"/>
                    </div>               
                </td>
            </tr>`);
            jQueryElement.find('.rendaoFileContainer').append($element);

            if(smartFormsDesignMode) {
                return;
            }

            $element.find('.rednaoFileUpload').attr('accept',this.Options.AllowedExtensions);
            $element.find('.rednaoFileUpload').change(e=>{
               this.FileSelected($element,(e.currentTarget as any).files);
            });
            $element.find('.rednaoFileContainer').click(() => {
                $element.find('.rednaoFileUpload').click();
            });

            $element.find('.rednaoDeleteButton').click(()=>{
                $element.find('.rednaoFileUpload').val('').change();
            });

            $element.find('.rednaoFileContainer').on('dragenter',e=>{
               e.preventDefault();
               $element.find('.rednaoFileContainer').addClass('highlight');
            });
            $element.find('.rednaoFileContainer').on('dragleave',e=>{
                e.preventDefault();
                $element.find('.rednaoFileContainer').removeClass('highlight');
            });
            $element.find('.rednaoFileContainer').on('dragover',e=>{
                e.preventDefault();
                $element.find('.rednaoFileContainer').addClass('highlight');
            });
            $element.find('.rednaoFileContainer').on('drop',e=>{
                e.preventDefault();

                $element.find('.rednaoFileContainer').removeClass('highlight');

                let file=(e.originalEvent as any).dataTransfer.files;
                ($element.find('.rednaoFileUpload')[0] as any).files=file;


                if(file.length>0) {
                    let name=file[0].name;
                    name = name.toLowerCase().trim();
                    let extensions = this.Options.AllowedExtensions.trim().split(',');
                    if (extensions.length > 0) {
                        if (!extensions.some(x => name.endsWith(x.toLowerCase().trim()))) {
                            alert('Invalid file type');

                            return;
                        }
                    }
                }

                this.FileSelected($element,file);

            });

        }

        private FileSelected($element: JQuery, files: FileList) {
            $element.find('.rednaoDeleteButton').css('display',files.length==0?'none':'block');

            if(files.length>0&&this.Options.AllowedExtensions.trim()!='')
            {
                let extensions=this.Options.AllowedExtensions.split(',').map(x=>x.toLowerCase().replace(',','').replace('.','').trim());
                let file=files[0];

                let index=files[0].name.lastIndexOf('.');
                let extension='';
                if(index>=0)
                {
                    extension=files[0].name.substring(index+1).toLowerCase();
                }

                if(!extensions.some(x=>x==extension))
                {
                    $element.find('input').val('');
                    alert('Invalid file type');
                }
            }
            if(files.length==0)
            {
                $element.remove();
                if(this.JQueryElement.find('.rendaoFileItem').length==0)
                    this.AppendElement(this.JQueryElement);
            }else
            {
                try{

                    if(!files[0].type.startsWith('image'))
                    {
                        throw "Invalid image file type";
                    }


                    let reader=new FileReader();
                    reader.onload=e=>{
                        $element.find('.rednaoFileContainer').css('border-style','none');
                        $element.find('.rednaoFileContainer').empty();
                        $element.find('.rednaoFileContainer').append(
                            `<div style="padding:10px;border:1px solid black;display: inline-block;margin:-5px">
                                        <img style="max-height: 200px" src="${(e.target as any).result}"/>
                                      </div>`
                        );
                    };
                    reader.readAsDataURL(files[0]);
                }catch(error)
                {
                    $element.find('.rednaoFileContainer').css('border-style','solid');
                    $element.find('.rednaoFileContainer').empty().append(files[0].name);

                }

                if(this.Options.AllowMultipleFiles=='y') {
                    let files:any=this.JQueryElement.find('.rednaoFileUpload');
                    let found=false;
                    for(let currentFile of files)
                    {
                        if(currentFile.files.length==0)
                            found=true;
                    }
                    if(!found)
                        this.AppendElement(this.JQueryElement);
                }
            }
            this.FirePropertyChanged();



        }
    }


}
