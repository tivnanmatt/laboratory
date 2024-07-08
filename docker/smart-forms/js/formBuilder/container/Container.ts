declare var smartFormsDesignMode:boolean;
namespace SmartFormsModules {
    export const animationSpeed:number=300;
    import ContainerBaseDesigner = SmartFormsModules.ContainerBaseDesigner;
    var mod=SmartFormsModules;


    export class ContainerManager {
        public static ContainerDictionary:any={};

        public static GetFormDictionary(formId:number){
            let item = SmartFormsModules.ContainerManager.ContainerDictionary[formId];
            if(item==null)
            {
                item={
                    LastId:0,
                    Containers:{}
                };
                mod.ContainerManager.ContainerDictionary[formId]=item;
            }
            return item;
        }

        public static GetNextContainerId(formId:number):number
        {
            return ++mod.ContainerManager.GetFormDictionary(formId).LastId;
        }

        public static ClearContainer(formId:number)
        {
            SmartFormsModules.ContainerManager.ContainerDictionary[formId]=null;
        }

        public static DeleteContainerOfField(field:sfFormElementBase<any>)
        {
            let dictionary=mod.ContainerManager.GetFormDictionary(field.GetFormId());
            let containerOptions:ContainerOptions=field.Options.ContainerOptions;
            if(typeof dictionary.Containers[containerOptions.Id]!='undefined')
                delete dictionary.Containers[containerOptions.Id];
        }
        public static CreateOrUpdateContainer(field:sfFormElementBase<any>):Container
        {
            var dictionary=mod.ContainerManager.GetFormDictionary(field.GetFormId());
            var containerOptions:ContainerOptions=field.Options.ContainerOptions;
            var id:string=containerOptions.Id;
            if(containerOptions.Id=='0') {
                id = (++dictionary.LastId).toString();
                containerOptions.Id=id;
            }else
            {
                let id=parseInt(containerOptions.Id);
                if(id>dictionary.LastId)
                    dictionary.LastId=id;
            }

            var container=dictionary.Containers[id];
            if(container==null)
            {
               container= mod.ContainerManager.CreateContainer(field);
               dictionary.Containers[id]=container;

            }

            container.IncludeField(field);
            return container;
        }

        public static CreateContainer(field:sfFormElementBase<any>):Container
        {
            if(field.Options.ContainerOptions.Type=="single")
            {
                if(typeof smartFormsDesignMode!='undefined' && smartFormsDesignMode)
                    return new SmartFormsModules.ContainerBaseDesigner(new ContainerBase());
                return new ContainerBase();
            }
            if(typeof smartFormsDesignMode!='undefined' && smartFormsDesignMode)
                return new MultipleElementsContainerDesigner(new MultipleElementsContainer());

            return new MultipleElementsContainer();

        }
    }


    /*---------------------------------------------------------------------------------------------------------------------------------------------------*/

    export class Container
    {

    }


    export class ContainerBase extends Container{
        public $container:JQuery;
        public ContainerAddedCallback:()=>void=null;
        public fields:sfFormElementBase<any>[]=[];
        get Options():ContainerOptions{
            return this.fields[0].Options.ContainerOptions;
        }
        constructor()
        {
            super();
        }

        public GetContainerId():string
        {
            return this.Options.Id;
        }



        public IncludeField(field: sfFormElementBase<any>) {
            this.fields.push(field);
        }

        public AppendJQueryElementToUI(elementToAdd:sfFormElementBase<any>,jQueryContainer:JQuery,animate:boolean): JQuery {
            if(elementToAdd.FieldContainer!=null&&!jQueryContainer.hasClass('fieldContainerOfFields'))
                return elementToAdd.JQueryElement;
            this.$container=rnJQuery( '<div class="'+this.fields[0].GetElementClasses()+'" id="'+this.fields[0].Id+'">'+this.fields[0].GenerateInlineElement()+'</div>');
            jQueryContainer.append(this.$container);
            if(this.ContainerAddedCallback!=null)
                this.ContainerAddedCallback();

            if(elementToAdd.IsFieldContainer&&(!elementToAdd.HandleFieldsInternally||smartFormsDesignMode))//at runtime the fields are handled manually by the field
                for(let field of elementToAdd.Fields)
                    field.AppendElementToContainer(this.$container.find('.fieldContainerOfFields'),animate);
            return this.$container;
        }







