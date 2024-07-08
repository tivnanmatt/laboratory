"use strict";
class RedNaoDragManager {
    public FormBuilder: RedNaoFormBuilder;
    public moveFunction: any;
    public IsResizing: boolean;
    public DragBehavior:DragItemBehaviorBase;
    public displayedDraggedElement:JQuery;
    public UnbindMoveFunction:any;

    constructor(formBuilder: any) {
        this.FormBuilder = formBuilder;
        this.moveFunction = null;
        this.IsResizing = false;
    }

    public MakeFieldsCatalogDraggable() {
        let items = rnJQuery(".rednaoformbuilder .component");
        for (let i = 0; i < items.length; i++) {
            if(!RedNaoSmartFormLicenseIsValid&&rnJQuery(items[i]).parents('.smartFormFieldTabPro').length>0)
                continue;
            this.MakeItemDraggable(rnJQuery(items[i]));

        }
    };

    public MakeAlreadySelectedElementsDraggable() {
        let items = rnJQuery("#redNaoElementlist .rednao-control-group");
        for (let i = 0; i < items.length; i++) {
            this.MakeItemDraggable(rnJQuery(items[i]));
        }
    };


    public MakeItemDraggable(jQueryElement) {
        let self = this;
        jQueryElement.mousedown(function (e) {
            self.SmartDonationsFormMouseDownFired(e, rnJQuery(this))
        });
        jQueryElement.find('input[type=submit],button,input[type=image]').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        jQueryElement.find('.redNaoCheckBox').unbind('mouseover');
        jQueryElement.find('.redNaoCheckBox').unbind('click');
        jQueryElement.find('.iCheck-helper').unbind('mouseover');
        jQueryElement.find('.iCheck-helper').unbind('click');

        jQueryElement.find('.redNaoRadio').unbind('mouseover');
        jQueryElement.find('.redNaoRadio').unbind('click');

        jQueryElement.find('.select2-choice').unbind('mousedown');


    };

