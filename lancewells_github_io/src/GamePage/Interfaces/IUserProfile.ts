import { TUserProfileType } from '../Types/TUserProfileType';

export interface IUserProfile {
    ProfileType: TUserProfileType;
    ProfileImage: string;
    ProfileName: string;
    GameID: string | null;
}

// {
//     "uid":
//     {
//         "Roles" :
//         [
//             {
//                 "RoleType": "DM",
//                 "ProfileImage": "bleg.png",
//                 "GameId": "12381f38g38xa91"
//             },
//             {
//                 "RoleType": "Player",
//                 "ProfileImage": "mupluyer.png",
//                 "GameId": "sfd31f38g38xa12",
//                 "CharacterData": {}
//             },
//             {
//                 "RoleType": "Player",
//                 "ProfileImage": "fureveralogn.png",
//                 "GameId": null,
//                 "CharacterData": {}
//             }
//         ]
//     }
// }
