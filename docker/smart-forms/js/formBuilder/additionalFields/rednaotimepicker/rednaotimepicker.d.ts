declare let TimePickerProperty: any;
declare let ComboBoxProperty: any;
declare let SimpleNumericProperty: any;
declare let IconProperty: any;
declare let IdProperty: any;
declare namespace SmartFormsFields {
    class rednaotimepicker extends sfFormElementBase<TimePickerOptions> {
        private IsDynamicField;
        constructor(options: any, serverOptions: any);
        GetValueString(): {
            value: any;
            numericalValue: number;
        };
        StoresInformation(): boolean;
        SetData(data: any): void;
        IsValid(): boolean;
        GenerationCompleted($element: JQuery): void;
        private TimeToMilliseconds;
        GenerateInlineElement(): string;
        CreateProperties(): void;
        private SetTime;
    }
}
interface TimePickerOptions extends FieldOptions {
    MinuteStep: number;
    Value: string;
    Mode: "24hrs" | "AM/PM";
    MaxTime: number;
    MinTime: number;
    Placeholder: string;
    Icon: IconOption;
    ReadOnly: string;
    Placeholder_Icon: IconOption;
}
