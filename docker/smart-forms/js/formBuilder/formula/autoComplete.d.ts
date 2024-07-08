declare class SfFormulaAutoComplete {
    process(editor: any, token: any): ListGenerator;
    private GenerateList;
    private IsFieldNerby;
    private IsMathNerby;
    private IsRemoteNerby;
    private GetFieldById;
    private GetIntellisenceforField;
}
declare class ListGenerator {
    data: any;
    constructor(editor: any);
    AddItem(label: string, label2: string, value: string, description: string): ListGenerator;
    private StylizeText;
}
interface CodeMirrorCursor {
    ch: number;
    line: number;
}
declare let SFAutoCompleteFieldDictionary: any;
