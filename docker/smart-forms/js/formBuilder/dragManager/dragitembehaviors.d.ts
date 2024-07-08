declare class DragItemBehaviorBase {
    FieldContainerOfFields: any;
    DraggedElement: JQuery;
    FormBuilder: RedNaoFormBuilder;
    FieldWithFieldsManager: FieldWithFieldsManager;
    FieldWithFields: FieldWithFieldsManager;
    rule: JQuery;
    LastTarget: any;
    LastPosition: any;
    LastDiplayedDraggedElement: any;
    LastSubTarget: any;
    LastSubTargetPosition: any;
    latestPosition: any;
    constructor(formBuilder: any, draggedElement: any);
    DragDrop(formBuilder: any, target: any, subTarget: any, subTargetPosition: any): void;
    HoverInAnything(target: any, displayedDraggedElement: any, x: any, y: any): void;
    FireEvent(eventName: any, args: any): void;
    DisplayDraggedItem(classOrigin: any): JQuery;
    ElementClicked(): void;
    ExecuteHoverAgain(): void;
    HoverInElement(target: any, position: any, displayedDraggedElement: any, subTarget: any, subTargetPosition: any): void;
}
/************************************************************************************New Element Behavior****************************************/
declare class DragItemBehaviorNewElement extends DragItemBehaviorBase {
    constructor(formBuilder: any, draggedElement: any);
    HoverInAnything(target: any, displayedDraggedElement: any, x: any, y: any): void;
    DragDrop(target: any, position: any, subTarget: any, subTargetPosition: any): void;
    DisplayDraggedItem(classOrigin: any): JQuery;
}
declare class DragItemBehaviorExistingElement extends DragItemBehaviorBase {
    rule: any;
    latestPosition: string;
    FormElement: sfFormElementBase<any>;
    constructor(formBuilder: any, draggedElement: any);
    DragDrop(target: any, position: any, subTarget: any, subTargetPosition: any): void;
    DisplayDraggedItem(classOrigin: any): JQuery;
    ElementClicked(): void;
}
declare class FieldWithFieldsManager {
    DragManager: DragItemBehaviorBase;
    FieldContainer: JQuery;
    TimeOut: any;
    CurrentTarget: any;
    constructor(dragManager: DragItemBehaviorBase);
    IsEditionInProcess(): boolean;
    Clear(): void;
    ProcessingHover(target: any, position: any): void;
    StartTimeoutForFieldEdition(target: any): void;
    ProcessDrop(): void;
}
