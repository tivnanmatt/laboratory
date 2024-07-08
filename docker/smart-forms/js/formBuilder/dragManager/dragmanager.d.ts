declare class RedNaoDragManager {
    FormBuilder: RedNaoFormBuilder;
    moveFunction: any;
    IsResizing: boolean;
    DragBehavior: DragItemBehaviorBase;
    displayedDraggedElement: JQuery;
    UnbindMoveFunction: any;
    constructor(formBuilder: any);
    MakeFieldsCatalogDraggable(): void;
    MakeAlreadySelectedElementsDraggable(): void;
    MakeItemDraggable(jQueryElement: any): void;
    SmartDonationsFormMouseDownFired(e: any, draggedElement: any): void;
}
