import { IItem } from "../../Items/Interfaces/IItem";

/**
 * A type used to represent an individual chest tab that is visible for any given player. The DM uses
 * this information to know which chests have been created, and which chests are visible. Players use
 * this info to display those shops that are visible to them.
 */
export type TChestTab = {
    ID: string;
    Name: string;
    Items: IItem[];
}