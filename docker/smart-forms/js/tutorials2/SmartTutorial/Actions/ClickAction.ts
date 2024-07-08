import {MouseAction} from "./MouseAction";

export class ClickAction extends MouseAction{

    public clearAfterClick:boolean=false;
    constructor($target:JQuery){
        super();
        this.$target=$target;
    }
    async ExecuteInternal():Promise<void> {
        return new Promise<void>( async (resolve)=> {
            await this.MoveMouseToElement(this.$target);
            this.$target.click();
            if(this.clearAfterClick)
                this.HideMouse();
            resolve();
        });
    }

    ClearInternal() {
    }

    ClearAfterClick() {
        this.clearAfterClick=true;
        return this;
    }
}