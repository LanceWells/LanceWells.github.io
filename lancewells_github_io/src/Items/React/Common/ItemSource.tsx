import { ItemWeapon } from '../../Classes/ItemWeapon';
import { ItemPotion } from '../../Classes/ItemPotion';
import { ItemArmor } from '../../Classes/ItemArmor';
import { ItemWondrous } from '../../Classes/ItemWondrous';

/**
 * @description A class used to fetch items based on a specific index and call.
 * 
 * In future, recall that this link explains how to self-initialize:
 * https://basarat.gitbooks.io/typescript/docs/tips/staticConstructor.html
 */
export class ItemSource {
    /**
     * @description Finds the item under the specified index, and returns that item. If the item cannot be
     * found, returns undefined instead. This function returns undefined such that a caller can determine how
     * to handle the missing element, rather than throw an exception.
     * @param index The index to search for the item.
     */
    static GetWeapon(index: string): ItemWeapon | undefined {
        var item: ItemWeapon | undefined = undefined;

        if (index in ItemMap_Weapons) {
            item = ItemMap_Weapons[index];
        }
        else {
            console.error(`Could not find the weapon item ${index}. Returning undefined.`);
        }
        return item;
    }

    /**
     * @description Finds the item under the specified index, and returns that item. If the item cannot be
     * found, returns undefined instead. This function returns undefined such that a caller can determine how
     * to handle the missing element, rather than throw an exception.
     * @param index The index to search for the item.
     */
    static GetPotion(index: string): ItemPotion | undefined {
        var item: ItemPotion | undefined = undefined;

        if (index in ItemMap_Potions) {
            item = ItemMap_Potions[index];
        }
        else {
            console.error(`Could not find the potion item ${index}. Returning undefined.`);
        }
        return item;
    }

    /**
     * @description Finds the item under the specified index, and returns that item. If the item cannot be
     * found, returns undefined instead. This function returns undefined such that a caller can determine how
     * to handle the missing element, rather than throw an exception.
     * @param index The index to search for the item.
     */
    static GetArmor(index: string): ItemArmor | undefined {
        var item: ItemArmor | undefined = undefined;

        if (index in ItemMap_Armor) {
            item = ItemMap_Armor[index];
        }
        else {
            console.error(`Could not find the armor item ${index}. Returning undefined.`);
        }
        return item;
    }

    /**
     * @description Finds the item under the specified index, and returns that item. If the item cannot be
     * found, returns undefined instead. This function returns undefined such that a caller can determine how
     * to handle the missing element, rather than throw an exception.
     * @param index The index to search for the item.
     */
    static GetWondrous(index: string): ItemWondrous | undefined {
        var item: ItemWondrous | undefined = undefined;

        if (index in ItemMap_Wondrous) {
            item = ItemMap_Wondrous[index];
        }
        else {
            console.error(`Could not find the wondrous item ${index}. Returning undefined.`);
        }
        return item;
    }
}

/**
 * The purpose of the following classes and constants is to act as a proxy for a server. This will likely all
 * go away if/when this software switches to use AWS or something similar.
 */
