/// <reference path="../typings/sfGlobalTypings.d.ts" />
declare var exports: any;
declare function CreateColumn(options: any): any[];
declare function GetObjectOrNull(rowObject: any, options: any): any;
declare function RedNaoTermOfService(options: any): {
    "name": any;
    label: any;
    "index": any;
    "editable": boolean;
    formatter: (cellvalue: any, cellOptions: any, rowObject: any) => "" | HTMLDivElement;
}[];
declare function RedNaoRepeaterColumn(options: any): {
    "name": any;
    label: any;
    "index": any;
    "editable": boolean;
    formatter: (cellvalue: any, cellOptions: any, rowObject: any) => string;
}[];
declare function RedNaoTextOrAmountColumn(options: any): {
    "name": any;
    label: any;
    "index": any;
    "editable": boolean;
    'sortable': boolean;
    formatter: (cellvalue: any, cellOptions: any, rowObject: any) => any;
    sorttype: (cell: any, rowObject: any) => any;
}[];
declare function RedNaoTextInputColumn(options: any): {
    "name": any;
    label: any;
    "index": any;
    "editable": boolean;
    'sortable': boolean;
    formatter: (cellvalue: any, cellOptions: any, rowObject: any) => any;
    sorttype: (cell: any, rowObject: any) => any;
}[];
declare function RedNaoSignatureColumn(options: any): {
    "name": any;
    label: any;
    "index": any;
    "editable": boolean;
    formatter: (cellvalue: any, cellOptions: any, rowObject: any) => string;
}[];
declare function RedNaoSurveyTableColumn(options: any): any[];
declare function RedNaoRecurrenceColumn(options: any): {
    "name": any;
    label: any;
    "index": any;
    "editable": boolean;
    formatter: (cellvalue: any, cellOptions: any, rowObject: any) => any;
}[];
declare function RedNaoCheckboxInputColumn(options: any): {
    "name": any;
    label: any;
    "index": any;
    "editable": boolean;
    formatter: (cellvalue: any, cellOptions: any, rowObject: any) => string;
}[];
declare function RedNaoMultipleCheckBoxesColumn(options: any): {
    "name": any;
    label: any;
    "index": any;
    "editable": boolean;
    formatter: (cellvalue: any, cellOptions: any, rowObject: any) => any;
}[];
declare function RedNaoDatePicker(options: any): {
    "name": any;
    label: any;
    "index": any;
    "editable": boolean;
    'sortable': boolean;
    formatter: (cellvalue: any, cellOptions: any, rowObject: any) => any;
    sorttype: (cell: any, rowObject: any) => any;
}[];
declare function RedNaoName(options: any): {
    "name": any;
    label: any;
    "index": any;
    "editable": boolean;
    'sortable': boolean;
    formatter: (cellvalue: any, cellOptions: any, rowObject: any) => any;
    sorttype: (cell: any, rowObject: any) => any;
}[];
declare function RedNaoPhone(options: any): {
    "name": any;
    label: any;
    "index": any;
    "editable": boolean;
    'sortable': boolean;
    formatter: (cellvalue: any, cellOptions: any, rowObject: any) => any;
    sorttype: (cell: any, rowObject: any) => any;
}[];
declare function RedNaoAddress(options: any): {
    "name": any;
    label: any;
    "index": any;
    "editable": boolean;
    'sortable': boolean;
    formatter: (cellvalue: any, cellOptions: any, rowObject: any) => any;
    sorttype: (cell: any, rowObject: any) => any;
}[];
declare function RedNaoFileUploadColumn(options: any): {
    "name": any;
    label: any;
    "index": any;
    "editable": boolean;
    formatter: (cellvalue: any, cellOptions: any, rowObject: any) => string;
}[];
