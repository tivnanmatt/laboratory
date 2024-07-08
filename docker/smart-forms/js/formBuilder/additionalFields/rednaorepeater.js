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
var SmartFormsFields;
(function (SmartFormsFields) {
    var rednaorepeater = /** @class */ (function (_super) {
        __extends(rednaorepeater, _super);
        function rednaorepeater(options, serverOptions) {
            var _this = _super.call(this, options, serverOptions) || this;
            _this.latestRowId = 0;
            _this.AnimateInsertion = false;
            _this.IsFieldContainer = true;
            _this.DynamicItems = [];
            _this.IsDynamicField = true;
            _this.HandleFieldsInternally = true;
            if (_this.IsNew) {
                _this.Options.ClassName = 'rednaorepeater';
                _this.Options.Label = "Repeater";
                _this.Options.CustomCSS = '';
                _this.Options.NumberOfItems = 1;
                _this.Options.ManuallyAdd = 'y';
                _this.Options.IncludeItemNumberInLabels = 'y';
                _this.Options.FieldOptions = [];
            }
            RedNaoEventManager.Subscribe('formPropertyChanged', function (data) {
                for (var _i = 0, _a = _this.Options.FieldOptions; _i < _a.length; _i++) {
                    var option = _a[_i];
                    if (typeof data.Field.OriginalId == 'undefined')
                        return;
                    if (data.Field.OriginalId == option.Id) {
                        _this.FirePropertyChanged(option.Id);
                    }
                }
            });
            return _this;
        }
        rednaorepeater.prototype.GetValueString = function () {
            var rows = [];
            for (var _i = 0, _a = this.DynamicItems; _i < _a.length; _i++) {
                var row = _a[_i];
                var data = {};
                rows.push(data);
                for (var _b = 0, _c = row.Fields; _b < _c.length; _b++) {
                    var dynamicField = _c[_b];
                    if (dynamicField.StoresInformation())
                        data[dynamicField.Id] = dynamicField.GetValueString();
                }
            }
            return { value: rows };
        };
        rednaorepeater.prototype.InitializeField = function () {
            this.latestRowId = 0;
            this.AnimateInsertion = false;
            if (this.DynamicItems != null && this.DynamicItems.length > 0)
                for (var _i = 0, _a = this.DynamicItems; _i < _a.length; _i++) {
                    var row = _a[_i];
                    for (var _b = 0, _c = row.Fields; _b < _c.length; _b++) {
                        var field = _c[_b];
                        SmartFormsModules.ContainerManager.DeleteContainerOfField(field);
                    }
                }
            this.DynamicItems = [];
            this.Fields = [];
            if (this.JQueryElement != null)
                this.JQueryElement.find('.fieldContainerOfFields').empty();
        };
        rednaorepeater.prototype.GenerationCompleted = function ($element) {
            var _this = this;
            if (!smartFormsDesignMode) {
                this.JQueryElement.find('.repeaterAddButton').click(function (e) {
                    e.preventDefault();
                    _this.AddNewItem(true);
                });
            }
            var numberOfItems = this.Options.NumberOfItems;
            if (isNaN(parseInt(numberOfItems.toString())))
                return;
            if (smartFormsDesignMode)
                numberOfItems = 1;
            var currentAddedItemsCount = this.DynamicItems.length;
            var delta = numberOfItems - currentAddedItemsCount;
            if (delta > 0) {
                if (delta > 99)
                    delta = 99;
                for (var i = 0; i < delta; i++)
                    this.AddNewItem(this.AnimateInsertion);
            }
            if (delta < 0) {
                for (var i = 0; i > delta; i--)
                    this.RemoveItem(this.AnimateInsertion);
            }
            this.AnimateInsertion = true;
            this.RefreshRowNumbers();
            this.FirePropertyChanged();
        };
        rednaorepeater.prototype.RefreshElement = function (propertyName, previousValue) {
            var _this = this;
            this.JQueryElement.find('.rednao-control-group').each(function (fieldIndex, fieldElement) {
                var fieldId = rnJQuery(fieldElement).attr('id');
                var fieldOptions = _this.Options.FieldOptions.find(function (x) { return x.Id == fieldId; });
                if (fieldOptions == null)
                    return;
                rnJQuery(fieldElement).find('.rednao_label_container label').text(fieldOptions.Label);
            });
            return _super.prototype.RefreshElement.call(this, propertyName, previousValue);
        };
        rednaorepeater.prototype.SetData = function (data) {
            for (var i = 0; i < this.DynamicItems.length; i++)
                this.RemoveItem();
            var index = 0;
            for (var _i = 0, _a = data.value; _i < _a.length; _i++) {
                var row = _a[_i];
                this.AddNewItem();
                var latestRow = this.DynamicItems[this.DynamicItems.length - 1];
                for (var _b = 0, _c = latestRow.Fields; _b < _c.length; _b++) {
                    var field = _c[_b];
                    if (typeof row[field.Id] != 'undefined')
                        field.SetData(row[field.Id]);
                }
            }
            this.RefreshRowNumbers();
        };
        rednaorepeater.prototype.IsValid = function () {
            var isValid = true;
            for (var _i = 0, _a = this.DynamicItems; _i < _a.length; _i++) {
                var row = _a[_i];
                for (var _b = 0, _c = row.Fields; _b < _c.length; _b++) {
                    var field = _c[_b];
                    if (!field.IsValid())
                        isValid = false;
                }
            }
            return isValid;
        };
        rednaorepeater.prototype.GetDataStore = function () {
            return new SmartFormRepeaterDataStore(this);
        };
        rednaorepeater.prototype.GenerateInlineElement = function () {
            var component = '';
            if (smartFormsDesignMode) {
                component = "<div style=\"position: relative;border-color: #aaaaaa !important;border-style: dashed !important;border-width: 2px !important;width:100%;\">\n                                <div class=\"fieldContainerOfFields\" style=\"border-style:none !important;\">                                                                                                     \n                                </div>\n                                <span style=\"left:0;background-color: #CC9999;color: white;padding-left: 2px;padding-right: 2px;position: absolute;top: -8px;-webkit-border-radius: 5px;-moz-border-radius: 5px;border-radius: 5px;\">Repeater</span>\n                                ";
            }
            else {
                component = "<div style=\"position: relative;width:100%\">\n    \n                                <div class=\"fieldContainerOfFields\">                                                                                                     \n                                </div>";
            }
            if (this.Options.ManuallyAdd == "y")
                component += "<div class=\"col-sm-12\" style=\"text-align: right;\"><button class=\"btn btn-default repeaterAddButton\" href=\"#\"><span class=\"fa fa-plus\"></span></button></div>";
            component += '<div style="clear: both;"></div></div>';
            return component;
        };
        rednaorepeater.prototype.CreateProperties = function () {
            this.Properties.push(new PropertyContainer('general', 'General').AddProperties([
                new SimpleNumericProperty(this, this.Options, "NumberOfItems", "How many times do you want to repeat this section?", { ManipulatorType: 'basic' }).SetEnableFormula(),
                new CheckBoxProperty(this, this.Options, "ManuallyAdd", "Include add button", { ManipulatorType: 'basic' })
            ]));
            this.Properties.push(new PropertyContainer('icons', 'Tweaks').AddProperties([
                new CheckBoxProperty(this, this.Options, "IncludeItemNumberInLabels", "Include item number in labels", { ManipulatorType: 'basic' })
            ]));
            this.Properties.push(new PropertyContainer('advanced', 'Advanced').AddProperties([
                new IdProperty(this, this.Options),
                new CustomCSSProperty(this, this.Options)
            ]));
        };
        rednaorepeater.prototype.AddNewItem = function (animate) {
            var _this = this;
            if (animate === void 0) { animate = false; }
            var newDynamicRow = {
                Fields: [],
                RowId: this.latestRowId++,
                $Container: rnJQuery('<div class="repeaterRow"></div>')
            };
            this.DynamicItems.push(newDynamicRow);
            var $container = newDynamicRow.$Container;
            if (animate)
                $container.css({ opacity: 0, position: 'absolute', overflow: 'hidden' });
            this.JQueryElement.find('.fieldContainerOfFields').append($container);
            var _loop_1 = function (field) {
                var originalId = field.Id;
                if (!smartFormsDesignMode) {
                    field = Object.assign({}, field);
                    field.Id = field.Id + '_row_' + newDynamicRow.RowId;
                    field.ContainerOptions.Id += '_row_' + newDynamicRow.RowId;
                }
                field.FormId = this_1.Options.FormId;
                var fieldElement = sfRedNaoCreateFormElementByName(field.ClassName, field);
                fieldElement.OriginalId = originalId;
                fieldElement.IsInternal = true;
                fieldElement.FormId = this_1.FormId;
                fieldElement.Generator = this_1.Generator;
                fieldElement.RowIndex = newDynamicRow.RowId;
                fieldElement.InvalidInputMessage = this_1.InvalidInputMessage;
                fieldElement.ClientOptions = this_1.ClientOptions;
                this_1.Fields.push(fieldElement);
                fieldElement.AppendElementToContainer($container);
                fieldElement.FieldContainer = this_1;
                fieldElement._parentId = this_1.Options.Id;
                newDynamicRow.Fields.push(fieldElement);
                fieldElement.FirePropertyChanged();
                if (!smartFormsDesignMode && typeof RedNaoFormulaManagerVar != 'undefined') {
                    var formulas = RedNaoFormulaManagerVar.Formulas.filter(function (x) { return x.FormElement == fieldElement; });
                    if (formulas != null)
                        for (var _i = 0, formulas_1 = formulas; _i < formulas_1.length; _i++) {
                            var formula = formulas_1[_i];
                            formula.UpdateFieldWithValue(RedNaoFormulaManagerVar.Data);
                        }
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = this.Options.FieldOptions; _i < _a.length; _i++) {
                var field = _a[_i];
                _loop_1(field);
            }
            $container.append('<div style="clear: both;"></div>');
            if (this.Options.ManuallyAdd == "y" && !smartFormsDesignMode) {
                var $button = rnJQuery("<div class=\"col-sm-12\" style=\"text-align: right;\"><button class=\"btn btn-default repeaterAddButton\" href=\"#\"><span class=\"fa fa-trash\"></span></button></div>");
                $button.find('.repeaterAddButton').click(function (e) {
                    e.preventDefault();
                    _this.RemoveItem(true, _this.DynamicItems.indexOf(newDynamicRow));
                });
                $container.append($button);
            }
            if (animate) {
                var height = $container.outerHeight();
                $container.height(0);
                $container.css('width', '100%');
                $container.css('opacity', '');
                $container.css('position', '');
                $container.velocity({ height: [height, 0] }, 200, 'easeInExp', function () {
                    $container.css('overflow', '');
                    $container.css('height', '');
                    $container.css('width', '');
                });
            }
            this.RefreshRowNumbers();
        };
        rednaorepeater.prototype.RemoveItem = function (animate, index) {
            var _this = this;
            if (animate === void 0) { animate = false; }
            if (index === void 0) { index = -1; }
            if (this.DynamicItems.length == 0)
                return;
            var itemToRemove;
            if (index == -1)
                index = this.DynamicItems.length - 1;
            itemToRemove = this.DynamicItems[index];
            itemToRemove.$Container.css('overflow', 'hidden');
            var fieldsToRemove = this.DynamicItems[this.DynamicItems.length - 1].Fields;
            for (var _i = 0, fieldsToRemove_1 = fieldsToRemove; _i < fieldsToRemove_1.length; _i++) {
                var field = fieldsToRemove_1[_i];
                this.Fields.splice(this.Fields.indexOf(field), 1);
            }
            this.DynamicItems.splice(index, 1);
            if (this.DynamicItems.length >= index)
                for (var i = index; i < this.DynamicItems.length; i++) {
                    var dynamicField = this.DynamicItems[i];
                    for (var _a = 0, _b = dynamicField.Fields; _a < _b.length; _a++) {
                        var field = _b[_a];
                        field.Id = field.OriginalId + '_row_' + i;
                        field.RowIndex = i;
                        field.FirePropertyChanged();
                        field.JQueryElement.attr('id', field.Id);
                    }
                }
            this.latestRowId--;
            if (animate)
                itemToRemove.$Container.velocity({ height: 0 }, 200, 'easeOutExp', function () { itemToRemove.$Container.remove(); }, function () {
                    itemToRemove.$Container.remove();
                    _this.RefreshRowNumbers();
                });
            else {
                itemToRemove.$Container.remove();
                this.RefreshRowNumbers();
            }
        };
        rednaorepeater.prototype.RefreshRowNumbers = function () {
            var _this = this;
            this.JQueryElement.find('.repeaterRow').each(function (index, element) {
                var $repeaterSection = rnJQuery(element);
                $repeaterSection.attr('data-row-number', index);
                if (_this.Options.IncludeItemNumberInLabels == "y") {
                    $repeaterSection.find('.rednao-control-group').each(function (fieldIndex, fieldElement) {
                        var fieldId = rnJQuery(fieldElement).attr('id');
                        fieldId = fieldId.replace(/_row_[0-9]*/, '');
                        var fieldOptions = _this.Options.FieldOptions.find(function (x) { return x.Id == fieldId; });
                        if (fieldOptions == null)
                            return;
                        rnJQuery(fieldElement).find('.rednao_label_container label').text(fieldOptions.Label + ' #' + (index + 1));
                    });
                }
            });
            this.FirePropertyChanged();
        };
        return rednaorepeater;
    }(sfFormElementBase));
    SmartFormsFields.rednaorepeater = rednaorepeater;
})(SmartFormsFields || (SmartFormsFields = {}));
//# sourceMappingURL=rednaorepeater.js.map