const ItemMap_Weapons: { [index: string]: ItemWeapon } =
{
    "Club": {
        title: 'Club',
        body: 'A stout bludgeoning weapon made of oak. Attacks with this weapon deal 1d4 bludgeoning damage. [Properties: Light]',
        iconSource: './images/Item_Shop/Items/Weapons/club.png',
        source: "Official",
        itemCost: 1,
        type: "Weapon",
        attacks: {
            "Whack":
                [
                    {
                        diceCount: 1,
                        diceSize: 4,
                        modifier: 0,
                        damageType: "Bludgeoning"
                    }
                ]
        }
    },
    "Dagger": {
        title: 'Dagger',
        body: 'A small piercing weapon. Attacks with this weapon deal 1d4 piercing damage. [Properties: Finesse, Light, Thrown (range 20/60)]',
        iconSource: './images/Item_Shop/Items/Weapons/dagger.png',
        source: "Official",
        itemCost: 2,
        type: "Weapon",
        attacks: {
            "Stab":
                [
                    {
                        diceCount: 1,
                        diceSize: 4,
                        modifier: 0,
                        damageType: "Piercing"
                    }
                ]
        }
    },
    "Greatclub": {
        title: 'Greatclub',
        body: 'A massive bludgeoning weapon. Attacks with this weapon deal 1d8 bludgeoning damage. [Properties: Two-handed]',
        iconSource: './images/Item_Shop/Items/Weapons/greatclub.png',
        source: "Official",
        itemCost: 1,
        type: "Weapon",
        attacks: {
            "Smash":
                [
                    {
                        diceCount: 1,
                        diceSize: 8,
                        modifier: 0,
                        damageType: "Bludgeoning"
                    }
                ]
        }
    },
    "Handaxe": {
        title: 'Handaxe',
        body: 'A small throwing axe. Attacks with this weapon deal 1d6 slashing damage. [Properties: Light, Thrown (range 20/60)]',
        iconSource: './images/Item_Shop/Items/Weapons/handaxe.png',
        source: "Official",
        itemCost: 5,
        type: "Weapon",
        attacks: {
            "Hack":
                [
                    {
                        diceCount: 1,
                        diceSize: 6,
                        modifier: 0,
                        damageType: "Slashing"
                    }
                ]
        }
    },
    "Javelin": {
        title: 'Javelin',
        body: 'A long, pointed, throwing weapon. Attacks with this weapon deal 1d6 piercing damage. [Properties: Thrown (range 30/120)]',
        iconSource: './images/Item_Shop/Items/Weapons/javelin.png',
        source: "Official",
        itemCost: 5,
        type: "Weapon",
        attacks: {
            "Poke":
                [
                    {
                        diceCount: 1,
                        diceSize: 6,
                        modifier: 0,
                        damageType: "Piercing"
                    }
                ]
        }
    },
    "LightHammer": {
        title: 'Light Hammer',
        body: 'A small bludgeoning weapon. Attacks with this weapon deal 1d4 bludgeoning damage. [Properties: Light, Thrown (range 20/60)]',
        iconSource: './images/Item_Shop/Items/Weapons/light_hammer.png',
        source: "Official",
        itemCost: 2,
        type: "Weapon",
        attacks: {
            "Smack":
                [
                    {
                        diceCount: 1,
                        diceSize: 4,
                        modifier: 0,
                        damageType: "Bludgeoning"
                    }
                ]
        }
    },
    "Mace": {
        title: 'Mace',
        body: 'A bludgeoning weapon. Attacks with this weapon deal 1d6 bludgeoning damage.',
        iconSource: './images/Item_Shop/Items/Weapons/mace.png',
        source: "Official",
        itemCost: 5,
        type: "Weapon",
        attacks: {
            "Smash":
                [
                    {
                        diceCount: 1,
                        diceSize: 6,
                        modifier: 0,
                        damageType: "Bludgeoning"
                    }
                ]
        }
    },
    "Quarterstaff": {
        title: 'Quarterstaff',
        body: 'A long, bludgeoning weapon made of oak. Attacks with this weapon deal 1d6 bludgeoning damage. [Properties: Versatile (1d8)]',
        iconSource: './images/Item_Shop/Items/Weapons/quarterstaff.png',
        source: "Official",
        itemCost: 1,
        type: "Weapon",
        attacks: {
            "Whap":
                [
                    {
                        diceCount: 1,
                        diceSize: 6,
                        modifier: 0,
                        damageType: "Bludgeoning"
                    }
                ]
        }
    },
    "Sickle": {
        title: 'Sickle',
        body: 'A curved weapon made of steel. Attacks with this weapon deal 1d4 slashing damage. [Properties: Light]',
        iconSource: './images/Item_Shop/Items/Weapons/sickle.png',
        source: "Official",
        itemCost: 1,
        type: "Weapon",
        attacks: {
            "Slash":
                [
                    {
                        diceCount: 1,
                        diceSize: 4,
                        modifier: 0,
                        damageType: "Slashing"
                    }
                ]
        }
    },
    "Spear": {
        title: 'Spear',
        body: 'A long, pointed weapon. Attacks with this weapon deal 1d6 piercing damage. [Properties: Thrown (range 20/60), Versatile (1d8)]',
        iconSource: './images/Item_Shop/Items/Weapons/spear.png',
        source: "Official",
        itemCost: 1,
        type: "Weapon",
        attacks: {
            "Stab":
                [
                    {
                        diceCount: 1,
                        diceSize: 6,
                        modifier: 0,
                        damageType: "Piercing"
                    }
                ]
        }
    },
    "Shortsword": {
        title: 'Shortsword',
        body: 'A short, pointed weapon. Attacks with this weapon deal 1d6 piercing damage. [Properties: Finesse, Light]',
        iconSource: './images/Item_Shop/Items/Weapons/shortsword.png',
        source: "Official",
        itemCost: 10,
        type: "Weapon",
        attacks: {
            "Stab":
                [
                    {
                        diceCount: 1,
                        diceSize: 6,
                        modifier: 0,
                        damageType: "Piercing"
                    }
                ]
        }
    },
    "SnakeStaff": {
        title: 'Snake Staff',
        body: 'A long oaken staff. The staff is wrapped by the likeness of a clay snake. Attacks with this weapon deal 1d4 bludgeoning damage and 1d4 poison damage.',
        iconSource: './images/Item_Shop/Items/Weapons/Cleric Staff Snake Green.png',
        source: "Homebrew",
        itemCost: 100,
        type: "Weapon",
        attacks: {
            "Curse":
                [
                    {
                        diceCount: 1,
                        diceSize: 4,
                        modifier: 0,
                        damageType: "Bludgeoning"
                    },
                    {
                        diceCount: 1,
                        diceSize: 4,
                        modifier: 0,
                        damageType: "Poison"
                    }
                ]
        }
    },
    "Darts": {
        title: 'Darts',
        body: 'A small thrown weapon. 20 darts line a leather pouch. Attacks with this weapon deal 1d4 piercing damage. [Properties: Finesse, Thrown (range 20/60)]',
        iconSource: './images/Item_Shop/Items/Weapons/dart.png',
        source: "Official",
        itemCost: 1,
        type: "Weapon",
        attacks: {
            "Throw":
                [
                    {
                        diceCount: 1,
                        diceSize: 4,
                        modifier: 0,
                        damageType: "Piercing"
                    }
                ]
        }
    },
    "LightCrossbow": {
        title: 'Light Crossbow',
        body: 'A light, mechanical device used for firing arrows across large distances. Attacks with this weapon deal 1d8 piercing damage. [Properties: Ammunition (range 80/320), Loading, Two-handed]',
        iconSource: './images/Item_Shop/Items/Weapons/light_crossbow.png',
        source: "Official",
        itemCost: 25,
        type: "Weapon",
        attacks: {
            "Fire":
                [
                    {
                        diceCount: 1,
                        diceSize: 8,
                        modifier: 0,
                        damageType: "Piercing"
                    }
                ]
        }
    },
    "Shortbow": {
        title: 'Shortbow',
        body: 'A long, curved piece of wood held taut by a length of wire. Attacks with this weapon deal 1d6 piercing damage. [Properties: Ammunition (range 80/320), Two-handed]',
        iconSource: './images/Item_Shop/Items/Weapons/shortbow.png',
        source: "Official",
        itemCost: 25,
        type: "Weapon",
        attacks: {
            "Fire":
                [
                    {
                        diceCount: 1,
                        diceSize: 4,
                        modifier: 0,
                        damageType: "Piercing"
                    }
                ]
        }
    },
    "Sling": {
        title: 'Sling',
        body: 'A small pocket held by two lengths of rope. When spun quickly, it can hurl projectiles at lethal speed. Attacks with this weapon deal 1d4 bludgeoning damage. [Properties: Ammunition (range 30/120)]',
        iconSource: './images/Item_Shop/Items/Weapons/sling.png',
        source: "Official",
        itemCost: 1,
        type: "Weapon",
        attacks: {
            "Throw":
                [
                    {
                        diceCount: 1,
                        diceSize: 4,
                        modifier: 0,
                        damageType: "Bludgeoning"
                    }
                ]
        }
    },
    "Battleaxe": {
        title: 'Battleaxe',
        body: 'A large, double-bladed axe. Attacks with this weapon deal 1d8 slashing damage. [Properties: Versatile (1d10)]',
        iconSource: './images/Item_Shop/Items/Weapons/battleaxe.png',
        source: "Official",
        itemCost: 1,
        type: "Weapon",
        attacks: {
            "Slash":
                [
                    {
                        diceCount: 1,
                        diceSize: 4,
                        modifier: 0,
                        damageType: "Slashing"
                    }
                ]
        }
    },
    "Glaive": {
        title: 'Glaive',
        body: 'A long polearm with a menacing length of steel at one end. Attacks with this weapon deal 1d10 slashing damage. [Properties: Heavy, Reach, Two-handed]',
        iconSource: './images/Item_Shop/Items/Weapons/glaive.png',
        source: "Official",
        itemCost: 1,
        type: "Weapon",
        attacks: {
            "Slash":
                [
                    {
                        diceCount: 1,
                        diceSize: 4,
                        modifier: 0,
                        damageType: "Slashing"
                    }
                ]
        }
    },
    "Longsword": {
        title: 'Longsword',
        body: 'A large, double-bladed axe. Attacks with this weapon deal 1d8 slashing damage. [Properties: Versatile (1d10)]',
        iconSource: './images/Item_Shop/Items/Weapons/longsword.png',
        source: "Official",
        itemCost: 15,
        type: "Weapon",
        attacks: {
            "Slash":
                [
                    {
                        diceCount: 1,
                        diceSize: 4,
                        modifier: 0,
                        damageType: "Slashing"
                    }
                ]
        }
    },
}

