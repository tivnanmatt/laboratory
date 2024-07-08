"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DragItemBehaviorBase = /** @class */ (function () {
    function DragItemBehaviorBase(formBuilder, draggedElement) {
        this.FieldContainerOfFields = null;
        this.DraggedElement = draggedElement;
        this.FormBuilder = formBuilder;
        this.FieldWithFields = new FieldWithFieldsManager(this);
    }
    DragItemBehaviorBase.prototype.DragDrop = function (formBuilder, target, subTarget, subTargetPosition) {
    };
    ;
    DragItemBehaviorBase.prototype.HoverInAnything = function (target, displayedDraggedElement, x, y) {
        this.FieldWithFields.Clear();
        displayedDraggedElement.addClass('sfInvalidDrop');
        if (this.rule != null) {
            this.rule.css('opacity', 0);
        }
    };
    ;
    DragItemBehaviorBase.prototype.FireEvent = function (eventName, args) {
        if (typeof this[eventName] != 'undefined')
            this[eventName](args);
    };
    ;
    DragItemBehaviorBase.prototype.DisplayDraggedItem = function (classOrigin) {
        return null;
    };
    ;
    DragItemBehaviorBase.prototype.ElementClicked = function () {
    };
    ;
    DragItemBehaviorBase.prototype.ExecuteHoverAgain = function () {
        this.HoverInElement(this.LastTarget, this.LastPosition, this.LastDiplayedDraggedElement, this.LastSubTarget, this.LastSubTargetPosition);
    };
    ;
    DragItemBehaviorBase.prototype.HoverInElement = function (target, position, displayedDraggedElement, subTarget, subTargetPosition) {
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
        var hasContainer = false;
        var container = target;
        if (this.FieldWithFields.IsEditionInProcess()) {
            if (subTarget != null) {
                target = subTarget;
                container = subTarget;
                position = subTargetPosition;
            }
            else {
                /*   if(position=='left')
                       position='top';
                   else*/
                position = 'bottom';
            }
        }
        if (target.parent().hasClass('sfContainer')) {
            container = target.parent();
            hasContainer = true;
        }
        else if ((this.DraggedElement.attr("id") == target.attr("id") && !target.hasClass('last') && typeof target.attr("id") != 'undefined') || (typeof target.prev().attr('id') != 'undefined' && target.hasClass('last') && target.prev().attr('id') == this.DraggedElement.attr("id")) && !this.FieldWithFields.IsEditionInProcess())
            return;
        var top = 0;
        var left = 0;
        var width = 0;
        var height = 0;
        var offset = target.offset();
        var containerOffset = container.offset();
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
            }
            else {
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
    ;
    return DragItemBehaviorBase;
}());
/************************************************************************************New Element Behavior****************************************/
var DragItemBehaviorNewElement = /** @class */ (function (_super) {
    __extends(DragItemBehaviorNewElement, _super);
    function DragItemBehaviorNewElement(formBuilder, draggedElement) {
        return _super.call(this, formBuilder, draggedElement) || this;
    }
    DragItemBehaviorNewElement.prototype.HoverInAnything = function (target, displayedDraggedElement, x, y) {
        this.FieldWithFields.Clear();
        var formBuilder = rnJQuery('.rednaoformbuilder');
        var offset = formBuilder.offset();
        if (x < offset.left || x > offset.left + formBuilder.width() || y < offset.top || y > offset.top + formBuilder.height())
            displayedDraggedElement.addClass('sfInvalidDrop');
        else
            displayedDraggedElement.removeClass('sfInvalidDrop');
        if (this.rule != null) {
            this.rule.css('opacity', 0);
        }
    };
    ;
    DragItemBehaviorNewElement.prototype.DragDrop = function (target, position, subTarget, subTargetPosition) {
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
        var hasContainer = target.parent().hasClass('sfContainer');
        var formElement = this.FormBuilder.CreateNewInstanceOfElement(this.DraggedElement);
        var targetField = null;
        var targetId = target.attr('id');
        if (this.FieldWithFields.IsEditionInProcess()) {
            if (subTarget != null) {
                targetId = subTarget.attr('id');
                position = subTargetPosition;
            }
            else {
                /*  if(position=='left')
                      position='top';
                  else*/
                position = 'bottom';
            }
        }
        for (var i = 0; i < this.FormBuilder.RedNaoFormElements.length; i++) {
            if (this.FormBuilder.RedNaoFormElements[i].Id == targetId)
                targetField = this.FormBuilder.RedNaoFormElements[i];
            if (this.FormBuilder.RedNaoFormElements[i].HandleFieldsInternally)
                for (var _i = 0, _a = this.FormBuilder.RedNaoFormElements[i].Fields; _i < _a.length; _i++) {
                    var internalField = _a[_i];
                    if (internalField.Id == targetId)
                        targetField = internalField;
                }
        }
        if (formElement != null) {
            var container = rnJQuery('<div></div>');
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
            }
            else
                targetField.InsertField(formElement, position, true);
        }
        this.FieldWithFields.Clear();
        this.rule.remove();
        this.rule = null;
    };
    ;
    DragItemBehaviorNewElement.prototype.DisplayDraggedItem = function (classOrigin) {
        var tempForm = rnJQuery('<div class="form-horizontal span6 temp ' + classOrigin + ' tempForm" >' + this.DraggedElement.html() + '</div>');
        rnJQuery(".rednaoformbuilder").append(tempForm);
        return tempForm;
    };
    ;
    return DragItemBehaviorNewElement;
}(DragItemBehaviorBase));
var DragItemBehaviorExistingElement = /** @class */ (function (_super) {
    __extends(DragItemBehaviorExistingElement, _super);
    function DragItemBehaviorExistingElement(formBuilder, draggedElement) {
        var _this = _super.call(this, formBuilder, draggedElement) || this;
        _this.rule = null;
        _this.latestPosition = '';
        _this.FormElement = _this.FormBuilder.GetFormElementByContainer(draggedElement);
        return _this;
    }
    DragItemBehaviorExistingElement.prototype.DragDrop = function (target, position, subTarget, subTargetPosition) {
        if (target == null) {
            if (this.rule != null) {
                this.rule.remove();
                this.rule = null;
            }
            this.DraggedElement.css('opacity', 1);
            this.FieldWithFields.Clear();
            return;
        }
        var formElement = this.FormElement;
        var targetField = null;
        var targetId = target.attr('id');
        if (this.FieldWithFields.IsEditionInProcess()) {
            if (subTarget != null) {
                targetId = subTarget.attr('id');
                position = subTargetPosition;
            }
            else {
                position = 'bottom';
            }
        }
        for (var i = 0; i < this.FormBuilder.RedNaoFormElements.length; i++) {
            if (this.FormBuilder.RedNaoFormElements[i].Id == targetId)
                targetField = this.FormBuilder.RedNaoFormElements[i];
            if (this.FormBuilder.RedNaoFormElements[i].HandleFieldsInternally)
                for (var _i = 0, _a = this.FormBuilder.RedNaoFormElements[i].Fields; _i < _a.length; _i++) {
                    var internalField = _a[_i];
                    if (internalField.Id == targetId)
                        targetField = internalField;
                }
        }
        if (formElement != null) {
            var container = rnJQuery('<div></div>');
            container.data('step-id', target.data('step-id'));
            /* if(position=='top'||position=='left')
             {
                 container.insertBefore(target);
             }else
                 container.insertAfter(target);*/
            if (targetField == null) {
                if (SmartFormsAddNewVar.FormBuilder.FormType == 'sec') {
                    var stepId = rnJQuery('.step-pane.active').data('step-id');
                    var fields = SmartFormsAddNewVar.FormBuilder.MultipleStepsDesigner.StepCatalog[stepId].Fields;
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
            var hasContainer = targetField.JQueryElement.parent().hasClass('sfContainer');
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
    ;
    DragItemBehaviorExistingElement.prototype.DisplayDraggedItem = function (classOrigin) {
        var tempForm = rnJQuery('<div class="form-horizontal span6 temp ' + classOrigin + ' tempForm" >' + this.DraggedElement.html() + '</div>');
        rnJQuery(".rednaoformbuilder").append(tempForm);
        //this.DraggedElement.replaceWith("<div id='redNaoSmartFormsPlaceHolder' class='redNaoTarget'></div>");
        this.DraggedElement.css('opacity', .3);
        return tempForm;
    };
    ;
    DragItemBehaviorExistingElement.prototype.ElementClicked = function () {
        this.FormBuilder.ElementClicked(this.DraggedElement);
    };
    ;
    return DragItemBehaviorExistingElement;
}(DragItemBehaviorBase));
var FieldWithFieldsManager = /** @class */ (function () {
    function FieldWithFieldsManager(dragManager) {
        this.DragManager = dragManager;
        this.FieldContainer = null;
        this.TimeOut = null;
        this.CurrentTarget = null;
    }
    FieldWithFieldsManager.prototype.IsEditionInProcess = function () {
        return this.FieldContainer != null;
    };
    ;
    FieldWithFieldsManager.prototype.Clear = function () {
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
    ;
    FieldWithFieldsManager.prototype.ProcessingHover = function (target, position) {
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
    ;
    FieldWithFieldsManager.prototype.StartTimeoutForFieldEdition = function (target) {
        var self = this;
        this.CurrentTarget = target;
        this.TimeOut = setTimeout(function () {
            self.FieldContainer = target;
            target.find('.fieldContainerOfFields').addClass('fieldEdition');
            self.DragManager.ExecuteHoverAgain();
            self.TimeOut = null;
        }, 2000);
    };
    ;
    FieldWithFieldsManager.prototype.ProcessDrop = function () {
        this.Clear();
    };
    ;
    return FieldWithFieldsManager;
}());
//# sourceMappingURL=dragitembehaviors.js.map