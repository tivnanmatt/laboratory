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
var SmartFormsModules;
(function (SmartFormsModules) {
    var ContainerBaseDesigner = /** @class */ (function (_super) {
        __extends(ContainerBaseDesigner, _super);
        function ContainerBaseDesigner(Container) {
            var _this = _super.call(this) || this;
            _this.Container = Container;
            return _this;
        }
        ContainerBaseDesigner.prototype.IncludeField = function (field) {
            this.Container.IncludeField(field);
        };
        Object.defineProperty(ContainerBaseDesigner.prototype, "Options", {
            get: function () {
                return this.Container.Options;
            },
            enumerable: true,
            configurable: true
        });
        ContainerBaseDesigner.prototype.AppendJQueryElementToUI = function (elementToAdd, jQueryContainer, animate) {
            return this.Container.AppendJQueryElementToUI(elementToAdd, jQueryContainer, animate);
        };
        ContainerBaseDesigner.prototype.ReplaceWithJQueryElement = function (jQueryContainer, animate) {
            return this.Container.ReplaceWithJQueryElement(jQueryContainer, animate);
        };
        ContainerBaseDesigner.prototype.RemoveField = function (field, animate, keepSize) {
            if (keepSize === void 0) { keepSize = false; }
            field.JQueryElement.css('overflow', 'hidden');
            var element = field.JQueryElement;
            element.addClass('removingField');
            if (field.FieldContainer == null || !field.FieldContainer.HandleFieldsInternally)
                SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.splice(SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.indexOf(field), 1);
            if (field.FieldContainer != null)
                field.FieldContainer.RemoveField(field);
            if (field.IsFieldContainer && !field.HandleFieldsInternally)
                for (var _i = 0, _a = field.Fields; _i < _a.length; _i++) {
                    var childField = _a[_i];
                    SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.splice(SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.indexOf(childField), 1);
                }
            if (animate)
                element.velocity({ width: 0, height: 0 }, SmartFormsModules.animationSpeed, "easeOutExp", function () { element.remove(); });
            else
                element.remove();
        };
        ContainerBaseDesigner.prototype.GetLastField = function () {
            return this.Container.fields[this.Container.fields.length - 1];
        };
        ContainerBaseDesigner.prototype.InitializeFieldInDesigner = function (field, regenerateElement) {
            if (regenerateElement === void 0) { regenerateElement = true; }
            SmartFormsAddNewVar.FormBuilder.DragManager.MakeItemDraggable(field.JQueryElement);
            if (field.IsFieldContainer)
                for (var _i = 0, _a = field.Fields; _i < _a.length; _i++) {
                    var childField = _a[_i];
                    this.InitializeFieldInDesigner(childField, regenerateElement);
                }
            if (regenerateElement)
                field.GenerationCompleted(field.JQueryElement);
            field.ApplyAllStyles();
        };
        ContainerBaseDesigner.prototype.MoveField = function (targetField, fieldToInsert, position, animate) {
            fieldToInsert.GetContainer().RemoveField(fieldToInsert, true);
            targetField.GetContainer().InsertField(targetField, fieldToInsert, position, animate);
        };
        ContainerBaseDesigner.prototype.InsertField = function (targetField, fieldToInsert, position, animate, keepSize) {
            if (keepSize === void 0) { keepSize = false; }
            if (position == 'top' || position == "bottom") {
                this.SwitchContainer(fieldToInsert, { Width: -1, Id: '0', Type: "single" });
                var container = rnJQuery('<div></div>');
                if (fieldToInsert.JQueryElement != null)
                    container.data('step-id', fieldToInsert.JQueryElement.data('step-id'));
                var indexOfTarget = 0;
                for (var i = 0; i < SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.length; i++) {
                    if (SmartFormsAddNewVar.FormBuilder.RedNaoFormElements[i] == targetField) {
                        indexOfTarget = i;
                        if (targetField.IsFieldContainer && position == 'bottom')
                            indexOfTarget += targetField.Fields.length;
                    }
                }
                if (position == "top") {
                    if (targetField == null) {
                        var $element = void 0;
                        if (SmartFormsAddNewVar.FormBuilder.FormType == 'sec')
                            $element = rnJQuery('.step-pane.active .formelement.last');
                        else
                            $element = rnJQuery('.formelement.last');
                        container.insertBefore($element);
                        indexOfTarget = SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.length;
                    }
                    else {
                        if (targetField.IsFieldContainer && targetField.JQueryElement.find('.fieldContainerOfFields').hasClass('fieldEdition')) {
                            targetField.JQueryElement.find('.fieldContainerOfFields').prepend(container);
                            targetField.AddField(fieldToInsert, 0);
                        }
                        else {
                            container.insertBefore(targetField.GetContainer().Container.$container);
                            if (targetField.FieldContainer != null)
                                targetField.FieldContainer.AddField(fieldToInsert, targetField.FieldContainer.Fields.indexOf(targetField));
                        }
                    }
                }
                else {
                    indexOfTarget++;
                    if (targetField.IsFieldContainer && targetField.JQueryElement.find('.fieldContainerOfFields').hasClass('fieldEdition')) {
                        targetField.JQueryElement.find('.fieldContainerOfFields').append(container);
                        targetField.AddField(fieldToInsert, targetField.Fields.length);
                    }
                    else {
                        container.insertAfter(targetField.GetContainer().Container.$container);
                        if (targetField.FieldContainer != null)
                            targetField.FieldContainer.AddField(fieldToInsert, targetField.FieldContainer.Fields.indexOf(targetField) + 1);
                    }
                }
                fieldToInsert.GenerateHtml(container, true);
                if (targetField == null)
                    RedNaoEventManager.Publish('ElementInserted', { Field: fieldToInsert, Target: targetField, Position: position });
                else
                    RedNaoEventManager.Publish('ElementMoved', { Field: fieldToInsert, Target: targetField, Position: position });
                if (!this.InsertingToAnInternalFieldHandler(targetField))
                    SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.splice(indexOfTarget, 0, fieldToInsert);
                if (fieldToInsert.IsFieldContainer && !fieldToInsert.HandleFieldsInternally)
                    for (var i = 0; i < fieldToInsert.Fields.length; i++)
                        SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.splice(indexOfTarget + i + 1, 0, fieldToInsert.Fields[i]);
                fieldToInsert.Options.ContainerOptions.Type = "single";
                this.InitializeFieldInDesigner(fieldToInsert, false);
            }
            if (position == 'left' || position == "right") {
                //targetField.Options.ContainerOptions.Type="multiple";
                //targetField.Options.ContainerOptions.Width=100;
                //var Container:ContainerBase=SmartFormsModules.ContainerManager.CreateContainer(targetField);
                var newContainer = this.SwitchContainer(targetField, { Id: '0', Width: 100, Type: "multiple" });
                newContainer.Refresh();
                newContainer.InsertField(targetField, fieldToInsert, position, animate);
                //Container.IncludeField(this.fields[0]);
                //Container.$container=this.$container;
                //Container.Refresh();
                //Container.InsertField(targetField,fieldToInsert,position,animate);
                //return targetField.GetContainer().fields;
            }
        };
        ContainerBaseDesigner.prototype.Refresh = function () {
            this.ReplaceWithJQueryElement(this.Container.$container, false);
            for (var _i = 0, _a = this.Container.fields; _i < _a.length; _i++) {
                var field = _a[_i];
                this.InitializeFieldInDesigner(field, true);
            }
        };
        ContainerBaseDesigner.prototype.SwitchContainer = function (field, options) {
            var $oldContainerUI = field.GetContainer().Container.$container;
            field.Options.ContainerOptions = options;
            var container = SmartFormsModules.ContainerManager.CreateOrUpdateContainer(field);
            container.Container.$container = $oldContainerUI;
            field.SetContainer(container);
            return container;
        };
        ContainerBaseDesigner.prototype.InsertingToAnInternalFieldHandler = function (targetField) {
            if (targetField == null)
                return false;
            if (targetField.HandleFieldsInternally && targetField.JQueryElement.find('.fieldContainerOfFields').hasClass('fieldEdition'))
                return true;
            if (targetField.FieldContainer != null && targetField.FieldContainer.HandleFieldsInternally)
                return true;
            return false;
        };
        return ContainerBaseDesigner;
    }(SmartFormsModules.Container));
    SmartFormsModules.ContainerBaseDesigner = ContainerBaseDesigner;
    var MultipleElementsContainerDesigner = /** @class */ (function (_super) {
        __extends(MultipleElementsContainerDesigner, _super);
        function MultipleElementsContainerDesigner(Container) {
            var _this = _super.call(this, Container) || this;
            _this.Container = Container;
            _this.resizer = new SmartFormsModules.ContainerResizer(_this);
            return _this;
        }
        MultipleElementsContainerDesigner.prototype.MoveField = function (targetField, fieldToInsert, position, animate) {
            if (fieldToInsert == targetField)
                if (position == "top" || position == "bottom") {
                    for (var _i = 0, _a = this.Container.fields; _i < _a.length; _i++) {
                        var field = _a[_i];
                        if (targetField != field) {
                            targetField = field;
                            break;
                        }
                    }
                }
                else {
                    targetField.JQueryElement.css('opacity', 1);
                    return;
                }
            var movingInSameArea = false;
            if (targetField != null && targetField.GetContainer() == fieldToInsert.GetContainer() && (position == 'left' || position == 'right')) {
                movingInSameArea = true;
            }
            fieldToInsert.GetContainer().RemoveField(fieldToInsert, true, movingInSameArea);
            targetField.GetContainer().InsertField(targetField, fieldToInsert, position, animate, movingInSameArea);
        };
        MultipleElementsContainerDesigner.prototype.RemoveField = function (field, animate, keepSize) {
            if (keepSize === void 0) { keepSize = false; }
            _super.prototype.RemoveField.call(this, field, animate, keepSize);
            this.Container.fields.splice(this.Container.fields.indexOf(field), 1);
            if (keepSize)
                return;
            var widthToDistribute = Math.floor(field.Options.ContainerOptions.Width / (this.Container.fields.length));
            field.Options.ContainerOptions.Width = -1;
            var containerWidth = this.Container.$container.width();
            if (this.Container.fields.length == 1) {
                var container = this.SwitchContainer(this.Container.fields[0], { Id: '0', Width: -1, Type: "single" });
                field.SetContainer(container);
                this.Container.fields[0].JQueryElement.velocity({ width: containerWidth }, SmartFormsModules.animationSpeed, "easeOutExp", function () {
                    container.Refresh();
                });
                return;
            }
            var widthInLastField = 0;
            var totalUsedWidth = 0;
            for (var _i = 0, _a = this.Container.fields; _i < _a.length; _i++) {
                var field_1 = _a[_i];
                totalUsedWidth += field_1.Options.ContainerOptions.Width;
            }
            var totalWidthThatIsGoingToBeused = totalUsedWidth + widthToDistribute * this.Container.fields.length;
            if (totalWidthThatIsGoingToBeused < 100) {
                widthToDistribute += Math.floor((100 - totalWidthThatIsGoingToBeused) / this.Container.fields.length);
                widthInLastField = Math.max(0, 100 - (widthToDistribute * this.Container.fields.length + totalUsedWidth));
            }
            var _loop_1 = function (field_2) {
                var oldWidth = 'sfFieldWidth' + field_2.Options.ContainerOptions.Width;
                var newWidth = widthToDistribute + (field_2 == this_1.Container.fields[this_1.Container.fields.length - 1] ? widthInLastField : 0) + field_2.Options.ContainerOptions.Width;
                var containerWidth_1 = this_1.Container.$container.width();
                field_2.JQueryElement.velocity({ width: containerWidth_1 * newWidth / 100 }, SmartFormsModules.animationSpeed, "easeOutExp", function (element) {
                    field_2.JQueryElement.addClass('sfFieldWidth' + newWidth);
                    field_2.JQueryElement.removeClass(oldWidth);
                    field_2.JQueryElement.removeAttr('style');
                });
                field_2.Options.ContainerOptions.Width = newWidth;
            };
            var this_1 = this;
            for (var _b = 0, _c = this.Container.fields; _b < _c.length; _b++) {
                var field_2 = _c[_b];
                _loop_1(field_2);
            }
        };
        MultipleElementsContainerDesigner.prototype.InsertField = function (targetField, fieldToInsert, position, animate, keepSize) {
            var _this = this;
            if (keepSize === void 0) { keepSize = false; }
            if (position == 'top' || position == "bottom") {
                var container = this.SwitchContainer(fieldToInsert, { Id: '0', Width: -1, Type: "single" });
                if (!targetField.IsFieldContainer || !targetField.JQueryElement.find('.fieldContainerOfFields').hasClass('fieldEdition')) {
                    if (position == 'top')
                        targetField = this.Container.fields[0];
                    else
                        targetField = this.Container.fields[this.Container.fields.length - 1];
                }
                container.InsertField(targetField, fieldToInsert, position, animate, keepSize);
                return;
            }
            if (position == 'left' || position == "right") {
                if (typeof targetField.Options.StepId != 'undefined')
                    fieldToInsert.Options.StepId = targetField.Options.StepId;
                fieldToInsert.SetContainer(this);
                var index = 0;
                for (var i = 0; i < this.Container.fields.length; i++) {
                    if (this.Container.fields[i] == targetField)
                        index = i;
                }
                var indexOfTarget = 0;
                for (var i = 0; i < SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.length; i++) {
                    if (SmartFormsAddNewVar.FormBuilder.RedNaoFormElements[i] == targetField)
                        indexOfTarget = i;
                    if (targetField.IsFieldContainer && position == "right")
                        indexOfTarget += targetField.Fields.length;
                }
                if (position == "right") {
                    index++;
                    indexOfTarget++;
                }
                this.Container.fields.splice(index, 0, fieldToInsert);
                if (!this.InsertingToAnInternalFieldHandler(targetField))
                    SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.splice(indexOfTarget, 0, fieldToInsert);
                if (fieldToInsert.IsFieldContainer && !fieldToInsert.HandleFieldsInternally)
                    for (var i = 0; i < fieldToInsert.Fields.length; i++) {
                        SmartFormsAddNewVar.FormBuilder.RedNaoFormElements.splice(indexOfTarget + i + 1, 0, fieldToInsert.Fields[i]);
                        //this.Container.fields.splice(index+1+i,0,fieldToInsert.Fields[i]);
                    }
                var fieldsResized = [];
                var totalUsedWidth = 0;
                var containerWidth = this.Container.$container.width();
                if (!keepSize) {
                    for (var _i = 0, _a = this.Container.fields; _i < _a.length; _i++) {
                        var field = _a[_i];
                        if (field == fieldToInsert) {
                            var width = Math.floor(100 * (1 / this.Container.fields.length));
                            totalUsedWidth += width;
                            field.Options.ContainerOptions.Width = width;
                        }
                        else {
                            var oldWidth = 'sfFieldWidth' + field.Options.ContainerOptions.Width;
                            var newWidth = Math.floor(field.Options.ContainerOptions.Width - field.Options.ContainerOptions.Width / this.Container.fields.length);
                            totalUsedWidth += newWidth;
                            fieldsResized.push({ 'Field': field, 'Width': newWidth });
                        }
                    }
                    var extraWidth = Math.floor((100 - totalUsedWidth) / fieldsResized.length);
                    if (totalUsedWidth + (extraWidth * fieldsResized.length) < 100) {
                        fieldToInsert.Options.ContainerOptions.Width += 100 - totalUsedWidth + extraWidth;
                    }
                    var _loop_2 = function (iteration) {
                        var field = iteration.Field;
                        var oldWidth_1 = 'sfFieldWidth' + field.Options.ContainerOptions.Width;
                        field.Options.ContainerOptions.Width = iteration.Width + extraWidth;
                        field.JQueryElement.velocity({ width: Math.floor((containerWidth - 1) * field.Options.ContainerOptions.Width / 100) }, SmartFormsModules.animationSpeed, "easeOutExp", function (element) {
                            field.JQueryElement.addClass('sfFieldWidth' + field.Options.ContainerOptions.Width);
                            field.JQueryElement.removeClass(oldWidth_1);
                            field.JQueryElement.removeAttr('style');
                        });
                    };
                    for (var _b = 0, fieldsResized_1 = fieldsResized; _b < fieldsResized_1.length; _b++) {
                        var iteration = fieldsResized_1[_b];
                        _loop_2(iteration);
                    }
                }
                var $jQueryToInsert_1 = this.Container.GenerateItemContent(fieldToInsert);
                $jQueryToInsert_1.css('width', 0);
                $jQueryToInsert_1.css('overflow', 'hidden');
                if (targetField.IsFieldContainer && targetField.JQueryElement.find('.fieldContainerOfFields').hasClass('fieldEdition')) {
                    targetField.JQueryElement.find('.fieldContainerOfFields').prepend($jQueryToInsert_1);
                    targetField.AddField(fieldToInsert, 0);
                }
                else {
                    if (targetField.FieldContainer != null)
                        if (position == 'left')
                            targetField.FieldContainer.AddField(fieldToInsert, targetField.FieldContainer.Fields.indexOf(targetField));
                        else
                            targetField.FieldContainer.AddField(fieldToInsert, targetField.FieldContainer.Fields.indexOf(targetField) + 1);
                    if (position == 'left')
                        $jQueryToInsert_1.insertBefore(targetField.JQueryElement);
                    else
                        $jQueryToInsert_1.insertAfter(targetField.JQueryElement);
                }
                $jQueryToInsert_1.velocity({ width: Math.floor(containerWidth * fieldToInsert.Options.ContainerOptions.Width / 100) }, SmartFormsModules.animationSpeed, "easeOutExp", function (element) {
                    $jQueryToInsert_1.removeClass(oldWidth);
                    $jQueryToInsert_1.removeAttr('style');
                    _this.InitializeFieldInDesigner(fieldToInsert, true);
                    RedNaoEventManager.Publish('ElementMoved', { Field: fieldToInsert, Target: targetField, Position: position });
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
        };
        return MultipleElementsContainerDesigner;
    }(ContainerBaseDesigner));
    SmartFormsModules.MultipleElementsContainerDesigner = MultipleElementsContainerDesigner;
})(SmartFormsModules || (SmartFormsModules = {}));
//# sourceMappingURL=ContainerDesigner.js.map