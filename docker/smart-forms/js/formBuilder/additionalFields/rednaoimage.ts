namespace SmartFormsFields {
    export class rednaoimage extends sfFormElementBase<any>{
        GetValueString() {

        }

        private IsDynamicField=true;
        constructor(options:any,serverOptions:any)
        {
            super(options,serverOptions);
            if(this.IsNew)
            {
                this.Options.ClassName='rednaoimage';
                this.Options.Label="Image";
                this.Options.ImageWidth='';
                this.Options.ImageHeight='';
                this.Options.ImageUrl=smartFormsPath+'images/sflogo.jpg';
                this.Options.CustomCSS='';
            }
        }

        StoresInformation(): boolean {
            return false;
        }


        HandleRefresh(propertyName: string,previousValue:any): boolean {
            if(propertyName=='ImageUrl')
            {
                var newImage=this.Options.ImageUrl;
                if(newImage!=previousValue&&newImage!=null)
                {
                    let $control=this.JQueryElement.find('.redNaoControls');
                    let $previousImage=$control.find('.rednaoImageImg');
                    let $loading=rnJQuery(`<img src="${smartFormsPath}images/wait.gif" style="position: absolute;top:calc(50% - 9px);left:calc(50% - 9px);border:none;opacity: 0;"/>`);
                    $control.append($loading);
                    $previousImage.velocity({'opacity':.5},300,"easeInExp");
                    $loading.velocity({'opacity':1},300,"easeInExp");


                    let $newImage=rnJQuery(`<img style="opacity: 0;position:absolute;" src="${newImage}"/>`);
                    $newImage.load(()=>{
                        var newImageWidth=$newImage.width();
                        var newImageHeight=$newImage.height();
                        var oldImageWidth=$previousImage.width();
                        var oldImageHeight=$previousImage.height();


                        $loading.velocity({'opacity':0},300,"easeInExp",()=>{$loading.remove();});
                        $previousImage.velocity({'opacity':0},300,"easeInExp",()=>{
                            $newImage.css('position','static');
                            $previousImage.remove();
                            $newImage.css('width',oldImageWidth);
                            $newImage.css('height',oldImageHeight);
                            $newImage.addClass('rednaoImageImg');
                            $newImage.velocity({'opacity':1,width:newImageWidth,height:newImageHeight},300,"easeInExp");
                        });


                    });
                    $control.append($newImage);
                }
                return true;
            }
            return false;
        }

        SetData(data: any) {

        }

        IsValid(): boolean {
            return true;
        }

        GenerationCompleted($element: any) {
            if(this.Options.ImageWidth)
                this.JQueryElement.find('.rednaoImageImg').css('width',this.Options.ImageWidth);

            if(this.Options.ImageHeight)
                this.JQueryElement.find('.rednaoImageImg').css('height',this.Options.ImageHeight);
        }

        GenerateInlineElement():string {
            if(this.Options.Label!='')
            {
                return  '<div class="rednao_label_container col-sm-3"><label class="rednao_control_label" for="textarea">'+RedNaoEscapeHtml(this.Options.Label)+'</label></div>'+
                    '<div class="redNaoControls col-sm-9">'+
                            `<img class="rednaoImageImg" src="${this.Options.ImageUrl}"/>`+
                    '</div>';
            }else{
                return '<div class="redNaoControls col-sm-12">'+
                    `<img class="rednaoImageImg" src="${this.Options.ImageUrl}"/>`+
                    '</div>'
            }
        }

        CreateProperties() {
            this.Properties.push(new PropertyContainer('general','General').AddProperties([
                new SimpleTextProperty(this,this.Options,"Label","Label",{ManipulatorType:'basic'}),
                new SimpleTextProperty(this,this.Options,"ImageUrl","Image Url",{ManipulatorType:'basic'})
            ]));

            this.Properties.push(new PropertyContainer('icons','Icons and Tweaks').AddProperties([
                new SimpleTextProperty(this,this.Options,"ImageWidth","Image Width",{ManipulatorType:'basic'}),
                new SimpleTextProperty(this,this.Options,"ImageHeight","Image Height",{ManipulatorType:'basic'})
            ]));


            this.Properties.push(new PropertyContainer('advanced','Advanced').AddProperties([
                new CustomCSSProperty(this,this.Options)
            ]));

        }


    }


}
