"use strict";
var RedNaoDragManager = /** @class */ (function () {
    function RedNaoDragManager(formBuilder) {
        this.FormBuilder = formBuilder;
        this.moveFunction = null;
        this.IsResizing = false;
    }
    RedNaoDragManager.prototype.MakeFieldsCatalogDraggable = function () {
        var items = rnJQuery(".rednaoformbuilder .component");
        for (var i = 0; i < items.length; i++) {
            if (!RedNaoSmartFormLicenseIsValid && rnJQuery(items[i]).parents('.smartFormFieldTabPro').length > 0)
                continue;
            this.MakeItemDraggable(rnJQuery(items[i]));
        }
    };
    ;
    RedNaoDragManager.prototype.MakeAlreadySelectedElementsDraggable = function () {
        var items = rnJQuery("#redNaoElementlist .rednao-control-group");
        for (var i = 0; i < items.length; i++) {
            this.MakeItemDraggable(rnJQuery(items[i]));
        }
    };
    ;
    RedNaoDragManager.prototype.MakeItemDraggable = function (jQueryElement) {
        var self = this;
        jQueryElement.mousedown(function (e) {
            self.SmartDonationsFormMouseDownFired(e, rnJQuery(this));
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
    ;
    RedNaoDragManager.prototype.SmartDonationsFormMouseDownFired = function (e, draggedElement) {
        if (e.which != 1 || this.IsResizing)
            return;
        var focused = rnJQuery(':focus');
        if (focused.length > 0) {
            if (focused.closest('#smartFormPropertiesContainer').length > 0) {
                focused.blur();
            }
        }
        e.stopPropagation();
        e.preventDefault();
        if (typeof this.FormBuilder == 'undefined') //formbuilder is undefined when called from the style editor
            return;
        if (this.FormBuilder.FormBuilderDisabled)
            return;
        var draggedItemDisplayed = false;
        if (rnJQuery(this).hasClass('last'))
            return;
        var classOrigin = "";
        if (draggedElement.closest('.formelements').length > 0 || draggedElement.closest('.step-pane').length > 0) //step-pane for splitted forms;
            this.DragBehavior = new DragItemBehaviorExistingElement(this.FormBuilder, draggedElement);
        else
            this.DragBehavior = new DragItemBehaviorNewElement(this.FormBuilder, draggedElement);
        var self = this;
        /*  this.DragBehavior.ElementAdded = function (newElementJQuery) {
              self.MakeItemDraggable(newElementJQuery);
          };*/
        var offset = draggedElement.offset();
        var pageX = e.pageX;
        var pageY = e.pageY;
        var deltaX = pageX - offset.left;
        var deltaY = pageY - offset.top;
        // this.UnbindMovefunction();
        this.moveFunction = function (e) {
            if (e.pageX > pageX - 10 && e.pageX < pageX + 10 && e.pageY > pageY - 10 && e.pageY < pageY + 10)
                return;
            if (!draggedItemDisplayed) {
                self.displayedDraggedElement = self.DragBehavior.DisplayDraggedItem(classOrigin);
                draggedItemDisplayed = true;
                self.MakeItemDraggable(self.displayedDraggedElement);
            }
            self.displayedDraggedElement.offset({ top: e.pageY - deltaY, left: e.pageX - deltaX });
            var list = rnJQuery("#redNaoElementlist .rednao-control-group,#redNaoElementlist .last,#redNaoSmartFormsPlaceHolder");
            var i;
            for (i = 0; i < list.length; i++) {
                var currentElement = rnJQuery(list[i]);
                var offset_1 = currentElement.offset();
                var width = currentElement.outerWidth(true);
                var height = currentElement.outerHeight(true);
                if (e.pageY > offset_1.top && e.pageX > offset_1.left && e.pageY < offset_1.top + height && e.pageX < offset_1.left + width) {
                    var position = "";
                    var sideWidth = width * .1;
                    if (e.pageX > offset_1.left + width - sideWidth)
                        position = 'right';
                    else if (e.pageX < offset_1.left + sideWidth)
                        position = 'left';
                    else if (e.pageY < offset_1.top + height / 2)
                        position = 'top';
                    else
                        position = 'bottom';
                    var target = rnJQuery(list[i]);
                    if (target.hasClass('last'))
                        position = 'top';
                    var subTarget = null;
                    var subTargetPosition = null;
                    if (target.hasClass('sfFieldWithFields')) {
                        for (var t = i + 1; t < list.length; t++) {
                            currentElement = rnJQuery(list[t]);
                            offset_1 = currentElement.offset();
                            width = currentElement.outerWidth(true);
                            height = currentElement.outerHeight(true);
                            if (e.pageY > offset_1.top && e.pageX > offset_1.left && e.pageY < offset_1.top + height && e.pageX < offset_1.left + width) {
                                var sideWidth_1 = width * .1;
                                if (e.pageX > offset_1.left + width - sideWidth_1)
                                    subTargetPosition = 'right';
                                else if (e.pageX < offset_1.left + sideWidth_1)
                                    subTargetPosition = 'left';
                                else if (e.pageY < offset_1.top + height / 2)
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
                var list = rnJQuery("#redNaoElementlist .rednao-control-group,#redNaoElementlist .last,#redNaoSmartFormsPlaceHolder");
                for (var i = 0; i < list.length; i++) {
                    var currentElement = rnJQuery(list[i]);
                    var offset_2 = currentElement.offset();
                    var width = currentElement.outerWidth(true);
                    var height = currentElement.outerHeight(true);
                    if (e.pageY > offset_2.top && e.pageX > offset_2.left && e.pageY < offset_2.top + height && e.pageX < offset_2.left + width) {
                        var position = "";
                        var sideWidth = width * .1;
                        if (e.pageX > offset_2.left + width - sideWidth)
                            position = 'right';
                        else if (e.pageX < offset_2.left + sideWidth)
                            position = 'left';
                        else if (e.pageY < offset_2.top + height / 2)
                            position = 'top';
                        else
                            position = 'bottom';
                        var target = rnJQuery(list[i]);
                        if (target.hasClass('last'))
                            position = 'top';
                        var subTarget = null;
                        var subTargetPosition = null;
                        if (target.hasClass('sfFieldWithFields')) {
                            for (var t = i + 1; t < list.length; t++) {
                                currentElement = rnJQuery(list[t]);
                                offset_2 = currentElement.offset();
                                width = currentElement.outerWidth(true);
                                height = currentElement.outerHeight(true);
                                if (e.pageY > offset_2.top && e.pageX > offset_2.left && e.pageY < offset_2.top + height && e.pageX < offset_2.left + width) {
                                    var sideWidth_2 = width * .1;
                                    if (e.pageX > offset_2.left + width - sideWidth_2)
                                        subTargetPosition = 'right';
                                    else if (e.pageX < offset_2.left + sideWidth_2)
                                        subTargetPosition = 'left';
                                    else if (e.pageY < offset_2.top + height / 2)
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
                self.DragBehavior.DragDrop(null, null, null, null);
            }
        };
        rnJQuery("body").mouseup(self.UnbindMoveFunction);
        rnJQuery("body").mousemove(self.moveFunction);
    };
    ;
    return RedNaoDragManager;
}());
//# sourceMappingURL=dragmanager.js.map