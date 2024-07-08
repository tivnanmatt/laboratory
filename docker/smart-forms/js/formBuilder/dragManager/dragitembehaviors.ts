"use strict";

class DragItemBehaviorBase {
    public FieldContainerOfFields: any;
    public DraggedElement: JQuery;
    public FormBuilder: RedNaoFormBuilder;
    public FieldWithFieldsManager: FieldWithFieldsManager;
    public FieldWithFields:FieldWithFieldsManager;
    public rule:JQuery;
    public LastTarget:any;
    public LastPosition:any;
    public LastDiplayedDraggedElement:any;
    public LastSubTarget:any;
    public LastSubTargetPosition:any;
    public latestPosition:any;

    constructor(formBuilder, draggedElement) {
        this.FieldContainerOfFields = null;
        this.DraggedElement = draggedElement;
        this.FormBuilder = formBuilder;
        this.FieldWithFields = new FieldWithFieldsManager(this);
    }



    public DragDrop(formBuilder, target, subTarget, subTargetPosition) {

    };

    public HoverInAnything(target, displayedDraggedElement,x,y) {
        this.FieldWithFields.Clear();
        displayedDraggedElement.addClass('sfInvalidDrop');
        if (this.rule != null) {
            this.rule.css('opacity', 0);
        }
    };

    public FireEvent(eventName, args) {
        if (typeof this[eventName] != 'undefined')
            this[eventName](args);
    };

    public DisplayDraggedItem(classOrigin):JQuery {
        return null;
    };

    public ElementClicked() {

    };

    public ExecuteHoverAgain() {
        this.HoverInElement(this.LastTarget, this.LastPosition, this.LastDiplayedDraggedElement, this.LastSubTarget, this.LastSubTargetPosition);
    };

    public HoverInElement(target, position, displayedDraggedElement, subTarget, subTargetPosition) {
        this.LastTarget = target;
        this.LastPosition = position;
        this.LastDiplayedDraggedElement = displayedDraggedElement;
        this.LastSubTarget = subTarget;
        this.LastSubTargetPosition = subTargetPosition;
        if (this.rule != null) {
            this.rule.css('opacity', 1);
        }

        this.FieldWithFields.ProcessingHover(target, position);

        displayedDraggedElement.removeClass('sfInvalidDrop');
        let hasContainer = false;
        let container = target;

        if (this.FieldWithFields.IsEditionInProcess()) {
            if (subTarget != null) {
                target = subTarget;
                container = subTarget;
                position = subTargetPosition;
            } else {
                /*   if(position=='left')
                       position='top';
                   else*/
                position = 'bottom'
            }
        }


        if (target.parent().hasClass('sfContainer')) {
            container = target.parent();
            hasContainer = true;
        }
        else if ((this.DraggedElement.attr("id") == target.attr("id") && !target.hasClass('last') && typeof target.attr("id") != 'undefined') || (typeof target.prev().attr('id') != 'undefined' && target.hasClass('last') && target.prev().attr('id') == this.DraggedElement.attr("id")) && !this.FieldWithFields.IsEditionInProcess())
            return;

        let top = 0;
        let left = 0;
        let width = 0;
        let height = 0;
        let offset = target.offset();
        let containerOffset = container.offset();
        if (position == 'top' || position == 'bottom') {
            if (this.FieldWithFields.IsEditionInProcess())
                container = target;

            width = container.width();
            height = 0;
            left = containerOffset.left;

            if (this.FieldWithFields.IsEditionInProcess() && subTarget == null) {
                width -= 14;
                left += 7;


                if (position == 'top')
                    top = containerOffset.top + 5;
                else
                    top = containerOffset.top + container.height() - 5;
            } else {
                if (position == 'top')
                    top = containerOffset.top - 5;
                else
                    top = containerOffset.top + container.height() + (hasContainer ? -5 : 5);
            }

        }

        if (position == 'left' || position == 'right') {
            width = 0;
            height = container.height() - (hasContainer ? 10 : 0);
            top = offset.top;
            if (position == 'left')
                left = offset.left + 5;
            else
                left = offset.left + target.width() + 5;
        }


        if (this.rule == null) {
            this.rule = rnJQuery('<div class="sfDragRuller"></div>');
            rnJQuery('body').append(this.rule);
        }

        this.rule.css('width', width);
        this.rule.css('height', height);
        this.rule.css('top', top);
        this.rule.css('left', left);

        this.latestPosition = position;

        //rnJQuery(this.DraggedElement).fadeTo(0.5, 1);
        //rnJQuery("<div id='redNaoSmartFormsPlaceHolder' class='redNaoTarget'></div>").insertBefore(target);
    };

}
/************************************************************************************New Element Behavior****************************************/

