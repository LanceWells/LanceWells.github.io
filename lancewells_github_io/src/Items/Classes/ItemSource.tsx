import { ItemWeapon, IItemWeaponJson, IItemIsItemWeapon } from "./ItemWeapon";
import { ItemPotion, IItemPotionJson, IItemIsItemPotion } from './ItemPotion';
import { ItemArmor, IItemArmorJson, IItemIsItemArmor } from './ItemArmor';
import { ItemWondrous, IItemWondrousJson, IItemIsItemWondrous } from './ItemWondrous';
import { TItemType } from "../Types/TItemType";
import { IItemJson, IItem } from "../Interfaces/IItem";

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
     * @param type The type of item to search for.
     */
    public static GetItem(index: string, type: TItemType): IItem | undefined {
        var item: IItemJson | undefined = undefined;
        var listToSearch: IItemJson[] | undefined = undefined;
        var constructedItem: IItem | undefined = undefined;

        switch (type) {
            case "Weapon":
                listToSearch = ItemMap_Weapons;
                break;
            case "Armor":
                listToSearch = ItemMap_Armor;
                break;
            case "Potion":
                listToSearch = ItemMap_Potions;
                break;
            case "Wondrous":
                listToSearch = ItemMap_Wondrous;
                break;
            default:
                listToSearch = undefined;
                break;
        }
        
        if (listToSearch !== undefined) {
            for (let i = 0; i < listToSearch.length; i++) {
                let currentItem = listToSearch[i];
                if (currentItem.key === index) {
                    item = currentItem;
                    break;
                }
            }
        }

        if (item !== undefined) {
            constructedItem = this.ConvertJsonToItem(item);
        }

        return constructedItem;
    }

    /**
     * Searches the list of all available items for those that match a set of specific keywords. Enables
     * search functionality through all known items.
     * @param keywords The list of keywords to compare against all items.
     */
    public static SearchItems(keywords: string[]): IItem[] {
        var masterList: IItemJson[] = [];
        var matchingItems: IItem[] = [];

        // Filter out all empty keywords.
        var nonEmptyKeywords: string[] = keywords.filter(k => !this.IsMatch(k, /\s+/) && k.length > 0);

        // Trim off the whitespace for any keyword.
        nonEmptyKeywords = nonEmptyKeywords.map(k => k.trim());

        masterList = masterList.concat(ItemMap_Armor);
        masterList = masterList.concat(ItemMap_Potions);
        masterList = masterList.concat(ItemMap_Weapons);
        masterList = masterList.concat(ItemMap_Wondrous);

        var filteredItems = masterList.filter(item => nonEmptyKeywords.every(keyword => this.ContainsKeyword(keyword, item)))

        // nonEmptyKeywords.forEach(k => {
        // var filteredItems = masterList.filter(item => this.ContainsKeyword(k, item));

        // Verify that the item isn't already in the matching items list.
        filteredItems.forEach(f => {
            // Convert the item first. We need this to access the equality string.
            var converted = this.ConvertJsonToItem(f);

            // If the item can be converted, and the list of existing items does not already include this
            // item, then add it.
            if (converted !== undefined && !matchingItems.some(m => converted?.GetEqualityString() === m.GetEqualityString())) {
                matchingItems.push(converted);
            }
        });
        // });

        // If the list of keywords that was provided was empty, just return everything.
        if (nonEmptyKeywords.length <= 0) {
            masterList.forEach(m => {
                var converted = this.ConvertJsonToItem(m);
                if (converted !== undefined) {
                    matchingItems.push(converted);
                }
            })
        }

        return matchingItems;
    }

    /**
     * Converts a json-able item into an item.
     * @param item The json item to be converted to an item.
     */
    private static ConvertJsonToItem(item: IItemJson): IItem | undefined {
        var constructedItem: IItem | undefined = undefined;

        if (IItemIsItemWeapon(item)) {
            constructedItem = ItemWeapon.fromJson(item)
        }
        else if (IItemIsItemArmor(item)) {
            constructedItem = ItemArmor.fromJson(item);
        }
        else if (IItemIsItemPotion(item)) {
            constructedItem = ItemPotion.fromJson(item);
        }
        else if (IItemIsItemWondrous(item)) {
            constructedItem = ItemWondrous.fromJson(item);
        }

        return constructedItem;
    }

    /**
     * Returns true if the keyword is contained in the specified item.
     * @param keyword The keyword to evaluate. 
     * @param item The item to evaluate.
     */
    private static ContainsKeyword(keyword: string, item: IItemJson): boolean {
        var upperKeyword = keyword.toLocaleUpperCase();
        var doesMatch: boolean = false;
        
        doesMatch = doesMatch || item.key.toLocaleUpperCase().includes(upperKeyword);
        doesMatch = doesMatch || item.type.toLocaleUpperCase().includes(upperKeyword);
        doesMatch = doesMatch || item.title.toLocaleUpperCase().includes(upperKeyword);
        doesMatch = doesMatch || item.description.toLocaleUpperCase().includes(upperKeyword);
        doesMatch = doesMatch || item.details.toLocaleUpperCase().includes(upperKeyword);
        
        doesMatch = doesMatch || upperKeyword.includes("ATTUNEMENT".toLocaleUpperCase()) && item.requiresAttunement;

        if (IItemIsItemWeapon(item)) {
            doesMatch = doesMatch || item.properties.some(p => p.toLocaleUpperCase().includes(upperKeyword))
        }

        return doesMatch;
    }

    /**
     * Returns true if the provided regex matches the provided keyword.
     * @param phrase The keyword to match against.
     * @param regex The regular expression to compare against.
     */
    private static IsMatch(phrase: string, regex: RegExp): boolean {
        var isMatch: boolean = false;

        var match: RegExpMatchArray | null = phrase.match(regex);
        isMatch = isMatch || (match != null && match.length > 0);

        return isMatch;
    }
}

