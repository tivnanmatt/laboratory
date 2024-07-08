import {SmartFormBasicDataStore} from "./SmartFormBasicDataStore";

export class SmartFormMultipleItemsDataStore extends SmartFormBasicDataStore {
    public selectedValues: Options[];

    public toString(): any {
        return RedNaoGetValueFromArray(this.selectedValues);
    }

    public IsSelected(label) {
        for (let i = 0; i < this.selectedValues.length; i++) {
            if (this.selectedValues[i].label == label)
                return true;
        }
        return false;
    };
}


export interface Options {
    value: string;
    amount: number;
    label: string;
}

declare let RedNaoGetValueFromArray: any;