    public SmartDonationsFormMouseDownFired(e, draggedElement) {
        if (e.which != 1 || this.IsResizing)
            return;

        let focused = rnJQuery(':focus');
        if (focused.length > 0) {
            if (focused.closest('#smartFormPropertiesContainer').length > 0) {
                focused.blur();
            }
        }
        e.stopPropagation();
        e.preventDefault();
        if (typeof this.FormBuilder == 'undefined')//formbuilder is undefined when called from the style editor
            return;
        if (this.FormBuilder.FormBuilderDisabled)
            return;
        let draggedItemDisplayed = false;

        if (rnJQuery(this).hasClass('last'))
            return;

        let classOrigin = "";
        if (draggedElement.closest('.formelements').length > 0 || draggedElement.closest('.step-pane').length > 0)//step-pane for splitted forms;
            this.DragBehavior = new DragItemBehaviorExistingElement(this.FormBuilder, draggedElement);
        else
            this.DragBehavior = new DragItemBehaviorNewElement(this.FormBuilder, draggedElement);

        let self = this;
      /*  this.DragBehavior.ElementAdded = function (newElementJQuery) {
            self.MakeItemDraggable(newElementJQuery);
        };*/

        let offset = draggedElement.offset();


        let pageX = e.pageX;
        let pageY = e.pageY;
        let deltaX = pageX - offset.left;
        let deltaY = pageY - offset.top;
        // this.UnbindMovefunction();


        this.moveFunction = function (e) {
            if (e.pageX > pageX - 10 && e.pageX < pageX + 10 && e.pageY > pageY - 10 && e.pageY < pageY + 10)
                return;

            if (!draggedItemDisplayed) {
                self.displayedDraggedElement = self.DragBehavior.DisplayDraggedItem(classOrigin);
                draggedItemDisplayed = true;
                self.MakeItemDraggable(self.displayedDraggedElement);
            }

            self.displayedDraggedElement.offset({top: e.pageY - deltaY, left: e.pageX - deltaX});
            let list = rnJQuery("#redNaoElementlist .rednao-control-group,#redNaoElementlist .last,#redNaoSmartFormsPlaceHolder");
            let i;
            for (i=0; i < list.length; i++) {
                let currentElement = rnJQuery(list[i]);
                let offset = currentElement.offset();
                let width = currentElement.outerWidth(true);
                let height = currentElement.outerHeight(true);
                if (e.pageY > offset.top && e.pageX > offset.left && e.pageY < offset.top + height && e.pageX < offset.left + width) {
                    let position = "";
                    let sideWidth = width * .1;
                    if (e.pageX > offset.left + width - sideWidth)
                        position = 'right';
                    else if (e.pageX < offset.left + sideWidth)
                        position = 'left';
                    else if (e.pageY < offset.top + height / 2)
                        position = 'top';
                    else
                        position = 'bottom';

                    let target = rnJQuery(list[i]);
                    if (target.hasClass('last'))
                        position = 'top';

                    let subTarget = null;
                    let subTargetPosition = null;

                    if (target.hasClass('sfFieldWithFields')) {
                        for (let t = i + 1; t < list.length; t++) {
                            currentElement = rnJQuery(list[t]);
                            offset = currentElement.offset();
                            width = currentElement.outerWidth(true);
                            height = currentElement.outerHeight(true);
                            if (e.pageY > offset.top && e.pageX > offset.left && e.pageY < offset.top + height && e.pageX < offset.left + width) {
                                let sideWidth = width * .1;
                                if (e.pageX > offset.left + width - sideWidth)
                                    subTargetPosition = 'right';
                                else if (e.pageX < offset.left + sideWidth)
                                    subTargetPosition = 'left';
                                else if (e.pageY < offset.top + height / 2)
                                    subTargetPosition = 'top';
                                else
                                    subTargetPosition = 'bottom';

                                subTarget = rnJQuery(list[t]);
                                if (target.hasClass('last'))
                                    subTargetPosition = 'top';
                            }
                        }
                    }
                    self.DragBehavior.HoverInElement(target, position, self.displayedDraggedElement, subTarget, subTargetPosition);
                    return;
                }

            }

            self.DragBehavior.HoverInAnything(rnJQuery(list[i]), self.displayedDraggedElement, e.pageX, e.pageY);
        };

        this.UnbindMoveFunction = function (e) {
            if (self.moveFunction != null) {
                rnJQuery("body").unbind('mousemove', self.moveFunction);
                rnJQuery("body").unbind('mouseup', self.UnbindMoveFunction);
                self.moveFunction = null;

            }

            if (self.displayedDraggedElement == null)
                self.DragBehavior.ElementClicked();
            else {
                self.displayedDraggedElement.remove();
                self.displayedDraggedElement = null;
                let list = rnJQuery("#redNaoElementlist .rednao-control-group,#redNaoElementlist .last,#redNaoSmartFormsPlaceHolder");
                for (let i = 0; i < list.length; i++) {
                    let currentElement = rnJQuery(list[i]);
                    let offset = currentElement.offset();
                    let width = currentElement.outerWidth(true);
                    let height = currentElement.outerHeight(true);
                    if (e.pageY > offset.top && e.pageX > offset.left && e.pageY < offset.top + height && e.pageX < offset.left + width) {
                        let position = "";
                        let sideWidth = width * .1;
                        if (e.pageX > offset.left + width - sideWidth)
                            position = 'right';
                        else if (e.pageX < offset.left + sideWidth)
                            position = 'left';
                        else if (e.pageY < offset.top + height / 2)
                            position = 'top';
                        else
                            position = 'bottom';


                        let target = rnJQuery(list[i]);
                        if (target.hasClass('last'))
                            position = 'top';

                        let subTarget = null;
                        let subTargetPosition = null;

                        if (target.hasClass('sfFieldWithFields')) {
                            for (let t = i + 1; t < list.length; t++) {
                                currentElement = rnJQuery(list[t]);
                                offset = currentElement.offset();
                                width = currentElement.outerWidth(true);
                                height = currentElement.outerHeight(true);
                                if (e.pageY > offset.top && e.pageX > offset.left && e.pageY < offset.top + height && e.pageX < offset.left + width) {
                                    let sideWidth = width * .1;
                                    if (e.pageX > offset.left + width - sideWidth)
                                        subTargetPosition = 'right';
                                    else if (e.pageX < offset.left + sideWidth)
                                        subTargetPosition = 'left';
                                    else if (e.pageY < offset.top + height / 2)
                                        subTargetPosition = 'top';
                                    else
                                        subTargetPosition = 'bottom';

                                    subTarget = rnJQuery(list[t]);
                                    if (target.hasClass('last'))
                                        subTargetPosition = 'top';
                                }
                            }
                        }


                        self.DragBehavior.DragDrop(target, position, subTarget, subTargetPosition);
                        RedNaoEventManager.Publish('FormDesignUpdated');
                        return;
                    }

                }

                self.DragBehavior.DragDrop(null, null,null,null);
            }
        };


        rnJQuery("body").mouseup(self.UnbindMoveFunction);
        rnJQuery("body").mousemove(self.moveFunction);


    };

    /*public SwitchFormElements(draggedElementSource, target) {
        if (target.hasClass('last')) {
            return;
        }
        var clonedSource = draggedElementSource.clone();
        var clonedTarget = target.clone();

        var sourceId = draggedElementSource.attr('id');
        var targetId = target.attr('id');
        var targetIndex = -1;
        var sourceIndex = -1;


        for (let i = 0; i < RedNaoFormElements.length; i++) {
            if (RedNaoFormElements[i].Id == targetId)
                targetIndex = i;

            if (RedNaoFormElements[i].Id == sourceId)
                sourceIndex = i;
        }


        if (sourceIndex >= 0 && targetIndex >= 0) {

            if (targetIndex > sourceIndex)
                targetIndex--;
            var aux = RedNaoFormElements[sourceIndex];

            RedNaoFormElements.splice(sourceIndex, 1);
            RedNaoFormElements.splice(targetIndex, 0, aux);



        }

    };*/
}

