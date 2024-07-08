var SmartFormsModules;
(function (SmartFormsModules) {
    var ContainerResizer = /** @class */ (function () {
        function ContainerResizer(designer) {
            var _this = this;
            this.designer = designer;
            this.RESIZER_AREA = 15;
            this.MINIMUN_WIDTH = 5;
            this.designer.Container.ContainerAddedCallback = function () { _this.InitializeResizer(); };
        }
        Object.defineProperty(ContainerResizer.prototype, "Fields", {
            get: function () {
                return this.designer.Container.fields;
            },
            enumerable: true,
            configurable: true
        });
        ContainerResizer.prototype.InitializeResizer = function () {
            var _this = this;
            this.designer.Container.$container.mousemove(function (e) {
                _this.OnMouseMove(e);
            });
            this.designer.Container.$container.mouseleave(function () {
                _this.ClearResizer();
            });
        };
        ContainerResizer.prototype.OnMouseMove = function (e) {
            if (this.FieldDragging)
                this.DragMove(e);
            var fieldDraggedTo = this.GetElementDraggedTo(e);
            if (fieldDraggedTo == null || !this.IsInResizerArea(fieldDraggedTo, e)) {
                //console.log(this.Fields);
                this.ClearResizer();
                return;
            }
            this.ShowResizeCursor(fieldDraggedTo);
        };
        ContainerResizer.prototype.GetElementDraggedTo = function (e) {
            for (var _i = 0, _a = this.Fields; _i < _a.length; _i++) {
                var field = _a[_i];
                var offset = field.JQueryElement.offset();
                if (e.pageX > offset.left && e.pageX < offset.left + field.JQueryElement.outerWidth() && e.pageY > offset.top && e.pageY < offset.top + field.JQueryElement.outerHeight())
                    return field;
            }
            return null;
        };
        ContainerResizer.prototype.IsInResizerArea = function (fieldDraggedTo, e) {
            return fieldDraggedTo != this.Fields[0] && e.pageX < fieldDraggedTo.JQueryElement.offset().left + this.RESIZER_AREA;
        };
        ContainerResizer.prototype.ShowResizeCursor = function (fieldDraggedTo) {
            var _this = this;
            SmartFormsAddNewVar.FormBuilder.DragManager.IsResizing = true;
            //console.log(this.Fields);
            //console.log('start resizing');
            if (this.$fieldDisplayingResizer != null) {
                if (this.$fieldDisplayingResizer == fieldDraggedTo.JQueryElement)
                    return;
                else
                    this.ClearResizer();
            }
            this.$LastBindedElement = fieldDraggedTo.JQueryElement;
            fieldDraggedTo.JQueryElement.css('cursor', 'ew-resize');
            fieldDraggedTo.JQueryElement.bind('mousedown.sfresizer', function (e) {
                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();
                _this.StartDrag(fieldDraggedTo, e);
            });
            rnJQuery(document).bind('mouseup.sfresizer', function (e) {
                _this.EndDrag();
                fieldDraggedTo.JQueryElement.unbind('mousedown.sfresizer');
                rnJQuery(document).unbind('mouseup.sfresizer');
            });
            this.$fieldDisplayingResizer = fieldDraggedTo.JQueryElement;
        };
        ContainerResizer.prototype.ClearResizer = function () {
            if (this.$LastBindedElement != null) {
                this.$LastBindedElement.unbind('mousedown.sfresizer');
                this.$LastBindedElement = null;
            }
            SmartFormsAddNewVar.FormBuilder.DragManager.IsResizing = false;
            //console.log('clear resizing');
            if (this.$fieldDisplayingResizer != null) {
                this.$fieldDisplayingResizer.removeAttr('style');
                this.$fieldDisplayingResizer = null;
            }
        };
        ContainerResizer.prototype.StartDrag = function (fieldDraggedTo, e) {
            this.FieldDragging = true;
            this.OriginalX = e.pageX;
            this.RightField = fieldDraggedTo;
            for (var i = 0; i < this.Fields.length; i++)
                if (this.Fields[i] == fieldDraggedTo)
                    this.LeftField = this.Fields[i - 1];
            this.OriginalLeftWidth = this.LeftField.Options.ContainerOptions.Width;
            this.OriginalRightWidth = this.RightField.Options.ContainerOptions.Width;
            this.ContainerWidth = this.designer.Container.$container.width();
        };
        ContainerResizer.prototype.DragMove = function (e) {
            var delta = e.pageX - this.OriginalX;
            var deltaPercentage = Math.floor(delta * 100 / this.ContainerWidth);
            if (deltaPercentage == 0)
                return;
            if (delta > 0)
                this.AdjustSize(this.LeftField, this.OriginalLeftWidth, this.RightField, this.OriginalRightWidth, deltaPercentage);
            else
                this.AdjustSize(this.RightField, this.OriginalRightWidth, this.LeftField, this.OriginalLeftWidth, deltaPercentage * -1);
            //console.log(deltaPercentage);
        };
        ContainerResizer.prototype.AdjustSize = function (fieldToIncrease, fieldToIncreaseOriginalWidth, fieldToDecrease, fieldToDecreaseOriginalWidth, changeAmount) {
            var maxAllowedChange = fieldToDecreaseOriginalWidth - 5;
            //console.log('field width:'+fieldToDecrease.Options.ContainerOptions.Width);
            //console.log('maxAllowedChange:'+maxAllowedChange);
            changeAmount = Math.min(maxAllowedChange, changeAmount);
            //console.log('change amount:'+changeAmount);
            this.ChangeSize(fieldToIncrease, changeAmount, fieldToIncreaseOriginalWidth);
            this.ChangeSize(fieldToDecrease, changeAmount * -1, fieldToDecreaseOriginalWidth);
        };
        ContainerResizer.prototype.EndDrag = function () {
            this.FieldDragging = false;
        };
        ContainerResizer.prototype.ChangeSize = function (field, changeAmount, originalWidth) {
            var lastWidth = field.Options.ContainerOptions.Width;
            if (changeAmount == 0 || lastWidth == originalWidth + changeAmount)
                return;
            field.Options.ContainerOptions.Width = originalWidth + changeAmount;
            //console.log('sfFieldWidth'+field.Options.ContainerOptions.Width);
            field.JQueryElement.addClass('sfFieldWidth' + field.Options.ContainerOptions.Width);
            field.JQueryElement.removeClass('sfFieldWidth' + lastWidth);
        };
        ContainerResizer.ResizerThatStarted = null;
        return ContainerResizer;
    }());
    SmartFormsModules.ContainerResizer = ContainerResizer;
})(SmartFormsModules || (SmartFormsModules = {}));
//# sourceMappingURL=ContainerResizer.js.map