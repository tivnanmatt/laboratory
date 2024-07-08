declare namespace SmartFormsModules {
    class ContainerBaseDesigner extends SmartFormsModules.Container {
        Container: ContainerBase;
        constructor(Container: ContainerBase);
        IncludeField(field: sfFormElementBase<any>): void;
        readonly Options: ContainerOptions;
        AppendJQueryElementToUI(elementToAdd: sfFormElementBase<any>, jQueryContainer: JQuery, animate: boolean): JQuery;
        ReplaceWithJQueryElement(jQueryContainer: JQuery, animate: boolean): JQuery;
        RemoveField(field: sfFormElementBase<any>, animate: boolean, keepSize?: boolean): void;
        GetLastField(): sfFormElementBase<any>;
        InitializeFieldInDesigner(field: sfFormElementBase<any>, regenerateElement?: boolean): void;
        MoveField(targetField: sfFormElementBase<any>, fieldToInsert: sfFormElementBase<any>, position: "top" | "left" | "bottom" | "right", animate: boolean): void;
        InsertField(targetField: sfFormElementBase<any>, fieldToInsert: sfFormElementBase<any>, position: "top" | "left" | "bottom" | "right", animate: boolean, keepSize?: boolean): void;
        Refresh(): void;
        protected SwitchContainer(field: sfFormElementBase<any>, options: ContainerOptions): ContainerBaseDesigner;
        protected InsertingToAnInternalFieldHandler(targetField: sfFormElementBase<any>): boolean;
    }
    class MultipleElementsContainerDesigner extends ContainerBaseDesigner {
        Container: MultipleElementsContainer;
        resizer: ContainerResizer;
        constructor(Container: MultipleElementsContainer);
        MoveField(targetField: sfFormElementBase<any>, fieldToInsert: sfFormElementBase<any>, position: "top" | "left" | "bottom" | "right", animate: boolean): void;
        RemoveField(field: sfFormElementBase<any>, animate: boolean, keepSize?: boolean): void;
        InsertField(targetField: sfFormElementBase<any>, fieldToInsert: sfFormElementBase<any>, position: "top" | "left" | "bottom" | "right", animate: boolean, keepSize?: boolean): sfFormElementBase<any>[];
    }
}
