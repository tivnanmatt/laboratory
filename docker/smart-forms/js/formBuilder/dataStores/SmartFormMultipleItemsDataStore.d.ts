import { SmartFormBasicDataStore } from "./SmartFormBasicDataStore";
export declare class SmartFormMultipleItemsDataStore extends SmartFormBasicDataStore {
    selectedValues: Options[];
    toString(): any;
    IsSelected(label: any): boolean;
}
export interface Options {
    value: string;
    amount: number;
    label: string;
}
