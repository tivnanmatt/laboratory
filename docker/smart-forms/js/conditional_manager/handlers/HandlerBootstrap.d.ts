declare let SmartFormsConditionalHandlerArray: any[];
declare function SmartFormsGetConditionalHandlerByType(handlerId: any, options: any): SfConditionalHandlerBase;
declare function SmartFormsGetConditionalHandlerArray(): {
    Label: string;
    id: string;
    create: (options: any) => SfConditionalHandlerBase;
    ShouldShow: (builder: RedNaoFormBuilder) => boolean;
}[];
declare function SmartFormsCalculateCondition(condition: any, values: any, instance: any, current?: any): any;
