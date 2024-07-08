namespace SmartFormsModules {
    export class ContainerResizer
    {
        private RESIZER_AREA: number=15;
        private MINIMUN_WIDTH:number=5;
        private $fieldDisplayingResizer:JQuery;
        private OriginalX:number;
        private LeftField:sfFormElementBase<any>;
        private RightField:sfFormElementBase<any>;
        private OriginalRightWidth:number;
        private OriginalLeftWidth:number;
        private FieldDragging:boolean;
        private ContainerWidth:number;
        private $LastBindedElement:JQuery;
        private static ResizerThatStarted:ContainerResizer=null;

        constructor(private designer:SmartFormsModules.MultipleElementsContainerDesigner){
            this.designer.Container.ContainerAddedCallback=()=>{this.InitializeResizer();};
        }

        public get Fields()
        {
            return this.designer.Container.fields;
        }

        private InitializeResizer() {
            this.designer.Container.$container.mousemove((e)=>{
                this.OnMouseMove(e);
            });
            this.designer.Container.$container.mouseleave(()=>{
                this.ClearResizer();
            })
        }

        private OnMouseMove(e: JQueryMouseEventObject) {
            if(this.FieldDragging)
                this.DragMove(e);
            let fieldDraggedTo:sfFormElementBase<any>=this.GetElementDraggedTo(e);
            if(fieldDraggedTo==null||!this.IsInResizerArea(fieldDraggedTo,e))
            {
                //console.log(this.Fields);
                this.ClearResizer();
                return;
            }
            this.ShowResizeCursor(fieldDraggedTo);
        }

        private GetElementDraggedTo(e: JQueryMouseEventObject):sfFormElementBase<any> {
            for(let field of this.Fields)
            {
                let offset=field.JQueryElement.offset();
                if(e.pageX>offset.left&&e.pageX<offset.left+field.JQueryElement.outerWidth()&&e.pageY>offset.top&&e.pageY<offset.top+field.JQueryElement.outerHeight())
                    return field;
            }
            return null;
        }

        private IsInResizerArea(fieldDraggedTo: sfFormElementBase<any>, e: JQueryMouseEventObject) {

            return fieldDraggedTo!=this.Fields[0]&&e.pageX<fieldDraggedTo.JQueryElement.offset().left+this.RESIZER_AREA;
        }

        private ShowResizeCursor(fieldDraggedTo: sfFormElementBase<any>) {
            SmartFormsAddNewVar.FormBuilder.DragManager.IsResizing=true;
            //console.log(this.Fields);
            //console.log('start resizing');
            if(this.$fieldDisplayingResizer!=null)
            {
                if(this.$fieldDisplayingResizer==fieldDraggedTo.JQueryElement)
                    return;
                else
                    this.ClearResizer();
            }
            this.$LastBindedElement=fieldDraggedTo.JQueryElement;
            fieldDraggedTo.JQueryElement.css('cursor','ew-resize');
            fieldDraggedTo.JQueryElement.bind('mousedown.sfresizer',(e:JQueryMouseEventObject)=>{
                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();
                this.StartDrag(fieldDraggedTo,e);

            });

            rnJQuery(document).bind('mouseup.sfresizer',(e:JQueryMouseEventObject)=>{
                this.EndDrag();
                fieldDraggedTo.JQueryElement.unbind('mousedown.sfresizer');
                rnJQuery(document).unbind('mouseup.sfresizer');
            });
            this.$fieldDisplayingResizer=fieldDraggedTo.JQueryElement;
        }

        private ClearResizer() {
            if(this.$LastBindedElement!=null) {
                this.$LastBindedElement.unbind('mousedown.sfresizer');
                this.$LastBindedElement=null;
            }
            SmartFormsAddNewVar.FormBuilder.DragManager.IsResizing=false;
            //console.log('clear resizing');
            if(this.$fieldDisplayingResizer!=null) {
                this.$fieldDisplayingResizer.removeAttr('style');
                this.$fieldDisplayingResizer = null;
            }
        }

        private StartDrag(fieldDraggedTo:sfFormElementBase<any> ,e:JQueryMouseEventObject) {
            this.FieldDragging=true;
            this.OriginalX=e.pageX;
            this.RightField=fieldDraggedTo;
            for(let i=0;i<this.Fields.length;i++)
                if(this.Fields[i]==fieldDraggedTo)
                    this.LeftField=this.Fields[i-1];
            this.OriginalLeftWidth=this.LeftField.Options.ContainerOptions.Width;
            this.OriginalRightWidth=this.RightField.Options.ContainerOptions.Width;
            this.ContainerWidth=this.designer.Container.$container.width();
        }

        private DragMove(e: JQueryMouseEventObject) {
            var delta=e.pageX-this.OriginalX;
            var deltaPercentage=Math.floor(delta*100/this.ContainerWidth);
            if(deltaPercentage==0)
                return;
            if(delta>0)
                this.AdjustSize(this.LeftField,this.OriginalLeftWidth,this.RightField,this.OriginalRightWidth,deltaPercentage);
            else
                this.AdjustSize(this.RightField,this.OriginalRightWidth,this.LeftField,this.OriginalLeftWidth,deltaPercentage*-1);
            //console.log(deltaPercentage);
        }

        private AdjustSize(fieldToIncrease:sfFormElementBase<any>,fieldToIncreaseOriginalWidth:number, fieldToDecrease:sfFormElementBase<any>,fieldToDecreaseOriginalWidth:number,changeAmount:number):void{
            let maxAllowedChange=fieldToDecreaseOriginalWidth-5;
            //console.log('field width:'+fieldToDecrease.Options.ContainerOptions.Width);
            //console.log('maxAllowedChange:'+maxAllowedChange);
            changeAmount=Math.min(maxAllowedChange,changeAmount);
            //console.log('change amount:'+changeAmount);
            this.ChangeSize(fieldToIncrease,changeAmount,fieldToIncreaseOriginalWidth);
            this.ChangeSize(fieldToDecrease,changeAmount*-1,fieldToDecreaseOriginalWidth);
        }

        private EndDrag() {
            this.FieldDragging=false;
        }

        private ChangeSize(field: sfFormElementBase<any>, changeAmount: number,originalWidth:number) {
            let lastWidth=field.Options.ContainerOptions.Width;
            if(changeAmount==0||lastWidth==originalWidth+changeAmount)
                return;
            field.Options.ContainerOptions.Width=originalWidth+changeAmount;
            //console.log('sfFieldWidth'+field.Options.ContainerOptions.Width);
            field.JQueryElement.addClass('sfFieldWidth'+field.Options.ContainerOptions.Width);
            field.JQueryElement.removeClass('sfFieldWidth'+lastWidth);
        }
    }
}