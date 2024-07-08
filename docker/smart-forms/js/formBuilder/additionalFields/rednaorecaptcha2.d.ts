declare namespace SmartFormsFields {
    class rednaorecaptcha2 extends sfFormElementBase<any> {
        Title: string;
        paper: any;
        captchaId: any;
        ServerOptions: any;
        RecaptchaAlreadyLoaded: any;
        IsDynamicField: boolean;
        SetData(data: any): void;
        constructor(options: any, serverOptions: any);
        CreateProperties(): void;
        GenerateInlineElement(): string;
        GenerationCompleted(jQueryElement: any): void;
        interpolate(start: any, end: any, smilePercentage: any): any;
        GetValueString(): {
            value: any;
        };
        IsValid(): boolean;
        StoresInformation(): boolean;
        GetValuePath(): string;
    }
}
declare let grecaptcha: any;