class DragItemBehaviorNewElement extends DragItemBehaviorBase {
    constructor(formBuilder, draggedElement) {
        super(formBuilder, draggedElement);
    }

    public HoverInAnything(target, displayedDraggedElement, x, y) {
        this.FieldWithFields.Clear();
        let formBuilder = rnJQuery('.rednaoformbuilder');
        let offset = formBuilder.offset();

        if (x < offset.left || x > offset.left + formBuilder.width() || y < offset.top || y > offset.top + formBuilder.height())
            displayedDraggedElement.addClass('sfInvalidDrop');
        else
            displayedDraggedElement.removeClass('sfInvalidDrop');

        if (this.rule != null) {
            this.rule.css('opacity', 0);
        }


    };

    public DragDrop(target, position, subTarget, subTargetPosition) {

        if (this.FormBuilder.RedNaoFormElements.length >= 8 && !RedNaoLicensingManagerVar.LicenseIsValid('Sorry, this version support up to 8 fields')) {
            rnJQuery('#redNaoSmartFormsPlaceHolder').remove();
            if (this.rule != null) {
                this.rule.remove();
                this.rule = null;
            }
            return;
        }

        if (target == null) {
            if (this.rule != null) {
                this.rule.remove();
                this.rule = null;
            }
            return;
        }


        let hasContainer = target.parent().hasClass('sfContainer');
        let formElement = this.FormBuilder.CreateNewInstanceOfElement(this.DraggedElement);
        let targetField = null;
        let targetId = target.attr('id');
        if (this.FieldWithFields.IsEditionInProcess()) {
            if (subTarget != null) {
                targetId = subTarget.attr('id');
                position = subTargetPosition;
            } else {
                /*  if(position=='left')
                      position='top';
                  else*/
                position = 'bottom'
            }

        }

        for (let i = 0; i < this.FormBuilder.RedNaoFormElements.length; i++) {
            if (this.FormBuilder.RedNaoFormElements[i].Id == targetId)
                targetField = this.FormBuilder.RedNaoFormElements[i];
            if(this.FormBuilder.RedNaoFormElements[i].HandleFieldsInternally)
                for(let internalField of this.FormBuilder.RedNaoFormElements[i].Fields)
                    if(internalField.Id==targetId)
                        targetField=internalField;
        }
        if (formElement != null) {
            let container = rnJQuery('<div></div>');
            container.data('step-id', target.data('step-id'));

            if (formElement != null && targetField != null && formElement.IsFieldContainer && (targetField.IsFieldContainer || targetField.FieldContainer != null) && targetField != formElement && this.FieldWithFields.IsEditionInProcess()) {
                alert('Sorry for now it is not possible to add a field container inside another field container');
                if (this.rule != null) {
                    this.rule.remove();
                    this.rule = null;
                }
                this.DraggedElement.css('opacity', 1);
                this.FieldWithFields.Clear();
                return;
            }

            if (targetField == null) {
                formElement.GetContainer().InsertField(null, formElement, position, true);

            } else
                targetField.InsertField(formElement, position, true);

        }
        this.FieldWithFields.Clear();
        this.rule.remove();
        this.rule = null;


    };

    public DisplayDraggedItem(classOrigin):JQuery {
        let tempForm = rnJQuery('<div class="form-horizontal span6 temp ' + classOrigin + ' tempForm" >' + this.DraggedElement.html() + '</div>');
        rnJQuery(".rednaoformbuilder").append(tempForm);
        return tempForm;

    };
}


class DragItemBehaviorExistingElement extends DragItemBehaviorBase {

    public rule: any;
    public latestPosition: string;
    public FormElement: sfFormElementBase<any>;

    constructor(formBuilder, draggedElement) {
        super(formBuilder, draggedElement);
        this.rule = null;
        this.latestPosition = '';
        this.FormElement = this.FormBuilder.GetFormElementByContainer(draggedElement);
    }

