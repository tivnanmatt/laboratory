/// <reference path="../typings/sfGlobalTypings.d.ts" />
//declare let RedNaoPathExists:any;
function CreateColumn(options) {
    var elementName = options.ClassName;
    if (elementName == 'rednaotermofservice')
        return RedNaoTermOfService(options);
    if (elementName == 'rednaocurrency')
        return RedNaoTextInputColumn(options);
    if (elementName == 'rednaotextinput')
        return RedNaoTextInputColumn(options);
    if (elementName == 'rednaorating')
        return RedNaoTextInputColumn(options);
    if (elementName == 'rednaoprependedtext')
        return RedNaoTextInputColumn(options);
    if (elementName == 'rednaoappendedtext')
        return RedNaoTextInputColumn(options);
    if (elementName == 'rednaoemail')
        return RedNaoTextInputColumn(options);
    if (elementName == 'rednaodonationrecurrence')
        return RedNaoRecurrenceColumn(options);
    if (elementName == 'rednaoprependedcheckbox')
        return RedNaoCheckboxInputColumn(options);
    if (elementName == 'rednaoappendedcheckbox')
        return RedNaoCheckboxInputColumn(options);
    if (elementName == 'rednaomultiplecheckboxes' || elementName == 'rednaosearchablelist')
        return RedNaoMultipleCheckBoxesColumn(options);
    if (elementName == 'rednaoselectbasic' || elementName == 'sfProductWoocommerce')
        return RedNaoTextOrAmountColumn(options);
    if (elementName == 'rednaotextarea')
        return RedNaoTextInputColumn(options);
    if (elementName == 'rednaomultipleradios')
        return RedNaoTextOrAmountColumn(options);
    if (elementName == 'rednaodatepicker')
        return RedNaoDatePicker(options);
    if (elementName == 'rednaoname')
        return RedNaoName(options);
    if (elementName == 'rednaoaddress')
        return RedNaoAddress(options);
    if (elementName == 'rednaophone')
        return RedNaoPhone(options);
    if (elementName == "rednaonumber")
        return RedNaoTextInputColumn(options);
    if (elementName == "sfFileUpload" || elementName == 'rednaoimageupload')
        return RedNaoFileUploadColumn(options);
    if (elementName == 'rednaosurveytable')
        return RedNaoSurveyTableColumn(options);
    if (elementName == 'rednaoimagepicker')
        return RedNaoMultipleCheckBoxesColumn(options);
    if (elementName == 'rednaosignature')
        return RedNaoSignatureColumn(options);
    if (elementName == 'rednaorepeater')
        return RedNaoRepeaterColumn(options);
}
exports.CreateColumn = CreateColumn;
//declare let RedNaoPathExists:any;
function GetObjectOrNull(rowObject, options) {
    if (!RedNaoPathExists(rowObject, 'data.' + options.colModel.index))
        return null;
    return rowObject.data[options.colModel.index];
}
function RedNaoTermOfService(options) {
    return [{
            "name": options.Id,
            label: options.Label,
            "index": options.Id,
            "editable": true,
            formatter: function (cellvalue, cellOptions, rowObject) {
                try {
                    var data = GetObjectOrNull(rowObject, cellOptions);
                    debugger;
                    if (data == null)
                        return '';
                    var text = data.Text;
                    var startIndex = text.indexOf('$$');
                    var endIndex = 0;
                    if (startIndex >= 0) {
                        endIndex = text.indexOf('$$', startIndex + 2);
                    }
                    var textToReplace = '';
                    if (endIndex >= 0) {
                        textToReplace = text.substring(startIndex, endIndex + 2);
                    }
                    if (textToReplace != '') {
                        var linkLabel = textToReplace.replace(/\$\$/g, '');
                        var linkURL = '#';
                        var link = '<a target="_blank" href="' + linkURL + '">' + RedNaoEscapeHtml(linkLabel) + '</a>';
                        text = text.replace(textToReplace, link);
                    }
                    if (data.LinkType == 'PopUp') {
                    }
                    var div = document.createElement('div');
                    div.innerHTML = text;
                    var linkref = div.querySelector('a');
                    linkref.addEventListener('click', function (ev) {
                        ev.preventDefault();
                        if (data.LinkType == 'PopUp') {
                            var temp = document.createElement('div');
                            temp.innerHTML = data.PopUpText;
                            var table = '<table style="margin: 0;" class="table table-striped""><thead><tr><td>' + temp.innerText + '</td></tr></thead><tbody>';
                            var $dialog = rnJQuery(table).RNDialog({
                                Width: '750px',
                                Buttons: [
                                    { Label: 'Close', Id: 'dialogCancel', Style: 'danger', Icon: 'glyphicon glyphicon-remove', Action: 'cancel' }
                                ]
                            });
                            $dialog.find('modal-footer').css('clear', 'both').css('border', 'none');
                            $dialog.find('.modal-content').css('max-height', rnJQuery(window).height() * 0.7);
                            $dialog.RNDialog('Show');
                        }
                    });
                    return div;
                }
                catch (exception) {
                    return '';
                }
            }
        }];
}
function RedNaoRepeaterColumn(options) {
    return [{
            "name": options.Id,
            label: options.Label,
            "index": options.Id,
            "editable": true,
            formatter: function (cellvalue, cellOptions, rowObject) {
                try {
                    var data = GetObjectOrNull(rowObject, cellOptions);
                    if (data == null || data.value.length == 0)
                        return '';
                    var table = '<table style="table-layout: fixed;width:100%">';
                    var index = 0;
                    for (var _i = 0, _a = data.value; _i < _a.length; _i++) {
                        var row = _a[_i];
                        index++;
                        var _loop_1 = function (propertyName) {
                            table += '<tr>';
                            var fieldName = propertyName.replace(/_row_[0-9]*/, '');
                            var fieldOptions = options.FieldOptions.find(function (x) { return x.Id == fieldName; });
                            if (fieldOptions == null)
                                return { value: void 0 };
                            table += '<th style="text-align: left;width:30%;">' + RedNaoEscapeHtml(fieldOptions.Label) + ' #' + index + '</th>';
                            var columnList = CreateColumn(fieldOptions);
                            var value = '';
                            for (var _i = 0, columnList_1 = columnList; _i < columnList_1.length; _i++) {
                                var column = columnList_1[_i];
                                if (value != '')
                                    value += ',';
                                var data_1 = { data: {} };
                                data_1.data[propertyName] = row[propertyName];
                                value += column.formatter(null, { colModel: { index: propertyName } }, data_1);
                            }
                            table += '<th style="font-weight: normal;text-align: left">' + value + '</th>';
                            table += '</tr>';
                        };
                        for (var propertyName in row) {
                            var state_1 = _loop_1(propertyName);
                            if (typeof state_1 === "object")
                                return state_1.value;
                        }
                    }
                    table += '</table>';
                    return table;
                }
                catch (exception) {
                    return '';
                }
            }
        }];
}
function RedNaoTextOrAmountColumn(options) {
    return [{
            "name": options.Id,
            label: options.Label,
            "index": options.Id,
            "editable": true,
            'sortable': true,
            formatter: function (cellvalue, cellOptions, rowObject) {
                try {
                    var data = GetObjectOrNull(rowObject, cellOptions);
                    if (data == null)
                        return '';
                    return RedNaoEscapeHtml(data.value);
                }
                catch (exception) {
                    return '';
                }
            },
            sorttype: function (cell, rowObject) {
                var data = rowObject.data[options.Id];
                if (data == null)
                    return '';
                return RedNaoEscapeHtml(data.value);
            }
        }];
}
function RedNaoTextInputColumn(options) {
    return [{
            "name": options.Id,
            label: options.Label,
            "index": options.Id,
            "editable": true,
            'sortable': true,
            formatter: function (cellvalue, cellOptions, rowObject) {
                try {
                    var data = GetObjectOrNull(rowObject, cellOptions);
                    if (data == null)
                        return '';
                    return RedNaoEscapeHtml(data.value);
                }
                catch (exception) {
                    return '';
                }
            },
            sorttype: function (cell, rowObject) {
                var data = rowObject.data[options.Id];
                if (data == null)
                    return '';
                return RedNaoEscapeHtml(data.value);
            }
        }];
}
function RedNaoSignatureColumn(options) {
    return [{
            "name": options.Id,
            label: options.Label,
            "index": options.Id,
            "editable": true,
            formatter: function (cellvalue, cellOptions, rowObject) {
                try {
                    var data = GetObjectOrNull(rowObject, cellOptions);
                    if (data == null)
                        return '';
                    if (typeof data.native != 'undefined' && data.native != '')
                        return '<img style="width:100%" src="data:image/svg+xml;base64,' + RedNaoEscapeHtml(data.value) + '"></img>';
                    return '';
                }
                catch (exception) {
                    return '';
                }
            }
        }];
}
function RedNaoSurveyTableColumn(options) {
    var columns = [];
    for (var i = 0; i < options.Rows.length; i++) {
        columns.push({
            "name": options.Id + '_' + i,
            label: options.Rows[i].label,
            "index": options.Id + '_' + i,
            "surveyRowId": i,
            "editable": true,
            "fieldId": options.Id,
            formatter: function (cellvalue, cellOptions, rowObject) {
                try {
                    var rowIndex = cellOptions.colModel.surveyRowId;
                    var data = rowObject.data[cellOptions.colModel.fieldId];
                    if (data.values.length > rowIndex) {
                        return RedNaoEscapeHtml(data.values[rowIndex].ValueLabel);
                    }
                }
                catch (exception) {
                    return '';
                }
            }
        });
    }
    return columns;
}
function RedNaoRecurrenceColumn(options) {
    return [{
            "name": options.Id,
            label: options.Label,
            "index": options.Id,
            "editable": true,
            formatter: function (cellvalue, cellOptions, rowObject) {
                try {
                    var data = GetObjectOrNull(rowObject, cellOptions);
                    if (data == null)
                        return '';
                    switch (data.value) {
                        case 'OT':
                            return 'One time';
                        case 'D':
                            return 'Daily';
                        case 'W':
                            return 'Weekly';
                        case 'M':
                            return 'Monthly';
                        case 'Y':
                            return 'Yearly';
                    }
                    return data.value;
                }
                catch (exception) {
                    return '';
                }
            }
        }];
}
function RedNaoCheckboxInputColumn(options) {
    return [{
            "name": options.Id,
            label: options.Label,
            "index": options.Id,
            "editable": true,
            formatter: function (cellvalue, cellOptions, rowObject) {
                try {
                    var data = GetObjectOrNull(rowObject, cellOptions);
                    if (data == null)
                        return '';
                    return RedNaoEscapeHtml(data.checked) + ". " + RedNaoEscapeHtml(data.value);
                }
                catch (exception) {
                    return '';
                }
            }
        }];
}
function RedNaoMultipleCheckBoxesColumn(options) {
    return [{
            "name": options.Id,
            label: options.Label,
            "index": options.Id,
            "editable": true,
            formatter: function (cellvalue, cellOptions, rowObject) {
                try {
                    var data = GetObjectOrNull(rowObject, cellOptions);
                    if (data == null)
                        return '';
                    var values = "";
                    for (var i = 0; i < data.selectedValues.length; i++)
                        values += data.selectedValues[i].value.trim() + ";";
                    return RedNaoEscapeHtml(values);
                }
                catch (exception) {
                    return '';
                }
            }
        }];
}
function RedNaoDatePicker(options) {
    return [{
            "name": options.Id,
            label: options.Label,
            "index": options.Id,
            "editable": true,
            'sortable': true,
            formatter: function (cellvalue, cellOptions, rowObject) {
                try {
                    var data = GetObjectOrNull(rowObject, cellOptions);
                    if (data == null || data.value == "")
                        return '';
                    var dateParts = data.value.split("-");
                    if (dateParts.length != 3)
                        return '';
                    var date = new Date(dateParts[0], parseInt(dateParts[1]) - 1, dateParts[2]);
                    return RedNaoEscapeHtml(rnJQuery.datepicker.formatDate(options.DateFormat, date));
                }
                catch (exception) {
                    return '';
                }
            },
            sorttype: function (cell, rowObject) {
                var data = rowObject.data[options.Id];
                if (data == null || data.value == "")
                    return '';
                var dateParts = data.value.split("-");
                if (dateParts.length != 3)
                    return '';
                var date = new Date(dateParts[0], parseInt(dateParts[1]) - 1, dateParts[2]);
                return RedNaoEscapeHtml(rnJQuery.datepicker.formatDate(options.DateFormat, date));
            }
        }];
}
function RedNaoName(options) {
    return [{
            "name": options.Id,
            label: options.Label,
            "index": options.Id,
            "editable": true,
            'sortable': true,
            formatter: function (cellvalue, cellOptions, rowObject) {
                try {
                    var data = GetObjectOrNull(rowObject, cellOptions);
                    if (data == null)
                        return '';
                    return RedNaoEscapeHtml(data.firstName + ' ' + data.lastName);
                }
                catch (exception) {
                    return '';
                }
            }, sorttype: function (cell, rowObject) {
                var data = rowObject.data[options.Id];
                if (data == null)
                    return '';
                if (data == null)
                    return '';
                return RedNaoEscapeHtml(data.firstName + ' ' + data.lastName);
            }
        }];
}
function RedNaoPhone(options) {
    return [{
            "name": options.Id,
            label: options.Label,
            "index": options.Id,
            "editable": true,
            'sortable': true,
            formatter: function (cellvalue, cellOptions, rowObject) {
                try {
                    var data = GetObjectOrNull(rowObject, cellOptions);
                    if (data == null)
                        return '';
                    return RedNaoEscapeHtml(data.area + '-' + data.phone);
                }
                catch (exception) {
                    return '';
                }
            }, sorttype: function (cell, rowObject) {
                var data = rowObject.data[options.Id];
                if (data == null)
                    return '';
                if (data == null)
                    return '';
                return RedNaoEscapeHtml(data.area + '-' + data.phone);
            }
        }];
}
function RedNaoAddress(options) {
    return [{
            "name": options.Id,
            label: options.Label,
            "index": options.Id,
            "editable": true,
            'sortable': true,
            formatter: function (cellvalue, cellOptions, rowObject) {
                try {
                    var data = GetObjectOrNull(rowObject, cellOptions);
                    if (data == null)
                        return '';
                    var appendAddressElement = function (address, element) {
                        if (element == "" || typeof element == 'undefined')
                            return address;
                        if (address == "")
                            address = element;
                        else
                            address += ", " + element;
                        return address;
                    };
                    var address = "";
                    address = appendAddressElement(address, data.streetAddress1);
                    address = appendAddressElement(address, data.streetAddress2);
                    address = appendAddressElement(address, data.city);
                    address = appendAddressElement(address, data.state);
                    address = appendAddressElement(address, data.zip);
                    address = appendAddressElement(address, data.country);
                    return RedNaoEscapeHtml(address);
                }
                catch (exception) {
                    return '';
                }
            }, sorttype: function (cell, rowObject) {
                var data = rowObject.data[options.Id];
                if (data == null)
                    return '';
                if (data == null)
                    return '';
                var appendAddressElement = function (address, element) {
                    if (element == "" || typeof element == 'undefined')
                        return address;
                    if (address == "")
                        address = element;
                    else
                        address += ", " + element;
                    return address;
                };
                var address = "";
                address = appendAddressElement(address, data.streetAddress1);
                address = appendAddressElement(address, data.streetAddress2);
                address = appendAddressElement(address, data.city);
                address = appendAddressElement(address, data.state);
                address = appendAddressElement(address, data.zip);
                address = appendAddressElement(address, data.country);
                return RedNaoEscapeHtml(address);
            }
        }];
}
function RedNaoFileUploadColumn(options) {
    return [{
            "name": options.Id,
            label: options.Label,
            "index": options.Id,
            "editable": true,
            formatter: function (cellvalue, cellOptions, rowObject) {
                try {
                    var data = GetObjectOrNull(rowObject, cellOptions);
                    if (data == null)
                        return '';
                    var firstRow = true;
                    var html = "";
                    for (var i = 0; i < data.length; i++) {
                        if (firstRow)
                            firstRow = false;
                        else
                            html += "<br/>";
                        html += '<a target="_blank" href="' + data[i].path + '">' + data[i].path + '</a>';
                    }
                    return html;
                }
                catch (exception) {
                    return '';
                }
            }
        }];
}
//# sourceMappingURL=sfAnalytics.js.map