const ItemMap_Potions: { [index: string]: ItemPotion } =
{
    "SmallHealth": {
        title: 'Small Healing Potion',
        body: 'A small healing potion. Heals 2d4+2 when consumed.',
        iconSource: './images/Item_Shop/Items/Potions/LowHealthPotion.png',
        source: "Official",
        itemCost: 50,
        type: "Potion",
    },
    "SmallMana": {
        title: 'Small Mana Potion',
        body: 'A small mana potion. Restores 1 level 1 spell slot when consumed. Use of this potion will result in a withdrawal effect.',
        iconSource: './images/Item_Shop/Items/Potions/LowManaPotion.png',
        source: "Homebrew",
        itemCost: 100,
        type: "Potion",
    },
    "DarkContract": {
        title: 'Potion of the Dark Contract',
        body: 'A dark, bubbling brew. Light that enters the bottle does not return. On consuming this potion, take 2d4 necrotic damage. Your next attack gains bonus damage equal to twice the necrotic damage that you have taken.',
        iconSource: './images/Item_Shop/Items/Potions/DarkContractPotion.png',
        source: "Homebrew",
        itemCost: 100,
        type: "Potion",
    },
    "TiamatBrew": {
        title: "Tiamat's Brew",
        body: "A rainbow of shifting colors lives in this bottle. On consumption, cast the Dragon's Breath spell on self. Consuming this potion will result in a withdrawal effect.",
        iconSource: './images/Item_Shop/Items/Potions/potion_tiamat.png',
        source: "Homebrew",
        itemCost: 100,
        type: "Potion",
    },
    "MiasmaPoison": {
        title: 'Poisonous Miasma',
        body: 'A swirling, toxic potion. The likeness of a long, green, clay snake is enveloped around the bottle. When used, causes a weapon to deal an additional 2 poison damage to attacks that deal slashing or piercing damage. The effect lasts 24 hours. Application takes 1 minute, and this item is consumed on use.',
        iconSource: './images/Item_Shop/Items/Potions/poison.png',
        source: "Homebrew",
        itemCost: 100,
        type: "Potion",
    },
    "MiasmaBurning": {
        title: 'Burning Miasma',
        body: 'A swirling, heated potion. The likeness of a long, red, clay snake is enveloped around the bottle. When used, causes a weapon to deal an additional 2 fire damage to attacks that deal slashing or piercing damage. The effect lasts 24 hours. Application takes 1 minute, and this item is consumed on use.',
        iconSource: './images/Item_Shop/Items/Potions/poison_burning.png',
        source: "Homebrew",
        itemCost: 100,
        type: "Potion",
    },
    "MiasmaLightning": {
        title: 'Electric Miasma',
        body: 'A swirling, shocking potion. The likeness of a long, yellow, clay snake is enveloped around the bottle. When used, causes a weapon to deal an additional 2 lightning damage to attacks that deal slashing or piercing damage. The effect lasts 24 hours. Application takes 1 minute, and this item is consumed on use.',
        iconSource: './images/Item_Shop/Items/Potions/poison_lightning.png',
        source: "Homebrew",
        itemCost: 100,
        type: "Potion",
    },
    "Angelic": {
        title: 'Angelic Potion',
        body: 'A large, winged potion. The bottle is miraculously light. Bubbles rise endlessly from the bottom of the glass. When consumed, heals 2d4+2 hitpoints and grants the user the ability to fly for the next 18 seconds (3 rounds of combat). Use of this potion will result in a withdrawal effect.',
        iconSource: './images/Item_Shop/Items/Potions/AngelicPotion.png',
        source: "Homebrew",
        itemCost: 250,
        type: "Potion",
    },
}

