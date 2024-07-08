
///<reference path="../utilities/rxjs/rxjs.d.ts"/>
import ContainerBase = SmartFormsModules.ContainerBase;
import ContainerBaseDesigner = SmartFormsModules.ContainerBaseDesigner;

declare let smartFormsRootPath:any;
declare let ajaxurl:string;
declare let RedNaoLicensingManagerVar:any;
declare let SimpleTextProperty:any;
declare let smartFormsPath:any;
declare let CheckBoxProperty:any;
declare let ArrayProperty:any;
declare let SmartFormMultipleItemsDataStore:any;
declare let CustomCSSProperty:any;
declare let SmartFormsAddNewVar: iSmartFormsAddNewVar;
declare let RedNaoEventManager:RedNaoEventManagerInterface;


declare abstract class sfFormElementBase <T extends FieldOptions>{
    constructor(options:any,serverOptions:any);
    static IdCounter:number;
    _ignore:boolean;
    Id:string;
    FormId:string;
    OriginalId:string;
    IsInternal?:boolean;
    RowIndex?:number;
    _parentId:string;
    HandleFieldsInternally:boolean;
    Options:T;
    JQueryElement:JQuery;
    IsNew:boolean;
    ClientOptions:string;
    Properties:any[];
    InvalidInputMessage:string;
    IsFieldContainer:boolean;

    FieldContainer:sfFormElementBase<FieldOptions>;
    Fields:sfFormElementBase<FieldOptions>[];
    Generator:any;
    InitializeField();
    _id:number;

    SetDefaultIfUndefined(property:string,value:any);
    GetPropertyName():string;
    Clone():any;
    InitializeFieldLinking(liks:any[]);
    GetStepId();
    DestroyPopOver();
    GetFriendlyName();
    Show(requestId);
    Hide(requestId);
    Ignore();
    UnIgnore();
    ShowLoadingBox();
    HideLoadingBox();
    AppendElementToContainer(container:JQuery,animate?:boolean);
    AddField(field:sfFormElementBase<FieldOptions>,index:number);
    RemoveField(field:sfFormElementBase<FieldOptions>);
    AddError(group:string,message:string):any;
    RemoveError(group:string):any;
    GetFormId():number;
    GetElementClasses():any;
    RemoveField(animate:boolean):any;
    GenerateHtml(container:JQuery,animate:boolean);
    SwitchContainer(container:ContainerBase);
    GetContainer():ContainerBaseDesigner;
    SetContainer(container:SmartFormsModules.Container):void;
    ApplyAllStyles(): void;
    GetValuePath():string;
    InternalIsValid():boolean;
    GetDataStore():any;
    FirePropertyChanged(subField?:string):any;
    IsIgnored():boolean;
    LoadPlaceHolderIcon($element:JQuery,offsetLeft:number,offsetRight:number,options:any):void;
    HandleRefresh(propertyName:string,previousValue:any):boolean;
    RefreshElement(propertyName?:string,previousValue?:any);
    StoresInformation():boolean;
    IsHandledByAnotherField():boolean;
    abstract CreateProperties();
    abstract GenerateInlineElement():string;
    abstract GetValueString():any;
    abstract SetData(data:any);
    abstract IsValid():boolean;
    abstract GenerationCompleted($element:any);

}

interface FieldOptions
{
    FormId:string;
    Id:string;
    ClassName:string;
    Label:string;
    CustomCSS:string;
    IsRequired:'y'|'n';
    ContainerOptions:ContainerOptions;
}

interface IconOption{
    ClassName:string;
    Orientation?:string;
}



interface ContainerOptions{
    Id:string,
    Type:"single"|"multiple";
    Width:number;
}



interface RedNaoEventManagerInterface{
    Publish(eventName:string,args?:any);
    Subscribe(eventName:string,callBack:(param:any)=>void)
}

interface iSmartFormsAddNewVar{
    FormBuilder:RedNaoFormBuilder;
    LoadForm();
    ApplyCustomCSS():void;
}






interface AdditionalFieldsInfo{
    FieldName:string;
    FieldLabel:string;
    Location:string;
}

interface Window{
    SmartFormsAdditionalFields:AdditionalFieldsInfo[];
}

interface FormulaData{
    SubFieldsUsed:{Id:string,Name:string}[];
    RefreshFormData:"y"|"n";
    CompiledFormula:string;
    FieldsUsed:sfFormElementBase<any>[];
    PropertyName:string;
    AdditionalInformation:any;
    Value:string;

}
