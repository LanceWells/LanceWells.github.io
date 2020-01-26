import { IUserProfile } from "./IUserProfile";

export interface IDMProfile extends IUserProfile {
}

export function ProfileIsDM(profile: IUserProfile): profile is IUserProfile {
    var isType: boolean = true;

    isType = isType && (profile as IDMProfile).ProfileType === "DM";

    return isType;
}
