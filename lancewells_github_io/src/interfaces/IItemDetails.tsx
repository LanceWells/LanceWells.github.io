import {ItemType} from '../enums/ItemType';
import {SourceTypes} from '../enums/SourceTypes';

export interface IItemDetails {
    title: string;
    body: string;
    iconSource: string;
    source: SourceTypes;
    itemCost: number;
    type: ItemType;
}
