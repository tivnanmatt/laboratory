namespace SmartFormsModules {

    export class ContainerBaseDesigner extends SmartFormsModules.Container
    {
        constructor(public Container:ContainerBase)
        {
            super();
        }

        public IncludeField(field: sfFormElementBase<any>) {
            this.Container.IncludeField(field);
        }

        get Options():ContainerOptions{
            return this.Container.Options;
        }

        public AppendJQueryElementToUI(elementToAdd:sfFormElementBase<any>,jQueryContainer:JQuery,animate:boolean): JQuery {
            return this.Container.AppendJQueryElementToUI(elementToAdd,jQueryContainer,animate);
        }

        public ReplaceWithJQueryElement(jQueryContainer:JQuery,animate:boolean): JQuery {
            return this.Container.ReplaceWithJQueryElement(jQueryContainer,animate);
        }

        public RemoveField(field: sfFormElementBase<any>,animate:boolean,keepSize:boolean=false) {
            field.JQueryElement.css('overflow','hidden');
            var element=field.JQueryElement;
            element.addClass('removingField');
            if(field.FieldContainer==null||!field.FieldContainer.HandleFieldsInternally)
                SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.splice(SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.indexOf(field),1);
            if(field.FieldContainer!=null)
                field.FieldContainer.RemoveField(field);

            if(field.IsFieldContainer&&!field.HandleFieldsInternally)
                for(let childField of field.Fields)
                    SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.splice(SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.indexOf(childField),1);
            if(animate)
                element.velocity({width:0,height:0},SmartFormsModules.animationSpeed,"easeOutExp",()=>{element.remove();});
            else
                element.remove();
        }

        public GetLastField():sfFormElementBase<any>{
            return this.Container.fields[this.Container.fields.length-1];
        }

        public InitializeFieldInDesigner(field:sfFormElementBase<any>,regenerateElement:boolean=true)
        {
            SmartFormsAddNewVar.FormBuilder.DragManager.MakeItemDraggable(field.JQueryElement);
            if(field.IsFieldContainer)
                for(let childField of field.Fields)
                    this.InitializeFieldInDesigner(childField,regenerateElement);
            if(regenerateElement)
                field.GenerationCompleted(field.JQueryElement);
            field.ApplyAllStyles();
        }


        public MoveField(targetField:sfFormElementBase<any>,fieldToInsert:sfFormElementBase<any>,position:"top"|"left"|"bottom"|"right",animate:boolean):void{
            fieldToInsert.GetContainer().RemoveField(fieldToInsert,true);
            targetField.GetContainer().InsertField(targetField,fieldToInsert,position,animate);
        }

        public InsertField(targetField:sfFormElementBase<any>,fieldToInsert:sfFormElementBase<any>,position:"top"|"left"|"bottom"|"right",animate:boolean,keepSize:boolean=false):void{
            if(position=='top'||position=="bottom") {
                this.SwitchContainer(fieldToInsert,{Width:-1,Id:'0',Type:"single"});
                var container=rnJQuery('<div></div>');
                if(fieldToInsert.JQueryElement!=null)
                    container.data('step-id',fieldToInsert.JQueryElement.data('step-id'));
                let indexOfTarget=0;
                for(let i=0;i<SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.length;i++)
                {
                    if(SmartFormsAddNewVar.FormBuilder.RedNaoFormElements[i]==targetField)
                    {
                        indexOfTarget=i;
                        if(targetField.IsFieldContainer&&position=='bottom')
                            indexOfTarget+=targetField.Fields.length;
                    }

                }
                if(position=="top") {
                    if(targetField==null) {

                        let $element;
                        if(SmartFormsAddNewVar.FormBuilder.FormType=='sec')
                            $element=rnJQuery('.step-pane.active .formelement.last');
                        else
                            $element=rnJQuery('.formelement.last');

                        container.insertBefore($element);
                        indexOfTarget=SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.length;

                    }
                    else
                    {

                        if(targetField.IsFieldContainer&&targetField.JQueryElement.find('.fieldContainerOfFields').hasClass('fieldEdition')) {
                            targetField.JQueryElement.find('.fieldContainerOfFields').prepend(container);
                            targetField.AddField(fieldToInsert,0);
                        }
                        else {
                            container.insertBefore(targetField.GetContainer().Container.$container);
                            if(targetField.FieldContainer!=null)
                                targetField.FieldContainer.AddField(fieldToInsert,targetField.FieldContainer.Fields.indexOf(targetField));
                        }
                    }

                }
                else {
                    indexOfTarget++;
                    if(targetField.IsFieldContainer&&targetField.JQueryElement.find('.fieldContainerOfFields').hasClass('fieldEdition')) {
                        targetField.JQueryElement.find('.fieldContainerOfFields').append(container);
                        targetField.AddField(fieldToInsert,targetField.Fields.length);
                    }
                    else {
                        container.insertAfter(targetField.GetContainer().Container.$container);
                        if(targetField.FieldContainer!=null)
                            targetField.FieldContainer.AddField(fieldToInsert,targetField.FieldContainer.Fields.indexOf(targetField)+1);
                    }
                }


                fieldToInsert.GenerateHtml(container,true);
                if(targetField==null)
                    RedNaoEventManager.Publish('ElementInserted',{Field:fieldToInsert,Target:targetField,Position:position});
                else
                    RedNaoEventManager.Publish('ElementMoved',{Field:fieldToInsert,Target:targetField,Position:position});
                if(!this.InsertingToAnInternalFieldHandler(targetField))
                    SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.splice(indexOfTarget,0,fieldToInsert);
                if(fieldToInsert.IsFieldContainer&&!fieldToInsert.HandleFieldsInternally)
                    for(let i=0;i<fieldToInsert.Fields.length;i++)
                        SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.splice(indexOfTarget+i+1,0,fieldToInsert.Fields[i]);

                fieldToInsert.Options.ContainerOptions.Type="single";
                this.InitializeFieldInDesigner(fieldToInsert,false);
            }


            if(position=='left'||position=="right")
            {
                //targetField.Options.ContainerOptions.Type="multiple";
                //targetField.Options.ContainerOptions.Width=100;
                //var Container:ContainerBase=SmartFormsModules.ContainerManager.CreateContainer(targetField);
                var newContainer=this.SwitchContainer(targetField, {Id:'0', Width:100,Type:"multiple"});
                newContainer.Refresh();
                newContainer.InsertField(targetField,fieldToInsert,position,animate);
                //Container.IncludeField(this.fields[0]);
                //Container.$container=this.$container;
                //Container.Refresh();
                //Container.InsertField(targetField,fieldToInsert,position,animate);
                //return targetField.GetContainer().fields;
            }
        }

        public Refresh():void{
            this.ReplaceWithJQueryElement(this.Container.$container,false);
            for(let field of this.Container.fields)
            {
                this.InitializeFieldInDesigner(field,true);
            }
        }

        protected SwitchContainer(field:sfFormElementBase<any>,options:ContainerOptions):ContainerBaseDesigner{
            let $oldContainerUI=field.GetContainer().Container.$container;
            field.Options.ContainerOptions=options;
            let container:ContainerBaseDesigner=<ContainerBaseDesigner>SmartFormsModules.ContainerManager.CreateOrUpdateContainer(field);
            container.Container.$container=$oldContainerUI;
            field.SetContainer(container);
            return container;
        }

        protected InsertingToAnInternalFieldHandler(targetField: sfFormElementBase<any>) {
            if(targetField==null)
                return false;

            if(targetField.HandleFieldsInternally&&targetField.JQueryElement.find('.fieldContainerOfFields').hasClass('fieldEdition'))
                return true;

            if(targetField.FieldContainer!=null&&targetField.FieldContainer.HandleFieldsInternally)
                return true;
            return false;
        }
    }

    export class MultipleElementsContainerDesigner extends ContainerBaseDesigner
    {
        public resizer:ContainerResizer;
        constructor(public Container:MultipleElementsContainer)
        {
            super(Container);
            this.resizer=new ContainerResizer(this);
        }

        public MoveField(targetField:sfFormElementBase<any>,fieldToInsert:sfFormElementBase<any>,position:"top"|"left"|"bottom"|"right",animate:boolean):void{
            if(fieldToInsert==targetField)
                if(position=="top"||position=="bottom")
                {
                    for(var field of this.Container.fields)
                    {
                        if(targetField!=field)
                        {
                            targetField=field;
                            break;
                        }
                    }
                }else
                {
                    targetField.JQueryElement.css('opacity',1)
                    return;
                }


            var movingInSameArea=false;
            if(targetField!=null&&targetField.GetContainer()==fieldToInsert.GetContainer()&&(position=='left'||position=='right'))
            {
                movingInSameArea=true;
            }

            fieldToInsert.GetContainer().RemoveField(fieldToInsert,true,movingInSameArea);
            targetField.GetContainer().InsertField(targetField,fieldToInsert,position,animate,movingInSameArea);
        }

        public RemoveField(field: sfFormElementBase<any>,animate:boolean,keepSize:boolean=false) {
            super.RemoveField(field,animate,keepSize);
            this.Container.fields.splice(this.Container.fields.indexOf(field),1);
            if(keepSize)
                return;
            var widthToDistribute=Math.floor(field.Options.ContainerOptions.Width/(this.Container.fields.length));
            field.Options.ContainerOptions.Width=-1;


            var containerWidth=this.Container.$container.width();
            if(this.Container.fields.length==1)
            {
                var container=this.SwitchContainer(this.Container.fields[0],{Id:'0',Width:-1,Type:"single"});
                field.SetContainer(container);
                this.Container.fields[0].JQueryElement.velocity({width:containerWidth},SmartFormsModules.animationSpeed,"easeOutExp",()=>{
                    container.Refresh();
                });

                return;
            }


            var widthInLastField=0;
            var totalUsedWidth=0;

            for(let field of this.Container.fields)
                totalUsedWidth+=field.Options.ContainerOptions.Width;

            var totalWidthThatIsGoingToBeused=totalUsedWidth+widthToDistribute*this.Container.fields.length;

            if(totalWidthThatIsGoingToBeused<100)
            {
                widthToDistribute+=Math.floor((100-totalWidthThatIsGoingToBeused)/this.Container.fields.length);
                widthInLastField=Math.max(0,100-(widthToDistribute*this.Container.fields.length +totalUsedWidth));

            }


            for(let field of this.Container.fields)
            {
                let oldWidth = 'sfFieldWidth' + field.Options.ContainerOptions.Width;
                let newWidth=widthToDistribute+(field==this.Container.fields[this.Container.fields.length-1]?widthInLastField:0) +field.Options.ContainerOptions.Width;
                let containerWidth=this.Container.$container.width();
                field.JQueryElement.velocity({width:containerWidth*newWidth/100},SmartFormsModules.animationSpeed,"easeOutExp",(element)=>{
                    field.JQueryElement.addClass('sfFieldWidth'+newWidth);
                    field.JQueryElement.removeClass(oldWidth);
                    field.JQueryElement.removeAttr('style');
                });
                field.Options.ContainerOptions.Width=newWidth;

            }

        }

        public InsertField(targetField:sfFormElementBase<any>,fieldToInsert:sfFormElementBase<any>,position:"top"|"left"|"bottom"|"right",animate:boolean,keepSize:boolean=false): sfFormElementBase<any>[] {
            if(position=='top'||position=="bottom") {
                let container:ContainerBaseDesigner=this.SwitchContainer(fieldToInsert,{Id:'0',Width:-1,Type:"single"});
                if(!targetField.IsFieldContainer||!targetField.JQueryElement.find('.fieldContainerOfFields').hasClass('fieldEdition')) {
                    if (position == 'top')
                        targetField = this.Container.fields[0];
                    else
                        targetField = this.Container.fields[this.Container.fields.length - 1];
                }
                container.InsertField(targetField,fieldToInsert,position,animate,keepSize);
                return;
            }


            if(position=='left'||position=="right")
            {
                if(typeof targetField.Options.StepId!='undefined')
                    fieldToInsert.Options.StepId=targetField.Options.StepId;
                fieldToInsert.SetContainer(this);
                let index=0;
                for(let i=0;i<this.Container.fields.length;i++)
                {
                    if(this.Container.fields[i]==targetField)
                        index=i;
                }

                let indexOfTarget=0;
                for(let i=0;i<SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.length;i++)
                {
                    if(SmartFormsAddNewVar.FormBuilder.RedNaoFormElements[i]==targetField)
                        indexOfTarget=i;
                    if(targetField.IsFieldContainer&&position=="right")
                        indexOfTarget+=targetField.Fields.length;
                }

                if(position=="right") {
                    index++;
                    indexOfTarget++;
                }

                this.Container.fields.splice(index,0,fieldToInsert);
                if(!this.InsertingToAnInternalFieldHandler(targetField))
                    SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.splice(indexOfTarget,0,fieldToInsert);
                if(fieldToInsert.IsFieldContainer&&!fieldToInsert.HandleFieldsInternally)
                    for(let i=0;i<fieldToInsert.Fields.length;i++) {
                        SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.splice(indexOfTarget + i + 1, 0, fieldToInsert.Fields[i]);
                        //this.Container.fields.splice(index+1+i,0,fieldToInsert.Fields[i]);
                    }

                var fieldsResized=[];
                var totalUsedWidth=0;
                var containerWidth = this.Container.$container.width();
                if(!keepSize) {
                    for (let field of this.Container.fields) {
                        if (field == fieldToInsert) {
                            let width = Math.floor(100 * (1 / this.Container.fields.length));
                            totalUsedWidth += width;
                            field.Options.ContainerOptions.Width = width;

                        } else {
                            var oldWidth = 'sfFieldWidth' + field.Options.ContainerOptions.Width;
                            var newWidth = Math.floor(field.Options.ContainerOptions.Width - field.Options.ContainerOptions.Width / this.Container.fields.length);
                            totalUsedWidth += newWidth;
                            fieldsResized.push({'Field': field, 'Width': newWidth});
                        }
                    }

                    var extraWidth = Math.floor((100 - totalUsedWidth) / fieldsResized.length);
                    if (totalUsedWidth + (extraWidth * fieldsResized.length) < 100) {
                        fieldToInsert.Options.ContainerOptions.Width += 100 - totalUsedWidth + extraWidth;
                    }


                    for (let iteration of fieldsResized) {
                        let field = iteration.Field;
                        let oldWidth = 'sfFieldWidth' + field.Options.ContainerOptions.Width;
                        field.Options.ContainerOptions.Width = iteration.Width + extraWidth;
                        field.JQueryElement.velocity({width: Math.floor((containerWidth-1) * field.Options.ContainerOptions.Width / 100)}, SmartFormsModules.animationSpeed, "easeOutExp", (element) => {
                            field.JQueryElement.addClass('sfFieldWidth' + field.Options.ContainerOptions.Width);
                            field.JQueryElement.removeClass(oldWidth);
                            field.JQueryElement.removeAttr('style');
                        });
                    }
                }


                let $jQueryToInsert=this.Container.GenerateItemContent(fieldToInsert);
                $jQueryToInsert.css('width',0);
                $jQueryToInsert.css('overflow','hidden');
                if(targetField.IsFieldContainer&&targetField.JQueryElement.find('.fieldContainerOfFields').hasClass('fieldEdition')) {
                    targetField.JQueryElement.find('.fieldContainerOfFields').prepend($jQueryToInsert);
                    targetField.AddField(fieldToInsert,0);
                }
                else {
                    if(targetField.FieldContainer!=null)
                        if(position=='left')
                            targetField.FieldContainer.AddField(fieldToInsert,targetField.FieldContainer.Fields.indexOf(targetField));
                        else
                            targetField.FieldContainer.AddField(fieldToInsert,targetField.FieldContainer.Fields.indexOf(targetField)+1);

                    if (position == 'left')
                        $jQueryToInsert.insertBefore(targetField.JQueryElement);
                    else
                        $jQueryToInsert.insertAfter(targetField.JQueryElement);
                }


                $jQueryToInsert.velocity({width:Math.floor(containerWidth*fieldToInsert.Options.ContainerOptions.Width/100)},SmartFormsModules.animationSpeed,"easeOutExp",(element)=>{
                    $jQueryToInsert.removeClass(oldWidth);
                    $jQueryToInsert.removeAttr('style');
                    this.InitializeFieldInDesigner(fieldToInsert,true);
                    RedNaoEventManager.Publish('ElementMoved',{Field:fieldToInsert,Target:targetField,Position:position});
                });



                //todo como calcular el espacio de tal forma que los campos conserver sus proporciones?


                /*this.fields.push(fieldToInsert);
                 targetField.Options.ContainerOptions.Type="multiple";
                 var Container:ContainerBase=SmartFormsModules.ContainerManager.CreateContainer(targetField);
                 targetField.SwitchContainer(Container);
                 Container.IncludeField(this.fields[0]);
                 Container.$container=this.$container;
                 Container.Refresh();
                 Container.InsertField(targetField,fieldToInsert,position,animate);
                 return this.$container;*/
            }

        }


    }



}