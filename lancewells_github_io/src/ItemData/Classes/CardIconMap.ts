import { IconTooltip } from "../Types/IconTooltip";
import { WeaponProperties } from "../Enums/WeaponProperties";

export class CardIconMap {
    public static CardIconWeaponsMap: Map<WeaponProperties, IconTooltip> = new Map<WeaponProperties, IconTooltip>(
        [
            [
                WeaponProperties.Ammunition,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/Ammunition.png",
                    tooltipText: "This item uses ammunition for ranged attacks."
                }
            ],
            [
                WeaponProperties.Finesse,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/Finesse.png",
                    tooltipText: "This item requires finesse. Attacks and damage with this item may use STR or DEX."
                }
            ],
            [
                WeaponProperties.Heavy,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/Heavy.png",
                    tooltipText: "This item is abnormally heavy. Small creatures will have a difficult time using this item."
                }
            ],
            [
                WeaponProperties.Improvised,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/Improvised.png",
                    tooltipText: "This is an improvised weapon."
                }
            ],
            [
                WeaponProperties.Light,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/Light.png",
                    tooltipText: "This item is unusually light and may be used with another weapon."
                }
            ],
            [
                WeaponProperties.Loading,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/Loading.png",
                    tooltipText: "This item requires manually loading and is limited to one attack per action."
                }
            ],
            [
                WeaponProperties.Reach,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/Reach.png",
                    tooltipText: "This item has extended reach."
                }
            ],
            [
                WeaponProperties.Silver,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/Silver.png",
                    tooltipText: "This item has been plated in silver."
                }
            ],
            [
                WeaponProperties.Special,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/Special.png",
                    tooltipText: "This item has some special usage. Refer to the card details for more information."
                }
            ],
            [
                WeaponProperties.Thrown,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/Thrown.png",
                    tooltipText: "This item may be thrown without reducing its damage."
                }
            ],
            [
                WeaponProperties.TwoHanded,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/TwoHanded.png",
                    tooltipText: "This item is unwieldy and requires two hands to utilize."
                }
            ],
            [
                WeaponProperties.Versatile,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/Versatile.png",
                    tooltipText: "This item is versatile and may be used with one or two hands."
                }
            ],
        ]
    );
}
