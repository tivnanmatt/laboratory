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
    SmartFormsModules.animationSpeed = 300;
    var mod = SmartFormsModules;
    var ContainerManager = /** @class */ (function () {
        function ContainerManager() {
        }
        ContainerManager.GetFormDictionary = function (formId) {
            var item = SmartFormsModules.ContainerManager.ContainerDictionary[formId];
            if (item == null) {
                item = {
                    LastId: 0,
                    Containers: {}
                };
                mod.ContainerManager.ContainerDictionary[formId] = item;
            }
            return item;
        };
        ContainerManager.GetNextContainerId = function (formId) {
            return ++mod.ContainerManager.GetFormDictionary(formId).LastId;
        };
        ContainerManager.ClearContainer = function (formId) {
            SmartFormsModules.ContainerManager.ContainerDictionary[formId] = null;
        };
        ContainerManager.DeleteContainerOfField = function (field) {
            var dictionary = mod.ContainerManager.GetFormDictionary(field.GetFormId());
            var containerOptions = field.Options.ContainerOptions;
            if (typeof dictionary.Containers[containerOptions.Id] != 'undefined')
                delete dictionary.Containers[containerOptions.Id];
        };
        ContainerManager.CreateOrUpdateContainer = function (field) {
            var dictionary = mod.ContainerManager.GetFormDictionary(field.GetFormId());
            var containerOptions = field.Options.ContainerOptions;
            var id = containerOptions.Id;
            if (containerOptions.Id == '0') {
                id = (++dictionary.LastId).toString();
                containerOptions.Id = id;
            }
            else {
                var id_1 = parseInt(containerOptions.Id);
                if (id_1 > dictionary.LastId)
                    dictionary.LastId = id_1;
            }
            var container = dictionary.Containers[id];
            if (container == null) {
                container = mod.ContainerManager.CreateContainer(field);
                dictionary.Containers[id] = container;
            }
            container.IncludeField(field);
            return container;
        };
        ContainerManager.CreateContainer = function (field) {
            if (field.Options.ContainerOptions.Type == "single") {
                if (typeof smartFormsDesignMode != 'undefined' && smartFormsDesignMode)
                    return new SmartFormsModules.ContainerBaseDesigner(new ContainerBase());
                return new ContainerBase();
            }
            if (typeof smartFormsDesignMode != 'undefined' && smartFormsDesignMode)
                return new SmartFormsModules.MultipleElementsContainerDesigner(new MultipleElementsContainer());
            return new MultipleElementsContainer();
        };
        ContainerManager.ContainerDictionary = {};
        return ContainerManager;
    }());
    SmartFormsModules.ContainerManager = ContainerManager;
    /*---------------------------------------------------------------------------------------------------------------------------------------------------*/
    var Container = /** @class */ (function () {
        function Container() {
        }
        return Container;
    }());
    SmartFormsModules.Container = Container;
    var ContainerBase = /** @class */ (function (_super) {
        __extends(ContainerBase, _super);
        function ContainerBase() {
            var _this = _super.call(this) || this;
            _this.ContainerAddedCallback = null;
            _this.fields = [];
            return _this;
        }
        Object.defineProperty(ContainerBase.prototype, "Options", {
            get: function () {
                return this.fields[0].Options.ContainerOptions;
            },
            enumerable: true,
            configurable: true
        });
        ContainerBase.prototype.GetContainerId = function () {
            return this.Options.Id;
        };
        ContainerBase.prototype.IncludeField = function (field) {
            this.fields.push(field);
        };
        ContainerBase.prototype.AppendJQueryElementToUI = function (elementToAdd, jQueryContainer, animate) {
            if (elementToAdd.FieldContainer != null && !jQueryContainer.hasClass('fieldContainerOfFields'))
                return elementToAdd.JQueryElement;
            this.$container = rnJQuery('<div class="' + this.fields[0].GetElementClasses() + '" id="' + this.fields[0].Id + '">' + this.fields[0].GenerateInlineElement() + '</div>');
            jQueryContainer.append(this.$container);
            if (this.ContainerAddedCallback != null)
                this.ContainerAddedCallback();
            if (elementToAdd.IsFieldContainer && (!elementToAdd.HandleFieldsInternally || smartFormsDesignMode)) //at runtime the fields are handled manually by the field
                for (var _i = 0, _a = elementToAdd.Fields; _i < _a.length; _i++) {
                    var field = _a[_i];
                    field.AppendElementToContainer(this.$container.find('.fieldContainerOfFields'), animate);
                }
            return this.$container;
        };
        ContainerBase.prototype.GetJQueryContent = function () {
            var $element = rnJQuery('<div class="' + this.fields[0].GetElementClasses() + '" id="' + this.fields[0].Id + '" >' + this.fields[0].GenerateInlineElement() + '</div>');
            if (this.fields[0].IsFieldContainer) {
                for (var _i = 0, _a = this.fields[0].Fields; _i < _a.length; _i++) {
                    var field = _a[_i];
                    field.JQueryElement = field.GetContainer().AppendJQueryElementToUI(field, $element.find('.fieldContainerOfFields'), true);
                    /*var $childElement:JQuery=rnJQuery('<div class="'+field.GetElementClasses()+'" id="'+field.Id+'" >'+field.GenerateInlineElement()+'</div>');

                    $element.find('.fieldContainerOfFields').append($childElement);
                    field.JQueryElement=$childElement;*/
                }
            }
            this.fields[0].JQueryElement = $element;
            return $element;
        };
        ContainerBase.prototype.ReplaceWithJQueryElement = function (jQueryContainer, animate) {
            var _this = this;
            this.$container = this.GetJQueryContent();
            if (animate) {
                this.$container.addClass('rnTemporalHidden');
                jQueryContainer.replaceWith(this.$container);
                var height = this.$container.height();
                var width = this.$container.parent().width();
                this.$container.width(0);
                this.$container.height(0);
                this.$container.removeClass('rnTemporalHidden');
                this.$container.css('overflow', 'hidden');
                this.$container.velocity({ 'width': width, 'height': height }, SmartFormsModules.animationSpeed, "easeInExp", function () {
                    _this.$container.removeAttr('style');
                });
            }
            else {
                jQueryContainer.replaceWith(this.$container);
            }
            if (this.ContainerAddedCallback != null)
                this.ContainerAddedCallback();
            return this.$container;
        };
        ContainerBase.prototype.GetWidth = function (field) {
        };
        return ContainerBase;
    }(Container));
    SmartFormsModules.ContainerBase = ContainerBase;
    /*---------------------------------------------------------------------------------------------------------------------------------------------------*/
    var MultipleElementsContainer = /** @class */ (function (_super) {
        __extends(MultipleElementsContainer, _super);
        function MultipleElementsContainer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MultipleElementsContainer.prototype.GetJQueryContent = function () {
            var $content = rnJQuery('<div class="row sfContainer col-sm-12"></div>');
            for (var _i = 0, _a = this.fields; _i < _a.length; _i++) {
                var field = _a[_i];
                var $element = this.GenerateItemContent(field);
                $content.append($element);
            }
            return $content;
        };
        MultipleElementsContainer.prototype.AppendJQueryElementToUI = function (elementToAdd, jQueryContainer, animate) {
            if (elementToAdd.FieldContainer != null && !jQueryContainer.hasClass('fieldContainerOfFields'))
                return elementToAdd.JQueryElement;
            if (elementToAdd == this.fields[0]) {
                this.$container = rnJQuery('<div class="row sfContainer col-sm-12"></div>');
                jQueryContainer.append(this.$container);
                if (this.ContainerAddedCallback != null)
                    this.ContainerAddedCallback();
            }
            var $element = this.GenerateItemContent(elementToAdd);
            this.$container.append($element);
            return $element;
        };
        MultipleElementsContainer.prototype.GenerateItemContent = function (field) {
            var $element = rnJQuery('<div class="' + field.GetElementClasses() + '" id="' + field.Id + '" >' + field.GenerateInlineElement() + '</div>');
            if (field.IsFieldContainer) {
                for (var _i = 0, _a = field.Fields; _i < _a.length; _i++) {
                    var childField = _a[_i];
                    //childField.JQueryElement=childField.GetContainer().AppendJQueryElementToUI(childField,$element.find('.fieldContainerOfFields'),true);
                    childField.AppendElementToContainer($element.find('.fieldContainerOfFields'), true);
                }
            }
            field.JQueryElement = $element;
            return $element;
        };
        return MultipleElementsContainer;
    }(ContainerBase));
    SmartFormsModules.MultipleElementsContainer = MultipleElementsContainer;
})(SmartFormsModules || (SmartFormsModules = {}));
//# sourceMappingURL=Container.js.map