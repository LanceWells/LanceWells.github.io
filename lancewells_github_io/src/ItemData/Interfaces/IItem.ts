import { IItemJson } from './IItemJson';

export interface IItem extends IItemJson {
    RenderItemDescription(): JSX.Element;
    GetEqualityString(): string;
}
