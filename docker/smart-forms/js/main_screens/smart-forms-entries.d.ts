/// <reference path="../typings/sfGlobalTypings.d.ts" />
declare var sfRedNaoCreateFormElementByName: any;
declare var SmartFormsElementsTranslation: any;
declare class SmartFormsEntries {
    Grid: any;
    formElementsOptions: any;
    formElements: any;
    entries: any;
    currentEntryBeingEditted: number;
    fakeFileUploader: any;
    constructor();
    FormatStartDate(): any;
    FormatEndDate(): void;
    ExecuteQuery(): void;
    ajaxCompleted(result: any): void;
    createActionButtons(colData: any, entryData: any): string;
    LoadGrid(columnCreator: any, formOptions: any, entries: any): void;
    editForm(formId: number, rowId: string): void;
    deleteForm(formId: string, rowId: string): void;
    private updateEditContainer;
    private SaveEdition;
}
declare var SmartFormsEntriesVar: SmartFormsEntries;
declare function smartFormsEditClicked(event: any): (string | boolean)[];
declare function smartFormsDeleteClicked(event: any): void;
