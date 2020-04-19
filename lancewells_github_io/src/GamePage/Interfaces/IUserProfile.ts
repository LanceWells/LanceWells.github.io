import { TUserProfileType } from '../Types/TUserProfileType';

export interface IUserProfile {
    ProfileType: TUserProfileType;
    ProfileImage: string;
    ProfileName: string;
    GameID: string | null;
}
