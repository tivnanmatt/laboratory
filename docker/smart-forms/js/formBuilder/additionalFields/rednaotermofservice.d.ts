declare var TinyMCEProperty: any;
declare var RedNaoEscapeHtml: any;
declare namespace SmartFormsFields {
    class rednaotermofservice extends sfFormElementBase<TermOfServiceOptions> {
        private IsDynamicField;
        GetValueString(): {
            LinkType: "PopUp" | "OpenLink";
            PopUpText: string;
            PopUpTitle: string;
            Text: string;
        };
        constructor(options: any, serverOptions: any);
        StoresInformation(): boolean;
        SetData(data: any): void;
        IsValid(): boolean;
        GenerationCompleted($element: any): void;
        GenerateInlineElement(): string;
        CreateProperties(): void;
    }
}
interface TermOfServiceOptions extends FieldOptions {
    Text: string;
    LinkType: 'OpenLink' | "PopUp";
    PopUpTitle: string;
    PopUpText: string;
    LinkURL: string;
    LinkText: string;
}
