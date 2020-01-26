import { IItemJson } from "./IItem";

export interface ICharacterDataSerializable {
    characterName: string;
    inventory: IItemJson[];
}