/**
 * The purpose of the following classes and constants is to act as a proxy for a server. This will likely all
 * go away if/when this software switches to use AWS or something similar.
 */
const ItemMap_Weapons: IItemWeaponJson[] =
[
    {
        key: 'Club',
        title: 'Club',
        description: 'A stout bludgeoning weapon made of oak.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/club.png',
        source: "Official",
        requiresAttunement: false,
        modifications: [],
        shortRange: 20,
        longRange: 60,
        properties: [
            "Light"
        ],
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
    {
        key: 'Dagger',
        title: 'Dagger',
        description: 'A small piercing weapon.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/dagger.png',
        source: "Official",
        requiresAttunement: false,
        modifications: [],
        shortRange: 20,
        longRange: 60,
        properties: [
            "Light",
            "Finesse",
            "Thrown"
        ],
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
    {
        key: 'Greatclub',
        title: 'Greatclub',
        description: 'A massive bludgeoning weapon.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/greatclub.png',
        source: "Official",
        requiresAttunement: false,
        modifications: [],
        shortRange: 20,
        longRange: 60,
        properties: [
            "TwoHanded"
        ],
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
    {
        key: 'Handaxe',
        title: 'Handaxe',
        description: 'A small throwing axe.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/handaxe.png',
        source: "Official",
        requiresAttunement: false,
        modifications: [],
        shortRange: 20,
        longRange: 60,
        properties: [
            "Light",
            "Thrown"
        ],
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
    {
        key: 'Javelin',
        title: 'Javelin',
        description: 'A long, pointed, throwing weapon.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/javelin.png',
        source: "Official",
        requiresAttunement: false,
        modifications: [],
        shortRange: 30,
        longRange: 120,
        properties: [
            "Thrown"
        ],
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
    {
        key: 'LightHammer',
        title: 'Light Hammer',
        description: 'A small bludgeoning weapon.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/light_hammer.png',
        source: "Official",
        requiresAttunement: false,
        modifications: [],
        shortRange: 20,
        longRange: 60,
        properties: [
            "Light",
            "Thrown"
        ],
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
    {
        key: 'Mace',
        title: 'Mace',
        description: 'A bludgeoning weapon.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/mace.png',
        source: "Official",
        requiresAttunement: false,
        modifications: [],
        shortRange: 20,
        longRange: 60,
        properties: [
        ],
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
    {
        key: 'Quarterstaff',
        title: 'Quarterstaff',
        description: 'A long, bludgeoning weapon made of oak.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/quarterstaff.png',
        source: "Official",
        requiresAttunement: false,
        modifications: [],
        shortRange: 20,
        longRange: 60,
        properties: [
            "Versatile"
        ],
        itemCost: 1,
        type: "Weapon",
        attacks: {
            "Whap (1h)":
                [
                    {
                        diceCount: 1,
                        diceSize: 6,
                        modifier: 0,
                        damageType: "Bludgeoning"
                    }
                ],
            "Whap (2h)":
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
    {
        key: 'Sickle',
        title: 'Sickle',
        description: 'A curved weapon made of steel.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/sickle.png',
        source: "Official",
        requiresAttunement: false,
        modifications: [],
        shortRange: 20,
        longRange: 60,
        properties: [
            "Light"
        ],
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
    {
        key: 'Spear',
        title: 'Spear',
        description: 'A long, pointed weapon.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/spear.png',
        source: "Official",
        requiresAttunement: false,
        modifications: [],
        shortRange: 20,
        longRange: 60,
        properties: [
            "Thrown",
            "Versatile"
        ],
        itemCost: 1,
        type: "Weapon",
        attacks: {
            "Stab (1h)":
                [
                    {
                        diceCount: 1,
                        diceSize: 6,
                        modifier: 0,
                        damageType: "Piercing"
                    }
                ],
            "Stab (2h)":
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
    {
        key: 'Shortsword',
        title: 'Shortsword',
        description: 'A short, pointed weapon.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/shortsword.png',
        source: "Official",
        requiresAttunement: false,
        modifications: [],
        shortRange: 20,
        longRange: 60,
        properties: [
            "Finesse",
            "Light"
        ],
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
    {
        key: 'SnakeStaff',
        title: 'Snake Staff',
        description: 'The staff is wrapped by the likeness of a clay snake.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/Cleric Staff Snake Green.png',
        source: "Homebrew",
        requiresAttunement: false,
        modifications: [],
        shortRange: 20,
        longRange: 60,
        properties: [
            "TwoHanded"
        ],
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
    {
        key: 'Darts',
        title: 'Darts',
        description: 'A small thrown weapon. 20 darts line a leather pouch.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/dart.png',
        source: "Official",
        requiresAttunement: false,
        modifications: [],
        shortRange: 20,
        longRange: 60,
        properties: [
            "Finesse",
            "Thrown"
        ],
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
    {
        key: 'LightCrossbow',
        title: 'Light Crossbow',
        description: 'A light, mechanical device used for firing arrows across large distances.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/light_crossbow.png',
        source: "Official",
        requiresAttunement: false,
        modifications: [],
        shortRange: 80,
        longRange: 230,
        properties: [
            "Ammunition",
            "Loading",
            "TwoHanded"
        ],
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
    {
        key: 'Shortbow',
        title: 'Shortbow',
        description: 'A long, curved piece of wood held taut by a length of wire.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/shortbow.png',
        source: "Official",
        requiresAttunement: false,
        modifications: [],
        shortRange: 80,
        longRange: 230,
        properties: [
            "Ammunition",
            "TwoHanded"
        ],
        itemCost: 25,
        type: "Weapon",
        attacks: {
            "Fire":
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
    {
        key: 'Sling',
        title: 'Sling',
        description: 'A small pocket held by two lengths of rope. When spun quickly, it can hurl projectiles at lethal speed.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/sling.png',
        source: "Official",
        requiresAttunement: false,
        modifications: [],
        shortRange: 30,
        longRange: 120,
        properties: [
            "Ammunition"
        ],
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
    {
        key: 'Battleaxe',
        title: 'Battleaxe',
        description: 'A large, double-bladed axe.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/battleaxe.png',
        source: "Official",
        requiresAttunement: false,
        modifications: [],
        shortRange: 20,
        longRange: 60,
        properties: [
            "Versatile"
        ],
        itemCost: 1,
        type: "Weapon",
        attacks: {
            "Slash (1h)":
                [
                    {
                        diceCount: 1,
                        diceSize: 8,
                        modifier: 0,
                        damageType: "Slashing"
                    }
                ],
            "Slash (2h)":
                [
                    {
                        diceCount: 1,
                        diceSize: 10,
                        modifier: 0,
                        damageType: "Slashing"
                    }
                ]
        }
    },
    {
        key: 'Glaive',
        title: 'Glaive',
        description: 'A long polearm with a menacing length of steel at one end.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/glaive.png',
        source: "Official",
        requiresAttunement: false,
        modifications: [],
        shortRange: 20,
        longRange: 60,
        properties: [
            "Heavy",
            "Reach",
            "TwoHanded"
        ],
        itemCost: 1,
        type: "Weapon",
        attacks: {
            "Slash":
                [
                    {
                        diceCount: 1,
                        diceSize: 10,
                        modifier: 0,
                        damageType: "Slashing"
                    }
                ]
        }
    },
    {
        key: 'Longsword',
        title: 'Longsword',
        description: 'A long . . . sword.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/longsword.png',
        source: "Official",
        requiresAttunement: false,
        modifications: [],
        shortRange: 20,
        longRange: 60,
        properties: [
            "Versatile"
        ],
        itemCost: 15,
        type: "Weapon",
        attacks: {
            "Slash (1h)":
                [
                    {
                        diceCount: 1,
                        diceSize: 8,
                        modifier: 0,
                        damageType: "Slashing"
                    }
                ],
            "Slash (2h)":
                [
                    {
                        diceCount: 1,
                        diceSize: 10,
                        modifier: 0,
                        damageType: "Slashing"
                    }
                ]
        },
    },
    {
        key: 'BrutalLongsword',
        title: 'Brutal Longsword',
        description: 'A viciously long . . . sword.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/longsword.png',
        source: "Official",
        requiresAttunement: false,
        modifications: [],
        shortRange: 20,
        longRange: 60,
        properties: [
            "Versatile"
        ],
        itemCost: 15,
        type: "Weapon",
        attacks: {
            "Slash (1h)":
                [
                    {
                        diceCount: 1,
                        diceSize: 8,
                        modifier: 1,
                        damageType: "Slashing"
                    }
                ],
            "Slash (2h)":
                [
                    {
                        diceCount: 1,
                        diceSize: 10,
                        modifier: 1,
                        damageType: "Slashing"
                    }
                ]
        },
    },
]

const ItemMap_Potions: IItemPotionJson[] =
[
    {
        key: 'SmallHealing',
        title: 'Small Healing Potion',
        description: 'A small healing potion.',
        details: 'Heals 2d4+2 when consumed.',
        iconSource: './images/Item_Shop/Items/Potions/LowHealthPotion.png',
        source: "Official",
        requiresAttunement: false,
        modifications: [],
        hasWithdrawalEffect: false,
        itemCost: 50,
        type: "Potion",
    },
    {
        key: 'SmallMana',
        title: 'Small Mana Potion',
        description: 'A small mana potion.',
        details: 'Restores 1 level 1 spell slot when consumed.',
        iconSource: './images/Item_Shop/Items/Potions/LowManaPotion.png',
        source: "Homebrew",
        requiresAttunement: false,
        modifications: [],
        hasWithdrawalEffect: true,
        itemCost: 100,
        type: "Potion",
    },
    {
        key: 'DarkContract',
        title: 'Potion of the Dark Contract',
        description: 'A dark, bubbling brew.',
        details: 'Light that enters the bottle does not return. On consuming this potion, take 2d4 necrotic damage. Your next attack gains bonus damage equal to twice the necrotic damage that you have taken.',
        iconSource: './images/Item_Shop/Items/Potions/DarkContractPotion.png',
        source: "Homebrew",
        requiresAttunement: false,
        modifications: [],
        hasWithdrawalEffect: false,
        itemCost: 100,
        type: "Potion",
    },
    {
        key: 'TiamatBrew',
        title: "Tiamat's Brew",
        description: 'A rainbow of shifting colors lives in this bottle.',
        details: "On consumption, cast the Dragon's Breath spell on self.",
        iconSource: './images/Item_Shop/Items/Potions/potion_tiamat.png',
        source: "Homebrew",
        requiresAttunement: false,
        modifications: [],
        hasWithdrawalEffect: true,
        itemCost: 100,
        type: "Potion",
    },
    {
        key: 'PoisonousMiasma',
        title: 'Poisonous Miasma',
        description: 'A swirling, toxic potion. The likeness of a long, green, clay snake is enveloped around the bottle.',
        details: 'When used, causes a weapon to deal an additional 2 poison damage to attacks that deal slashing or piercing damage. The effect lasts 24 hours. Application takes 1 minute, and this item is consumed on use.',
        iconSource: './images/Item_Shop/Items/Potions/poison.png',
        source: "Homebrew",
        requiresAttunement: false,
        modifications: [],
        hasWithdrawalEffect: false,
        itemCost: 100,
        type: "Potion",
    },
    {
        key: 'BurningMiasma',
        title: 'Burning Miasma',
        description: 'A swirling, heated potion. The likeness of a long, red, clay snake is enveloped around the bottle.',
        details: 'When used, causes a weapon to deal an additional 2 fire damage to attacks that deal slashing or piercing damage. The effect lasts 24 hours. Application takes 1 minute, and this item is consumed on use.',
        iconSource: './images/Item_Shop/Items/Potions/poison_burning.png',
        source: "Homebrew",
        requiresAttunement: false,
        modifications: [],
        hasWithdrawalEffect: false,
        itemCost: 100,
        type: "Potion",
    },
    {
        key: 'ElectricMiasma',
        title: 'Electric Miasma',
        description: 'A swirling, shocking potion. The likeness of a long, yellow, clay snake is enveloped around the bottle.',
        details: 'When used, causes a weapon to deal an additional 2 lightning damage to attacks that deal slashing or piercing damage. The effect lasts 24 hours. Application takes 1 minute, and this item is consumed on use.',
        iconSource: './images/Item_Shop/Items/Potions/poison_lightning.png',
        source: "Homebrew",
        requiresAttunement: false,
        modifications: [],
        hasWithdrawalEffect: false,
        itemCost: 100,
        type: "Potion",
    },
    {
        key: 'AngelicPotion',
        title: 'Angelic Potion',
        description: 'A large, winged potion. The bottle is miraculously light.',
        details: 'Bubbles rise endlessly from the bottom of the glass. When consumed, heals 2d4+2 hitpoints and grants the user the ability to fly for the next 18 seconds (3 rounds of combat).',
        iconSource: './images/Item_Shop/Items/Potions/AngelicPotion.png',
        source: "Homebrew",
        requiresAttunement: false,
        modifications: [],
        hasWithdrawalEffect: true,
        itemCost: 250,
        type: "Potion",
    },
]

const ItemMap_Armor: IItemArmorJson[] = [];

const ItemMap_Wondrous: IItemWondrousJson[] =
[
    {
        key: 'FireyRing',
        title: 'Firey Ring',
        description: 'A golden ring with a ruby fastened to its exterior. The ring is warm to the touch.',
        details: 'Grants the bearer access to the Fire Bolt cantrip. If the user has no spellcasting modifier, they may use their Wisdom modifier. Wearing more than one spell-ring at once will cause the user to take 1 level of exhaustion every 10 seconds.',
        iconSource: './images/Item_Shop/Items/Rings/Ring Jewel Red.png',
        source: "Homebrew",
        requiresAttunement: true,
        modifications: [],
        itemCost: 100,
        type: "Wondrous",
    },
    {
        key: 'FrigidRing',
        title: 'Frigid Ring',
        description: 'A silver ring with a sapphire fastened to its exterior. The ring is cold to the touch.',
        details: 'Grants the bearer access to the Ray of Frost cantrip. If the user has no spellcasting modifier, they may use their Wisdom modifier. Wearing more than one spell-ring at once will cause the user to take 1 level of exhaustion every 10 seconds.',
        iconSource: './images/Item_Shop/Items/Rings/Ring Silver Jewel Green.png',
        source: "Homebrew",
        requiresAttunement: true,
        modifications: [],
        itemCost: 100,
        type: "Wondrous",
    },
    {
        key: 'FloralRing',
        title: 'Ring of Floral Accomodation',
        description: 'A silver ring with the likeness of a pink rose fastened to its exterior.',
        details: 'When touched to any surface, that surface will sprout flowers at a rapid pace for the next 6 seconds.',
        iconSource: './images/Item_Shop/Items/Rings/Ring Floral.png',
        source: "Homebrew",
        requiresAttunement: true,
        modifications: [],
        itemCost: 50,
        type: "Wondrous",
    },
]