        protected GetJQueryContent():JQuery{
            var $element:JQuery= rnJQuery('<div class="'+this.fields[0].GetElementClasses()+'" id="'+this.fields[0].Id+'" >'+this.fields[0].GenerateInlineElement()+'</div>');
            if(this.fields[0].IsFieldContainer)
            {
                for(var field of this.fields[0].Fields)
                {
                    field.JQueryElement=field.GetContainer().AppendJQueryElementToUI(field,$element.find('.fieldContainerOfFields'),true);
                    /*var $childElement:JQuery=rnJQuery('<div class="'+field.GetElementClasses()+'" id="'+field.Id+'" >'+field.GenerateInlineElement()+'</div>');

                    $element.find('.fieldContainerOfFields').append($childElement);
                    field.JQueryElement=$childElement;*/
                }
            }
            this.fields[0].JQueryElement=$element;
            return $element;
        }


        public ReplaceWithJQueryElement(jQueryContainer:JQuery,animate:boolean): JQuery {
            this.$container=this.GetJQueryContent();
            if(animate) {
                this.$container.addClass('rnTemporalHidden');
                jQueryContainer.replaceWith(this.$container);

                var height = this.$container.height();
                var width = this.$container.parent().width();
                this.$container.width(0);
                this.$container.height(0);

                this.$container.removeClass('rnTemporalHidden');
                this.$container.css('overflow','hidden');
                this.$container.velocity({'width': width, 'height': height}, animationSpeed, "easeInExp", () => {
                    this.$container.removeAttr('style')
                });
            }
            else {
                jQueryContainer.replaceWith(this.$container);

            }
            if(this.ContainerAddedCallback!=null)
                this.ContainerAddedCallback();
            return this.$container;
        }

        public GetWidth(field: sfFormElementBase<any>) {

        }



    }

    /*---------------------------------------------------------------------------------------------------------------------------------------------------*/
    export class MultipleElementsContainer extends ContainerBase{


        protected GetJQueryContent(): JQuery {
            var $content=rnJQuery('<div class="row sfContainer col-sm-12"></div>');
            for(let field of this.fields)
            {
                var $element=this.GenerateItemContent(field);
                $content.append($element);
            }
            return $content;
        }

        public AppendJQueryElementToUI(elementToAdd:sfFormElementBase<any>,jQueryContainer:JQuery,animate:boolean): JQuery {
            if(elementToAdd.FieldContainer!=null&&!jQueryContainer.hasClass('fieldContainerOfFields'))
                return elementToAdd.JQueryElement;
            if(elementToAdd==this.fields[0])
            {
                this.$container=rnJQuery('<div class="row sfContainer col-sm-12"></div>');
                jQueryContainer.append(this.$container);
                if(this.ContainerAddedCallback!=null)
                    this.ContainerAddedCallback();
            }

            var $element=this.GenerateItemContent(elementToAdd);
            this.$container.append($element);
            return $element;
        }

        public GenerateItemContent(field:sfFormElementBase<any>):JQuery{
            var $element=rnJQuery('<div class="'+field.GetElementClasses()+'" id="'+field.Id+'" >'+field.GenerateInlineElement()+'</div>');
            if(field.IsFieldContainer)
            {
                for(var childField of field.Fields)
                {
                    //childField.JQueryElement=childField.GetContainer().AppendJQueryElementToUI(childField,$element.find('.fieldContainerOfFields'),true);
                    childField.AppendElementToContainer($element.find('.fieldContainerOfFields'),true)
                }
            }
            field.JQueryElement=$element;
            return $element;
        }


    }
}