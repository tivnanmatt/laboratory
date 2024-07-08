declare let TimePickerProperty;
declare let ComboBoxProperty;
declare let SimpleNumericProperty;
declare let IconProperty;
declare let IdProperty;
namespace SmartFormsFields {
    export class rednaotimepicker extends sfFormElementBase<TimePickerOptions>{
        private IsDynamicField=true;
        constructor(options:any,serverOptions:any)
        {
            super(options,serverOptions);
            if(this.IsNew)
            {
                this.Options.ClassName='rednaotimepicker';
                this.Options.Label="Time";
                this.Options.MinuteStep=1;
                this.Options.MaxTime=86340000;
                this.Options.MinTime=0;
                this.Options.Value='';
                this.Options.Mode="24hrs";
                this.Options.CustomCSS='';
                this.Options.Icon={ClassName:''};
                this.Options.Placeholder='';
                this.Options.ReadOnly='n';
                this.Options.Placeholder_Icon={ClassName:'',Orientation:''};

            }else{
                this.SetDefaultIfUndefined('ReadOnly','n');
            }

        }

        GetValueString() {
            let $input=this.JQueryElement.find('.rednaotimepickerinput');
            return {value:$input.val(),numericalValue:this.TimeToMilliseconds()};

        }


        StoresInformation(): boolean {
            return true;
        }




        SetData(data: any) {
            this.SetTime(data.numericalValue);
        }

        IsValid(): boolean {
            if(this.Options.IsRequired=="y"&&this.JQueryElement.find('.rednaotimepickerinput').val()=='')
            {
                this.JQueryElement.addClass('has-error');
                this.AddError('root',this.InvalidInputMessage);
            }
            else
                this.RemoveError('root');

            return this.InternalIsValid();
        }

        GenerationCompleted($element: JQuery) {
            let $input=$element.find('input');
            let value;

            if(this.Options.Value==''||this.Options.Value=='-1')
                value=false;



            let timePickerOptions:any={
                appendWidgetTo:'#sf'+this.GetFormId(),
                explicitMode:true,
                snapToStep:true,
                minuteStep:Number(this.Options.MinuteStep),

            };
            if(value==false)
                timePickerOptions.defaultTime=value;
            timePickerOptions.showMeridian = this.Options.Mode != "24hrs";

            $input.timepicker(timePickerOptions);
            if(value!=false)
                this.SetTime(this.Options.Value);


            $input.on('focus',()=>{
                $input.timepicker('showWidget');
            });

            $input.on('changeTime.timepicker',(e)=>{
                let selectedTime=this.TimeToMilliseconds();
                if(this.Options.MaxTime<selectedTime)
                    this.SetTime(this.Options.MaxTime.toString());
                if(this.Options.MinTime>selectedTime)
                    this.SetTime(this.Options.MinTime.toString());
                this.FirePropertyChanged();
            });

            if(this.Options.Placeholder_Icon.ClassName!='')
            {
                this.LoadPlaceHolderIcon(this.JQueryElement.find('.rednaotimepickerinput'),null,null,this.Options.Placeholder_Icon);
            }
        }


        private TimeToMilliseconds(){
            let $input=this.JQueryElement.find('.rednaotimepickerinput');
            let milliseconds=0;
            milliseconds+=($input.data().timepicker.hour+($input.data().timepicker.meridian=='PM'?12:0))*60*60*1000;
            milliseconds+=$input.data().timepicker.minute*60*1000;
            milliseconds+=$input.data().timepicker.second*1000;
            return milliseconds;
        }


        GenerateInlineElement():string {

            let startOfInput='';
            let endOfInput='';
            if(this.Options.Icon.ClassName!='')
            {
                startOfInput='<div class="rednao-input-prepend input-group"><span class="redNaoPrepend input-group-addon prefix '+RedNaoEscapeHtml(this.Options.Icon.ClassName)+' "></span>';
                endOfInput='</div>';
            }

            return `<div class="rednao_label_container col-sm-3"><label class="rednao_control_label" for="textarea">${RedNaoEscapeHtml(this.Options.Label)}</label></div>
                        <div class="redNaoControls col-sm-9">
                        ${startOfInput}
                        <input ${this.Options.ReadOnly=='y'?'disabled="disabled"':''}  type="text" class="rednaotimepickerinput form-control input-small" placeholder="${RedNaoEscapeHtml(this.Options.Placeholder)}" />
                        ${endOfInput}                      
                    </div>`;
        }

        CreateProperties() {
            this.Properties.push(new PropertyContainer('general','General').AddProperties([
                new SimpleTextProperty(this,this.Options,"Label","Label",{ManipulatorType:'basic'}),
                new CheckBoxProperty(this,this.Options,"IsRequired","Required",{ManipulatorType:'basic'}),
                new TimePickerProperty(this,this.Options,"Value","Default Value",{ManipulatorType:'basic'}),


            ]));

            this.Properties.push(new PropertyContainer('icons','Icons and Tweaks').AddProperties([
                new SimpleTextProperty(this,this.Options,"Placeholder","Placeholder",{ManipulatorType:'basic',IconOptions:{Type:'leftAndRight'}}),
                new ComboBoxProperty(this,this.Options,'Mode',"Mode",{ManipulatorType:'basic'})
                    .AddOption('24hrs','24hrs')
                    .AddOption('AM/PM','AM/PM'),
                new SimpleNumericProperty(this,this.Options,"MinuteStep","Minute Step",{ManipulatorType:'basic'}),
                new TimePickerProperty(this,this.Options,"MinTime","Min Time",{ManipulatorType:'basic'}),
                new TimePickerProperty(this,this.Options,"MaxTime","Max Time",{ManipulatorType:'basic'}),
                new IconProperty(this,this.Options,'Icon','Icon',{ManipulatorType:'basic'})


            ]));


            this.Properties.push(new PropertyContainer('advanced','Advanced').AddProperties([
                new CheckBoxProperty(this,this.Options,"ReadOnly","Read Only",{ManipulatorType:'basic'}),
                new IdProperty(this,this.Options),
                new CustomCSSProperty(this,this.Options)
            ]));

        }


        private SetTime(value: string) {
            if(isNaN(Number(value))||value=='')
                return;
            let milliseconds=parseInt(value);
            this.JQueryElement.find('.rednaotimepickerinput').timepicker('setTime', new Date(new Date().setHours(0,0,0,milliseconds)));
        }
    }


}

interface TimePickerOptions extends FieldOptions
{
    MinuteStep:number;
    Value:string;
    Mode:"24hrs"|"AM/PM";
    MaxTime:number;
    MinTime:number;
    Placeholder:string;
    Icon:IconOption;
    ReadOnly:string;
    Placeholder_Icon:IconOption;
}