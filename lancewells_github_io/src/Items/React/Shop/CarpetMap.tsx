import { IItemDetails } from "../../Interfaces/IItemDetails";
import { ItemMap_Weapons } from "../Common/ItemMaps/weapons";
import { ItemMap_Potions } from "../Common/ItemMaps/potions";
import { ItemMap_Wondrous } from "../Common/ItemMaps/wondrous_items";

export type CarpetMap = {
    rugName: string;
    itemDetails: Array<IItemDetails>;
    rugBorderSource: string;
}

export const CarpetMaps: CarpetMap[] = [
    {
        rugName: "Simple Weapons",
        itemDetails: [
            ItemMap_Weapons["Club"],
            ItemMap_Weapons["Dagger"],
            ItemMap_Weapons["Greatclub"],
            ItemMap_Weapons["Handaxe"],
            ItemMap_Weapons["Javelin"],
            ItemMap_Weapons["LightHammer"],
        ],
        rugBorderSource: "url(/images/Item_Shop/Items/Rugs/purplerug.png)"
    },
    {
        rugName: "Potions",
        itemDetails: [
            ItemMap_Potions["SmallHealth"],
            ItemMap_Potions["SmallMana"],
            ItemMap_Potions["DarkContract"],
            ItemMap_Potions["TiamatBrew"],
            ItemMap_Potions["Angelic"],
            ItemMap_Potions["MiasmaBurning"],
        ],
        rugBorderSource: "url(/images/Item_Shop/Items/Rugs/greenrug.png)"
    },
    {
        rugName: "Wondrous Items",
        itemDetails: [
            ItemMap_Wondrous["RedRing"],
            ItemMap_Wondrous["BlueRing"],
            ItemMap_Wondrous["FloralRing"],
        ],
        rugBorderSource: "url(/images/Item_Shop/Items/Rugs/bluerug.png)"
    },
]

// for (let key in ItemMap_Wondrous) {
//     alert(ItemMap_Wondrous[key].title);
// }

// alert(Object.keys(ItemMap_Weapons).length);
