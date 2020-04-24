import { PartType } from "../Enums/PartType";

export type PartSelectionCallback = (partType: PartType, imageSource: string) => void;
