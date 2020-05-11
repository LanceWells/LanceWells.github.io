import { IItemJson } from './IItemJson';
import { CarpetBorder } from '../../Shops/Enums/CarpetBorder';

export interface IItem extends IItemJson {
    RenderItemDescription(): JSX.Element;
    GetEqualityString(): string;
    GetCarpetType(): CarpetBorder;
    GetCardbackSource(): string;
    GetItemTextStyle(): React.CSSProperties;
}
