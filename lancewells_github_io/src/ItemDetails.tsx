import {SourceTypes} from './SourceTypes';

export interface ItemDetails {
    title: string;
    body: string;
    iconSource: string;
    source: SourceTypes;
    itemCost: number;
}
