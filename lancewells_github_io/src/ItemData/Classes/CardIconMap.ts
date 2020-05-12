import { IconTooltip } from "../Types/IconTooltip";
import { WeaponProperties } from "../Enums/WeaponProperties";

export class CardIconMap {
    public static CardIconWeaponsMap: Map<WeaponProperties, IconTooltip> = new Map<WeaponProperties, IconTooltip>(
        [
            [
                WeaponProperties.Ammunition,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/Ammunition.png",
                    tooltipText: "This item uses ammunition for ranged attacks.",
                    fullDetails: "You can use a weapon that has the ammunition property to make a ranged attack only if you have ammunition to fire from the weapon. Each time you attack with the weapon, you expend one piece of ammunition. Drawing the ammunition from a quiver, case, or other container is part of the attack (you need a free hand to load a one-handed weapon). At the end of the battle, you can recover half your expended ammunition by taking a minute to search the battlefield. If you use a weapon that has the ammunition property to make a melee attack, you treat the weapon as an improvised weapon. A sling must be loaded to deal any damage when used in this way."
                }
            ],
            [
                WeaponProperties.Finesse,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/Finesse.png",
                    tooltipText: "This item requires finesse. Attacks and damage with this item may use STR or DEX.",
                    fullDetails: "When making an attack with a finesse weapon, you use your choice of your Strength or Dexterity modifier for the attack and damage rolls. You must use the same modifier for both rolls."
                }
            ],
            [
                WeaponProperties.Heavy,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/Heavy.png",
                    tooltipText: "This item is abnormally heavy. Small creatures will have a difficult time using this item.",
                    fullDetails: "Small creatures have disadvantage on attack rolls with heavy weapons. A heavy weapon's size and bulk make it too large for a Small creature to use effectively."
                }
            ],
            [
                WeaponProperties.Improvised,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/Improvised.png",
                    tooltipText: "This is an improvised weapon.",
                    fullDetails: "At the DM's option, a character proficient with a weapon can use a similar object as if it were that weapon and use his or her proficiency bonus. An object that bears no resemblance to a weapon deals 1d4 damage (the DM assigns a damage type appropriate for the object)."
                }
            ],
            [
                WeaponProperties.Light,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/Light.png",
                    tooltipText: "This item is unusually light and may be used with another weapon.",
                    fullDetails: "A light weapon is small and easy to handle, making it ideal for use when fighting with two weapons."
                }
            ],
            [
                WeaponProperties.Loading,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/Loading.png",
                    tooltipText: "This item requires manually loading and is limited to one attack per action.",
                    fullDetails: "Because of the time required to load this weapon, you can fire only one piece of ammunition from it when you use an action, bonus action, or reaction to fire it, regardless of the number of attacks you can normally make."
                }
            ],
            [
                WeaponProperties.Reach,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/Reach.png",
                    tooltipText: "This item has extended reach.",
                    fullDetails: "This weapon adds 5 feet to your reach when you attack with it, as well as when determining your reach for opportunity attacks with it."
                }
            ],
            [
                WeaponProperties.Silver,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/Silver.png",
                    tooltipText: "This item has been plated in silver.",
                    fullDetails: "Some monsters that have immunity or resistance to nonmagical weapons are susceptible to silver weapons."
                }
            ],
            [
                WeaponProperties.Special,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/Special.png",
                    tooltipText: "This item has some special usage. Refer to the card details for more information.",
                    fullDetails: "A weapon with the special property has unusual rules governing its use, explained in the weapon's description."
                }
            ],
            [
                WeaponProperties.Thrown,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/Thrown.png",
                    tooltipText: "This item may be thrown without reducing its damage.",
                    fullDetails: "If a weapon has the thrown property, you can throw the weapon to make a ranged attack. If the weapon is a melee wepaon, you use the same ability modifier for that attack roll and damage roll that you would use for a melee attack with the weapon. For example, if you throw a handaxe, you use your Strength, but if you throw a dagger, you can either use your Strength or your Dexterity since the dagger has the finesse property."
                }
            ],
            [
                WeaponProperties.TwoHanded,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/TwoHanded.png",
                    tooltipText: "This item is unwieldy and requires two hands to utilize.",
                    fullDetails: "This weapon requires two hands when you attack with it."
                }
            ],
            [
                WeaponProperties.Versatile,
                {
                    iconSource: "./images/Item_Shop/ItemCards/Icons/Versatile.png",
                    tooltipText: "This item is versatile and may be used with one or two hands.",
                    fullDetails: "This weapon can be used with one or two hands. A damage value in parentheses appears with the property-the damage when the weapon is used with two hands to make a melee attack."
                }
            ],
        ]
    );
}
