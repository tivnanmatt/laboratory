declare let SmartFormCurrencyDataStore:any;

namespace SmartFormsFields {
    export class rednaocurrency extends sfFormElementBase<any>{
        public Title:string;


        private IsDynamicField=true;
        constructor(options:any,serverOptions:any)
        {
            super(options,serverOptions);
            this.Title="Currency";
            if(this.IsNew)
            {
                this.Options.ClassName="rednaocurrency";
                this.Options.Label="Currency";
                this.Options.Placeholder="";
                this.Options.Value="";
                this.Options.ReadOnly='n';
                this.Options.Width="";
                this.Options.Icon={ClassName:''};
                this.Options.CustomCSS='';
                this.Options.CurrencySymbol='$';
                this.Options.CurrencyPosition='left';
                this.Options.DecimalSeparator='.';
                this.Options.ThousandSeparator=',';
                this.Options.NumberOfDecimals='2';
                this.Options.Placeholder_Icon={ClassName:'',Orientation:''};
            }else{
                this.SetDefaultIfUndefined('Value','');
                this.SetDefaultIfUndefined('ReadOnly','n');
                this.SetDefaultIfUndefined('Width','');
                this.SetDefaultIfUndefined('Icon',{ClassName:''});
                this.SetDefaultIfUndefined('CustomCSS','');
                this.SetDefaultIfUndefined('Placeholder_Icon',{ClassName:''});
            }
        }

        CreateProperties()
        {
            this.Properties.push(new PropertyContainer('general','Common').AddProperties([
                new SimpleTextProperty(this,this.Options,"Label","Label",{ManipulatorType:'basic'}),
                new CheckBoxProperty(this,this.Options,"IsRequired","Required",{ManipulatorType:'basic'}),
                new SimpleTextProperty(this,this.Options,"Value","Default Value",{ManipulatorType:'basic',RefreshFormData:true}).SetEnableFormula(),
                new SimpleTextProperty(this,this.Options,"CurrencySymbol","Symbol",{ManipulatorType:'basic',RefreshFormData:true}),
                new ComboBoxProperty(this,this.Options,'CurrencyPosition',"Position",{ManipulatorType:'basic'})
                    .AddOption('Left ($99.99)','left')
                    .AddOption('Left with space ($ 99.99)','left-space')
                    .AddOption('Right (99.99$)','right')
                    .AddOption('Right with space (99.99 $)','right-space'),
                new SimpleTextProperty(this,this.Options,"DecimalSeparator","Decimal Separator",{ManipulatorType:'basic',RefreshFormData:true}),
                new SimpleTextProperty(this,this.Options,"ThousandSeparator","Thousand Separator",{ManipulatorType:'basic',RefreshFormData:true}),
                new SimpleNumericProperty(this,this.Options,"NumberOfDecimals","Number of Decimals",{ManipulatorType:'basic',RefreshFormData:true})
            ]));

            this.Properties.push(new PropertyContainer('icons','Icons and Tweaks').AddProperties([
                new SimpleTextProperty(this,this.Options,"Placeholder","Placeholder",{ManipulatorType:'basic',IconOptions:{Type:'leftAndRight'}}),
                new SimpleNumericProperty(this,this.Options,"Width","Width",{ManipulatorType:'basic'}),
                new IconProperty(this,this.Options,'Icon','Icon',{ManipulatorType:'basic'})
            ]));


            this.Properties.push(new PropertyContainer('advanced','Advanced').AddProperties([
                new CheckBoxProperty(this,this.Options,"ReadOnly","Read Only",{ManipulatorType:'basic'}),
                new IdProperty(this,this.Options),
                new CustomCSSProperty(this,this.Options)
            ]));

        }

        GenerateInlineElement()
        {
            var additionalStyle='';
            if(!isNaN(parseFloat(this.Options.Width)))
                additionalStyle='width:'+this.Options.Width+'px'+' !important;';

            var startOfInput='';
            var endOfInput='';

            if(this.Options.Icon.ClassName!='')
            {
                startOfInput='<div class="rednao-input-prepend input-group"><span class="redNaoPrepend input-group-addon prefix '+RedNaoEscapeHtml(this.Options.Icon.ClassName)+' "></span>';
                endOfInput='</div>';
            }

            return '<div class="rednao_label_container col-sm-3"><label class="rednao_control_label" >'+RedNaoEscapeHtml(this.Options.Label)+'</label></div>'+
                '<div class="redNaoControls col-sm-9">'+
                startOfInput+
                '<input style="'+additionalStyle+'" '+(this.Options.ReadOnly=='y'?'disabled="disabled"':"")+' name="'+this.GetPropertyName()+'" type="text" placeholder="'+RedNaoEscapeHtml(this.Options.Placeholder)+'" class="form-control redNaoInputText '+(this.Options.ReadOnly=='y'?'redNaoDisabledElement':"")+'" value="'+RedNaoEscapeHtml(this.GetFormattedAmount(parseFloat(this.Options.Value)))+'">'+
                endOfInput+
                '</div>';
        }

        GetDataStore(): any {
            return new SmartFormCurrencyDataStore('numericalValue');
        }

        GetValueString()
        {
            if(this.IsIgnored())
                return {value:'',numericalValue:0};

            let numValue=this.GetUnFormattedAmount(this.JQueryElement.find('.redNaoInputText').val());
            return {value:this.GetFormattedAmount(numValue),numericalValue:numValue};
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
            if(this.JQueryElement.find('.redNaoInputText').val()==""&&this.Options.IsRequired=='y')
                this.AddError('root',this.InvalidInputMessage);
            else
                this.RemoveError('root');
            return this.InternalIsValid();
        }


        GenerationCompleted(jQueryElement)
        {
            var self=this;
            this.JQueryElement.find( '.redNaoInputText').change(function(){self.TextChanged();});
            if(this.Options.Placeholder_Icon.ClassName!='')
            {
                this.LoadPlaceHolderIcon(jQueryElement.find('.redNaoInputText'),null,null,this.Options.Placeholder_Icon);
            }


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

            if(this.Options.DecimalSeparator!='')
                text=text.replace(this.Options.DecimalSeparator,'.');
            text=text.replace(this.Options.CurrencySymbol,'');

            let val:number= parseFloat(text);
            if(isNaN(val))
                return 0;
            return val;
        }






    }


}