const ItemMap_Armor: { [index: string]: ItemArmor } = {}

const ItemMap_Wondrous: { [index: string]: ItemWondrous } =
{
    "RedRing": {
        title: 'Firey Ring',
        body: 'A golden ring with a ruby fastened to its exterior. The ring is warm to the touch. Grants the bearer access to the Fire Bolt cantrip. If the user has no spellcasting modifier, they may use their Wisdom modifier. Wearing more than one spell-ring at once will cause the user to take 1 level of exhaustion every 10 seconds.',
        iconSource: './images/Item_Shop/Items/Rings/Ring Jewel Red.png',
        source: "Homebrew",
        itemCost: 100,
        type: "Wondrous",
    },
    "BlueRing": {
        title: 'Frigid Ring',
        body: 'A silver ring with a sapphire fastened to its exterior. The ring is cold to the touch. Grants the bearer access to the Ray of Frost cantrip. If the user has no spellcasting modifier, they may use their Wisdom modifier. Wearing more than one spell-ring at once will cause the user to take 1 level of exhaustion every 10 seconds.',
        iconSource: './images/Item_Shop/Items/Rings/Ring Silver Jewel Green.png',
        source: "Homebrew",
        itemCost: 100,
        type: "Wondrous",
    },
    "FloralRing": {
        title: 'Ring of Floral Accomodation',
        body: 'A silver ring with the likeness of a pink rose fastened to its exterior. When touched to any surface, that surface will sprout flowers at a rapid pace for the next 6 seconds.',
        iconSource: './images/Item_Shop/Items/Rings/Ring Floral.png',
        source: "Homebrew",
        itemCost: 50,
        type: "Wondrous",
    },
}
