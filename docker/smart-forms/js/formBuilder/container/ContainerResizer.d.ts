declare namespace SmartFormsModules {
    class ContainerResizer {
        private designer;
        private RESIZER_AREA;
        private MINIMUN_WIDTH;
        private $fieldDisplayingResizer;
        private OriginalX;
        private LeftField;
        private RightField;
        private OriginalRightWidth;
        private OriginalLeftWidth;
        private FieldDragging;
        private ContainerWidth;
        private $LastBindedElement;
        private static ResizerThatStarted;
        constructor(designer: SmartFormsModules.MultipleElementsContainerDesigner);
        readonly Fields: sfFormElementBase<any>[];
        private InitializeResizer;
        private OnMouseMove;
        private GetElementDraggedTo;
        private IsInResizerArea;
        private ShowResizeCursor;
        private ClearResizer;
        private StartDrag;
        private DragMove;
        private AdjustSize;
        private EndDrag;
        private ChangeSize;
    }
}
