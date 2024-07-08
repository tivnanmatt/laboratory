declare var smartFormsDesignMode: boolean;
declare namespace SmartFormsModules {
    const animationSpeed: number;
    class ContainerManager {
        static ContainerDictionary: any;
        static GetFormDictionary(formId: number): any;
        static GetNextContainerId(formId: number): number;
        static ClearContainer(formId: number): void;
        static DeleteContainerOfField(field: sfFormElementBase<any>): void;
        static CreateOrUpdateContainer(field: sfFormElementBase<any>): Container;
        static CreateContainer(field: sfFormElementBase<any>): Container;
    }
    class Container {
    }
    class ContainerBase extends Container {
        $container: JQuery;
        ContainerAddedCallback: () => void;
        fields: sfFormElementBase<any>[];
        readonly Options: ContainerOptions;
        constructor();
        GetContainerId(): string;
        IncludeField(field: sfFormElementBase<any>): void;
        AppendJQueryElementToUI(elementToAdd: sfFormElementBase<any>, jQueryContainer: JQuery, animate: boolean): JQuery;
        protected GetJQueryContent(): JQuery;
        ReplaceWithJQueryElement(jQueryContainer: JQuery, animate: boolean): JQuery;
        GetWidth(field: sfFormElementBase<any>): void;
    }
    class MultipleElementsContainer extends ContainerBase {
        protected GetJQueryContent(): JQuery;
        AppendJQueryElementToUI(elementToAdd: sfFormElementBase<any>, jQueryContainer: JQuery, animate: boolean): JQuery;
        GenerateItemContent(field: sfFormElementBase<any>): JQuery;
    }
}
