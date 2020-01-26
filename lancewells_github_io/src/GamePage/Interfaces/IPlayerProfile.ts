import { IUserProfile } from "./IUserProfile";
import { CharacterData } from "../../Items/Interfaces/CharacterData";

export interface IPlayerProfile extends IUserProfile {
    CharData: CharacterData;
}

export function ProfileIsPlayer(profile: IUserProfile): profile is IPlayerProfile {
    var isType: boolean = true;

    isType = isType && (profile as IPlayerProfile).ProfileType === "Player";
    isType = isType && (profile as IPlayerProfile).CharData !== undefined;

    return isType;
}