    public DragDrop(target, position, subTarget, subTargetPosition) {
        if (target == null) {
            if (this.rule != null) {
                this.rule.remove();
                this.rule = null;
            }
            this.DraggedElement.css('opacity', 1);
            this.FieldWithFields.Clear();
            return;
        }


        let formElement = this.FormElement;
        let targetField = null;
        let targetId = target.attr('id');
        if (this.FieldWithFields.IsEditionInProcess()) {
            if (subTarget != null) {
                targetId = subTarget.attr('id');
                position = subTargetPosition;
            }
            else {
                position = 'bottom'
            }

        }

        for (let i = 0; i < this.FormBuilder.RedNaoFormElements.length; i++) {
            if (this.FormBuilder.RedNaoFormElements[i].Id == targetId)
                targetField = this.FormBuilder.RedNaoFormElements[i];
            if(this.FormBuilder.RedNaoFormElements[i].HandleFieldsInternally)
                for(let internalField of this.FormBuilder.RedNaoFormElements[i].Fields)
                    if(internalField.Id==targetId)
                        targetField=internalField;
        }


        if (formElement != null) {


            let container = rnJQuery('<div></div>');
            container.data('step-id', target.data('step-id'));
            /* if(position=='top'||position=='left')
             {
                 container.insertBefore(target);
             }else
                 container.insertAfter(target);*/
            if (targetField == null) {
                if (SmartFormsAddNewVar.FormBuilder.FormType == 'sec') {
                    let stepId = rnJQuery('.step-pane.active').data('step-id');
                    let fields = SmartFormsAddNewVar.FormBuilder.MultipleStepsDesigner.StepCatalog[stepId].Fields;
                    targetField = fields[fields.length - 1];
                }
                else
                    targetField = SmartFormsAddNewVar.FormBuilder.RedNaoFormElements[SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.length - 1];
                if (targetField.FieldContainer != null)
                    targetField = targetField.FieldContainer;
                position = 'bottom';


            }

            if (formElement != null && targetField != null && formElement.IsFieldContainer && (targetField.IsFieldContainer || targetField.FieldContainer != null) && targetField != formElement && this.FieldWithFields.IsEditionInProcess()) {
                alert('Sorry for now it is not possible to add a field container inside another field container');
                if (this.rule != null) {
                    this.rule.remove();
                    this.rule = null;
                }
                this.DraggedElement.css('opacity', 1);
                this.FieldWithFields.Clear();
                return;
            }

            let hasContainer = targetField.JQueryElement.parent().hasClass('sfContainer');
            if (targetField == formElement && !hasContainer) {
                this.DraggedElement.css('opacity', 1);
                if (this.rule != null) {
                    this.rule.remove();
                    this.rule = null;
                }
                this.FieldWithFields.Clear();
                return;
            }


            targetField.MoveField(formElement, position, true);


            //this.FormBuilder.MoveFieldInPosition(formElement,container);
            //var newElementJQuery= formElement.GenerateHtml(container,true);
            /*for(i=0;i<fieldsUpdated.length;i++)
                this.FireEvent("ElementAdded",fieldsUpdated[i].JQueryElement);*/
        }
        this.FieldWithFields.Clear();
        this.rule.remove();
        this.rule = null;
    };

    public DisplayDraggedItem(classOrigin):JQuery {
        let tempForm = rnJQuery('<div class="form-horizontal span6 temp ' + classOrigin + ' tempForm" >' + this.DraggedElement.html() + '</div>');
        rnJQuery(".rednaoformbuilder").append(tempForm);

        //this.DraggedElement.replaceWith("<div id='redNaoSmartFormsPlaceHolder' class='redNaoTarget'></div>");
        this.DraggedElement.css('opacity', .3);
        return tempForm;
    };

    public ElementClicked() {

        this.FormBuilder.ElementClicked(this.DraggedElement);

    };


}

class FieldWithFieldsManager {
    public DragManager: DragItemBehaviorBase;
    public FieldContainer: JQuery;
    public TimeOut: any;
    public CurrentTarget: any;

    constructor(dragManager: DragItemBehaviorBase) {
        this.DragManager = dragManager;
        this.FieldContainer = null;
        this.TimeOut = null;
        this.CurrentTarget = null;

    }

    public IsEditionInProcess() {
        return this.FieldContainer != null;
    };

    public Clear() {

        if (this.TimeOut != null) {
            clearTimeout(this.TimeOut);
            this.TimeOut = null;
        }

        if (this.FieldContainer != null) {
            this.FieldContainer.find('.fieldContainerOfFields').removeClass('fieldEdition');
            this.FieldContainer = null;
        }

        this.CurrentTarget = null;

    };

    public ProcessingHover(target, position) {
        if (this.FieldContainer != null && this.FieldContainer[0] != target[0]) {
            this.Clear();
        }

        if (target.hasClass('sfFieldWithFields')) {
            if (this.CurrentTarget != null && target != null && this.CurrentTarget[0] != target[0] && !rnJQuery.contains(this.CurrentTarget.find('.fieldContainerOfFields'), target))
                this.Clear();
            if (this.FieldContainer == null && this.TimeOut == null)
                this.StartTimeoutForFieldEdition(target);

        }
    };

    public StartTimeoutForFieldEdition(target) {
        let self = this;
        this.CurrentTarget = target;
        this.TimeOut = setTimeout(function () {
            self.FieldContainer = target;
            target.find('.fieldContainerOfFields').addClass('fieldEdition');
            self.DragManager.ExecuteHoverAgain();
            self.TimeOut = null;
        }, 2000);
    };

    public ProcessDrop() {
        this.Clear();
    };
}