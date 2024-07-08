/// <reference path="../typings/sfGlobalTypings.d.ts" />
var SmartFormsElementsTranslation = {};
var SmartFormsEntries = /** @class */ (function () {
    function SmartFormsEntries() {
        var _this = this;
        rnJQuery('#cbDisplayType').change(function () {
            _this.FormatStartDate();
            _this.FormatEndDate();
        });
        rnJQuery(".datePicker").datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'MM/dd/yy',
            onClose: function (dateText, inst) {
                var id = rnJQuery(_this).attr('id');
                if (id == 'dpStartDate')
                    _this.FormatStartDate();
                else
                    _this.FormatEndDate();
            }
        });
        rnJQuery('#ui-datepicker-div').wrap('<div class="smartFormsSlider"></div>');
        rnJQuery('#btnExecute').click(function () { _this.ExecuteQuery(); });
    }
    SmartFormsEntries.prototype.FormatStartDate = function () {
        var dp = rnJQuery('#dpStartDate');
        var date = dp.datepicker('getDate');
        if (date == null)
            return;
        switch (rnJQuery('#cbDisplayType').val()) {
            case 'd':
                return;
            case 'w':
                dp.datepicker('setDate', new Date(date.setDate(date.getDate() - date.getDay())));
                break;
            case 'm':
                dp.datepicker('setDate', new Date(date.getFullYear(), date.getMonth(), 1));
                break;
            case 'y':
                dp.datepicker('setDate', new Date(date.getFullYear(), 0, 1));
                break;
        }
    };
    SmartFormsEntries.prototype.FormatEndDate = function () {
        var dp = rnJQuery('#dpEndDate');
        var date = dp.datepicker('getDate');
        if (date == null)
            return;
        switch (rnJQuery('#cbDisplayType').val()) {
            case 'd':
                return;
            case 'w':
                dp.datepicker('setDate', new Date(date.setDate(date.getDate() + (6 - date.getDay()))));
                break;
            case 'm':
                date = new Date(date.getFullYear(), date.getMonth() + 1, 1);
                dp.datepicker('setDate', new Date(date.setDate(0)));
                break;
            case 'y':
                dp.datepicker('setDate', new Date(date.getFullYear(), 11, 31));
                break;
        }
    };
    SmartFormsEntries.prototype.ExecuteQuery = function () {
        var _this = this;
        var startDate = rnJQuery.datepicker.formatDate('yy-mm-dd', rnJQuery('#dpStartDate').datepicker('getDate'));
        var endDate = rnJQuery.datepicker.formatDate('yy-mm-dd', rnJQuery('#dpEndDate').datepicker('getDate'));
        var form = rnJQuery('#cbForm').val();
        if (!startDate) {
            alert('Start Date is Mandatory');
            return;
        }
        if (!endDate) {
            alert('End Date is Mandatory');
            return;
        }
        if (!form) {
            alert('Campaign is mandatory');
            return;
        }
        var data = {
            action: "rednao_smart_forms_entries_list",
            startDate: startDate,
            endDate: endDate,
            form_id: form
        };
        rnJQuery.post(ajaxurl, data, function (result) {
            var result = rnJQuery.parseJSON(result);
            _this.ajaxCompleted(result);
        });
    };
    SmartFormsEntries.prototype.ajaxCompleted = function (result) {
        var _this = this;
        this.formElementsOptions = result.formOptions;
        this.entries = result.entries;
        Promise.all([
            rnSystem.import('sfMain/formBuilder/sfAnalytics'),
            rnSystem.import('sfMain/formBuilder/fakeFileUploader')
        ]).then(function (modules) {
            _this.fakeFileUploader = modules[1].fakeFileUploader;
            _this.LoadGrid(modules[0], _this.formElementsOptions, _this.entries);
        });
    };
    SmartFormsEntries.prototype.createActionButtons = function (colData, entryData) {
        return "<div class=\"bootstrap-wrapper\" data-entryid=\"" + entryData.entry_id + "\">\n                    <span class=\"glyphicon glyphicon-pencil editButton\" onclick=\"smartFormsEditClicked(event)\"></span>\n                    <span class=\"glyphicon glyphicon-trash deleteButton\" onclick=\"smartFormsDeleteClicked(event)\"></span>\n                </div>    \n                ";
    };
    SmartFormsEntries.prototype.LoadGrid = function (columnCreator, formOptions, entries) {
        var _this = this;
        var colmodel = [];
        colmodel.push({
            name: 'Actions', index: 'entry_id', width: 20, height: 120, editable: false, formatter: (function (param1, colData, entryData) {
                return _this.createActionButtons(colData, entryData);
            })
        });
        colmodel.push({
            "name": "date",
            "index": "date",
            "sorttype": "string",
            "key": false,
            "editable": true,
            hidden: false,
            width: 100
        });
        var i;
        for (i = 0; i < formOptions.length; i++) {
            var column = columnCreator.CreateColumn(formOptions[i]);
            if (column != null) {
                for (var t = 0; t < column.length; t++)
                    colmodel.push(column[t]);
            }
        }
        var max = 500;
        if (entries.length > 500)
            max = entries.length;
        colmodel.push({
            "name": "entry_id",
            "index": "entry_id",
            "sorttype": "int",
            "key": true,
            "editable": false,
            hidden: true
        });
        if (this.Grid != null)
            rnJQuery('#grid').jqGrid('GridUnload');
        this.Grid = rnJQuery('#grid').jqGrid({
            autowidth: false,
            "hoverrows": true,
            height: '100%',
            multiselect: true,
            mtype: "POST",
            "viewrecords": true,
            "jsonReader": { "repeatitems": false, "subgrid": { "repeatitems": false } },
            "gridview": true,
            "editurl": ajaxurl + "?action=rednao_smart_forms_execute_op",
            "cellurl": ajaxurl + "?action=rednao_smart_donations_execute_analytics_op",
            "rowList": [50, 150, 300, max],
            "rowNum": 50,
            "sortname": "TransactionId",
            "colModel": colmodel,
            "datatype": "local",
            "data": entries,
            "postData": { "oper": "grid" },
            "prmNames": {
                "page": "page",
                "rows": "rows",
                "sort": "sidx",
                "order": "sord",
                "search": "_search",
                "nd": "nd",
                "id": "TransactionId",
                "filter": "filters",
                "searchField": "searchField",
                "searchOper": "searchOper",
                "searchString": "searchString",
                "oper": "oper",
                "query": "grid",
                "addoper": "add",
                "editoper": "edit",
                "deloper": "del",
                "excel": "excel",
                "subgrid": "subgrid",
                "totalrows": "totalrows",
                "autocomplete": "autocmpl"
            },
            "loadError": function (xhr, status, err) {
                try {
                    if (xhr.responseText)
                        alert(xhr.responseText);
                }
                catch (e) {
                    alert(xhr.responseText);
                }
            },
            "pager": "#pager"
        });
        rnJQuery('#grid').jqGrid('navGrid', '#pager', {
            "add": false,
            "edit": false,
            "del": false,
            "search": false,
            "refresh": false,
            "view": false,
            "excel": false,
            "pdf": false,
            "csv": true,
            addtext: "",
            addtitle: "Add new row",
            "errorTextFormat": function (r) {
                return r.responseText;
            }
        }, {
            beforeSubmit: function () {
                alert('eaea');
            }
        }, {
            beforeSubmit: function () {
                alert('eaea1');
            }
        }, {
            beforeSubmit: function () {
                if (!RedNaoLicensingManagerVar.LicenseIsValid("Sorry, you need a license to delete a record")) {
                    return [false, 'A license is required'];
                }
                {
                    return [true];
                }
            },
            afterSubmit: function (response, postData) {
                try {
                    var result = JSON.parse(response.responseText);
                    if (result.success == "0")
                        return [false, result.message];
                }
                catch (exception) {
                    return [false, "An error occurred, please refresh and try again"];
                }
                return [true];
            }
        });
        rnJQuery("#grid").jqGrid('navButtonAdd', '#pager', {
            caption: "",
            buttonicon: 'ui-icon-trash',
            onClickButton: function () {
                var selectedRows = rnJQuery("#grid").getGridParam('selarrrow');
                if (selectedRows == null || selectedRows.length == 0)
                    return;
                selectedRows = selectedRows.slice(0);
                rnJQuery.RNGetConfirmationDialog().ShowConfirmation('Are you sure you want to delete the row?', (selectedRows.length).toString() + ' Rows are going to be deleted. This is not reversible', function () {
                    rnJQuery.ajax({
                        type: 'POST',
                        url: ajaxurl,
                        dataType: "json",
                        data: {
                            action: "rednao_smart_forms_execute_op",
                            entriesToDelete: JSON.stringify(selectedRows),
                            oper: 'massDelete'
                        },
                        success: function (result) {
                            for (var _i = 0, selectedRows_1 = selectedRows; _i < selectedRows_1.length; _i++) {
                                var rowId = selectedRows_1[_i];
                                rnJQuery('#grid').jqGrid('delRowData', rowId);
                            }
                            alert('Entry(es) deleted successfully');
                        }
                    });
                });
            }
        });
        rnJQuery("#grid").jqGrid('navButtonAdd', '#pager', {
            caption: "Export to csv (pro)",
            onClickButton: function () {
                if (!RedNaoLicensingManagerVar.LicenseIsValid('Sorry, exporting to csv is only supported in the pro version')) {
                    return;
                }
                var startDate = rnJQuery.datepicker.formatDate('yy-mm-dd', rnJQuery('#dpStartDate').datepicker('getDate'));
                var endDate = rnJQuery.datepicker.formatDate('yy-mm-dd', rnJQuery('#dpEndDate').datepicker('getDate'));
                var form = rnJQuery('#cbForm').val();
                //window.location=smartFormsRootPath+"smart-forms-exporter.php?startdate="+startDate+"&enddate="+endDate+"&formid="+form;
                var totalOfRecords = rnJQuery("#grid").jqGrid('getGridParam', 'records');
                if (totalOfRecords > 1000000)
                    alert('Warning the export funcion can export up to 1,0000,000 records. Please export the data directly though the database');
                var rowNum = rnJQuery('#grid').getGridParam('rowNum');
                // rnJQuery('#grid').setGridParam({rowNum: 1000000}).trigger("reloadGrid");
                var data = {};
                data.headers = {};
                var colmodels = rnJQuery('#grid').jqGrid('getGridParam', 'colModel');
                for (var i = 0; i < colmodels.length; i++) {
                    if (typeof colmodels[i].label == 'undefined')
                        continue;
                    data.headers[colmodels[i].index] = colmodels[i].label;
                }
                data.rowsInfo = rnJQuery("#grid").jqGrid('getRowData');
                for (var i = 0; i < data.rowsInfo.length; i++) {
                    delete data.rowsInfo[i].Actions;
                }
                var data = JSON.stringify(data);
                rnJQuery('#smartFormsExportData').val(data);
                rnJQuery('#exporterForm').submit();
                //rnJQuery('#grid').setGridParam({rowNum: rowNum}).trigger("reloadGrid");
            }
        });
        this.Grid.on('jqGridAddEditAfterSubmit', function (a, b, c) {
        });
    };
    SmartFormsEntries.prototype.editForm = function (formId, rowId) {
        var _this = this;
        this.updateEditContainer(formId);
        var $dialog = rnJQuery('#editDialog').RNDialog({
            ButtonClick: function (action, button) {
                if (action == 'accept') {
                    _this.SaveEdition(rowId);
                }
            },
            Width: '750px',
            Buttons: [
                { Label: 'Cancel', Id: 'dialogCancel', Style: 'danger', Icon: 'glyphicon glyphicon-remove', Action: 'cancel' },
                { Label: 'Submit', Id: 'dialogAccept', Style: 'success', Icon: 'glyphicon glyphicon-ok', Action: 'accept' }
            ]
        });
        $dialog.parent().addClass('exptop');
        $dialog.find('modal-footer').css('clear', 'both').css('border', 'none');
        $dialog.find('.modal-content').css('max-height', rnJQuery(window).height() * 0.7);
        $dialog.off('shown.bs.modal').on('shown.bs.modal', function () {
            for (var _i = 0, _a = _this.formElements; _i < _a.length; _i++) {
                var formField = _a[_i];
                if (formField.Options.ClassName == 'rednaosignature')
                    formField.ExecuteResize();
            }
        });
        $dialog.RNDialog('Show');
    };
    SmartFormsEntries.prototype.deleteForm = function (formId, rowId) {
        rnJQuery.RNGetConfirmationDialog().ShowConfirmation('Are you sure you want to delete the row?', 'This is not reversible', function () {
            rnJQuery.ajax({
                type: 'POST',
                url: ajaxurl,
                dataType: "json",
                data: {
                    action: "rednao_smart_forms_execute_op",
                    TransactionId: formId,
                    oper: 'del'
                },
                success: function (result) {
                    alert('Entry deleted successfully');
                    rnJQuery('#grid').jqGrid('delRowData', rowId);
                }
            });
        });
    };
    SmartFormsEntries.prototype.updateEditContainer = function (formId) {
        SmartFormsModules.ContainerManager.ClearContainer(formId);
        SmartFormsModules.ContainerManager.ClearContainer(0);
        var entry = null;
        this.currentEntryBeingEditted = formId;
        for (var i = 0; i < this.entries.length; i++) {
            if (this.entries[i].entry_id == formId) {
                entry = this.entries[i];
                break;
            }
        }
        var $container = rnJQuery('#editDialog');
        $container.empty();
        rnJQuery('#editDialog').RNDialog('Destroy');
        this.formElements = [];
        for (var _i = 0, _a = this.formElementsOptions; _i < _a.length; _i++) {
            var formOptions = _a[_i];
            var formElement;
            if (formOptions.ClassName == "sfFileUpload")
                formElement = new this.fakeFileUploader(formOptions);
            else
                formElement = sfRedNaoCreateFormElementByName(formOptions.ClassName, formOptions);
            if (formElement.StoresInformation() || formElement.IsFieldContainer) {
                this.formElements.push(formElement);
            }
        }
        for (var i = 0; i < this.formElements.length; i++)
            this.formElements[i].InitializeFieldLinking(this.formElements);
        for (var i = 0; i < this.formElements.length; i++)
            this.formElements[i].AppendElementToContainer($container);
        for (var i = 0; i < this.formElements.length; i++) {
            var value = entry.data[this.formElements[i].Id];
            this.formElements[i].SetData(value == undefined ? {} : value);
        }
    };
    SmartFormsEntries.prototype.SaveEdition = function (rowId) {
        var _this = this;
        var formValues = {};
        for (var _i = 0, _a = this.formElements; _i < _a.length; _i++) {
            var formElement = _a[_i];
            var value = formElement.GetValueString();
            formValues[formElement.Id] = value;
        }
        var me = this;
        rnJQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            dataType: "json",
            data: {
                action: "rednao_smart_forms_edit_form_values",
                nonce: SmartFormsEntriesVar.EditNonce,
                entryId: this.currentEntryBeingEditted,
                entryString: JSON.stringify(formValues),
                elementOptions: JSON.stringify(this.formElementsOptions)
            },
            success: function (result) {
                if (result.result) {
                    var currentEntry = null;
                    for (var _i = 0, _a = _this.entries; _i < _a.length; _i++) {
                        var entry = _a[_i];
                        if (entry.entry_id == _this.currentEntryBeingEditted)
                            currentEntry = entry;
                    }
                    currentEntry.data = formValues;
                    /*   var colModels=rnJQuery("#grid").jqGrid ('getGridParam', 'colModel');

                   var rowData=rnJQuery('#grid').jqGrid('getRowData', rowId);
                    for(var formValue in formValues) {
                        var currentColModel=null;
                        for(var colmodel of colModels)
                        {
                            if(colmodel.index==formValue)
                                currentColModel=colmodel;
                        }
                        rowData[formValue] = currentColModel.formatter('',{colModel:currentColModel},currentEntry);
                    }*/
                    var rowData = rnJQuery('#grid').jqGrid('getRowData', rowId);
                    rowData.data = currentEntry.data;
                    rnJQuery('#grid').jqGrid('setRowData', rowId, rowData);
                    rnJQuery('#editDialog').RNDialog('Hide');
                }
                else
                    alert('an error occurred, please try again');
            },
            error: function (result) {
                alert('An error ocurred');
            }
        });
    };
    return SmartFormsEntries;
}());
var SmartFormsEntriesVar;
rnJQuery(function () {
    SmartFormsEntriesVar = new SmartFormsEntries();
});
function smartFormsEditClicked(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!RedNaoLicensingManagerVar.LicenseIsValid("Sorry, you need a license to delete or edit a record")) {
        return [false, 'Sorry, A license is required'];
    }
    var formId = rnJQuery(event.currentTarget).parent().data('entryid');
    var rowId = rnJQuery(event.currentTarget).closest('.jqgrow').attr('id');
    SmartFormsEntriesVar.editForm(formId, rowId);
}
function smartFormsDeleteClicked(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    var formId = rnJQuery(event.currentTarget).parent().data('entryid');
    var rowId = rnJQuery(event.currentTarget).closest('.jqgrow').attr('id');
    SmartFormsEntriesVar.deleteForm(formId, rowId);
}
//# sourceMappingURL=smart-forms-entries.js.map