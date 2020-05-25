import { ItemWeapon, IItemWeaponJson, IItemIsItemWeapon } from "./ItemWeapon";
import { ItemPotion, IItemPotionJson, IItemIsItemPotion } from './ItemPotion';
import { ItemArmor, IItemArmorJson, IItemIsItemArmor } from './ItemArmor';
import { ItemWondrous, IItemWondrousJson, IItemIsItemWondrous } from './ItemWondrous';
import { ItemType } from "../Enums/ItemType";
import { IItem } from "../Interfaces/IItem";
import { IItemJson } from "../Interfaces/IItemJson";
import { SourceType } from "../Enums/SourceType";
import { WeaponProperties } from "../Enums/WeaponProperties";
import { DamageType } from "../Enums/DamageType";
import { IItemKey } from "../Interfaces/IItemKey";

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
    public static GetItem(itemKey: IItemKey): IItem | undefined {
        let item: IItemJson | undefined = undefined;
        let listToSearch: IItemJson[] | undefined = undefined;
        let constructedItem: IItem | undefined = undefined;

        switch (itemKey.type) {
            case ItemType.Weapon:
                listToSearch = ItemMap_Weapons;
                break;
            case ItemType.Armor:
                listToSearch = ItemMap_Armor;
                break;
            case ItemType.Consumable:
                listToSearch = ItemMap_Potions;
                break;
            case ItemType.Wondrous:
                listToSearch = ItemMap_Wondrous;
                break;
            default:
                listToSearch = undefined;
                break;
        }
        
        if (listToSearch !== undefined) {
            for (let i = 0; i < listToSearch.length; i++) {
                let currentItem = listToSearch[i];
                if (currentItem.key === itemKey.key) {
                    item = currentItem;

                    if (itemKey.adjustments) {
                        item.adjustments = itemKey.adjustments
                    }
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
        let masterList: IItemJson[] = [];
        let matchingItems: IItem[] = [];

        // Filter out all empty keywords.
        let nonEmptyKeywords: string[] = keywords.filter(k => !this.IsMatch(k, /\s+/) && k.length > 0);

        // Trim off the whitespace for any keyword.
        nonEmptyKeywords = nonEmptyKeywords.map(k => k.trim());

        masterList = masterList.concat(ItemMap_Armor);
        masterList = masterList.concat(ItemMap_Potions);
        masterList = masterList.concat(ItemMap_Weapons);
        masterList = masterList.concat(ItemMap_Wondrous);

        let filteredItems = masterList.filter(item => nonEmptyKeywords.every(keyword => this.ContainsKeyword(keyword, item)))

        // Verify that the item isn't already in the matching items list.
        filteredItems.forEach(f => {
            // Convert the item first. We need this to access the equality string.
            let converted = this.ConvertJsonToItem(f);

            // If the item can be converted, and the list of existing items does not already include this
            // item, then add it.
            if (converted) {
                matchingItems.push(converted);
            }
        });

        return matchingItems;
    }

    /**
     * Converts a json-able item into an item.
     * @param item The json item to be converted to an item.
     */
    private static ConvertJsonToItem(item: IItemJson): IItem | undefined {
        let constructedItem: IItem | undefined = undefined;

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
        let upperKeyword = keyword.toLocaleUpperCase();
        let doesMatch: boolean = false;
        
        doesMatch = doesMatch || item.key.toLocaleUpperCase().includes(upperKeyword);
        doesMatch = doesMatch || item.type.toLocaleUpperCase().includes(upperKeyword);
        doesMatch = doesMatch || item.title.toLocaleUpperCase().includes(upperKeyword);
        doesMatch = doesMatch || item.description.toLocaleUpperCase().includes(upperKeyword);
        doesMatch = doesMatch || item.details.toLocaleUpperCase().includes(upperKeyword);
        
        doesMatch = doesMatch || (upperKeyword.includes("ATTUNEMENT".toLocaleUpperCase()) && item.requiresAttunement);

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
        let isMatch: boolean = false;

        let match: RegExpMatchArray | null = phrase.match(regex);
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
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
            WeaponProperties.Light
        ],
        itemCopperCost: 10,
        type: ItemType.Weapon,
        attacks: {
            "Whack":
                [
                    {
                        diceCount: 1,
                        diceSize: 4,
                        modifier: 0,
                        damageType: DamageType.Bludgeoning
                    }
                ]
        },
    },
    {
        key: 'Dagger',
        title: 'Dagger',
        description: 'A small piercing weapon.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/dagger.png',
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
            WeaponProperties.Light,
            WeaponProperties.Finesse,
            WeaponProperties.Thrown
        ],
        itemCopperCost: 200,
        type: ItemType.Weapon,
        attacks: {
            "Stab":
                [
                    {
                        diceCount: 1,
                        diceSize: 4,
                        modifier: 0,
                        damageType: DamageType.Piercing
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
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
            WeaponProperties.TwoHanded
        ],
        itemCopperCost: 20,
        type: ItemType.Weapon,
        attacks: {
            "Smash":
                [
                    {
                        diceCount: 1,
                        diceSize: 8,
                        modifier: 0,
                        damageType: DamageType.Bludgeoning
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
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
            WeaponProperties.Light,
            WeaponProperties.Thrown
        ],
        itemCopperCost: 500,
        type: ItemType.Weapon,
        attacks: {
            "Hack":
                [
                    {
                        diceCount: 1,
                        diceSize: 6,
                        modifier: 0,
                        damageType: DamageType.Slashing
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
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 30,
        longRange: 120,
        properties: [
            WeaponProperties.Thrown
        ],
        itemCopperCost: 50,
        type: ItemType.Weapon,
        attacks: {
            "Poke":
                [
                    {
                        diceCount: 1,
                        diceSize: 6,
                        modifier: 0,
                        damageType: DamageType.Piercing
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
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
            WeaponProperties.Light,
            WeaponProperties.Thrown
        ],
        itemCopperCost: 200,
        type: ItemType.Weapon,
        attacks: {
            "Smack":
                [
                    {
                        diceCount: 1,
                        diceSize: 4,
                        modifier: 0,
                        damageType: DamageType.Bludgeoning
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
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
        ],
        itemCopperCost: 500,
        type: ItemType.Weapon,
        attacks: {
            "Smash":
                [
                    {
                        diceCount: 1,
                        diceSize: 6,
                        modifier: 0,
                        damageType: DamageType.Bludgeoning
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
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
            WeaponProperties.Versatile
        ],
        itemCopperCost: 20,
        type: ItemType.Weapon,
        attacks: {
            "Whap (1h)":
                [
                    {
                        diceCount: 1,
                        diceSize: 6,
                        modifier: 0,
                        damageType: DamageType.Bludgeoning
                    }
                ],
            "Whap (2h)":
                [
                    {
                        diceCount: 1,
                        diceSize: 8,
                        modifier: 0,
                        damageType: DamageType.Bludgeoning
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
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
            WeaponProperties.Light
        ],
        itemCopperCost: 100,
        type: ItemType.Weapon,
        attacks: {
            "Slash":
                [
                    {
                        diceCount: 1,
                        diceSize: 4,
                        modifier: 0,
                        damageType: DamageType.Slashing
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
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
            WeaponProperties.Thrown,
            WeaponProperties.Versatile
        ],
        itemCopperCost: 100,
        type: ItemType.Weapon,
        attacks: {
            "Stab (1h)":
                [
                    {
                        diceCount: 1,
                        diceSize: 6,
                        modifier: 0,
                        damageType: DamageType.Piercing
                    }
                ],
            "Stab (2h)":
                [
                    {
                        diceCount: 1,
                        diceSize: 8,
                        modifier: 0,
                        damageType: DamageType.Piercing
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
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
            WeaponProperties.Finesse,
            WeaponProperties.Light
        ],
        itemCopperCost: 1000,
        type: ItemType.Weapon,
        attacks: {
            "Stab":
                [
                    {
                        diceCount: 1,
                        diceSize: 6,
                        modifier: 0,
                        damageType: DamageType.Piercing
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
        source: SourceType.Homebrew,
        requiresAttunement: true,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
            WeaponProperties.TwoHanded
        ],
        itemCopperCost: 10000,
        type: ItemType.Weapon,
        attacks: {
            "Curse":
                [
                    {
                        diceCount: 1,
                        diceSize: 4,
                        modifier: 0,
                        damageType: DamageType.Bludgeoning
                    },
                    {
                        diceCount: 1,
                        diceSize: 4,
                        modifier: 0,
                        damageType: DamageType.Poison
                    }
                ]
        }
    },
    {
        key: 'Darts',
        title: 'Darts',
        description: 'A small thrown weapon.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/dart.png',
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
            WeaponProperties.Finesse,
            WeaponProperties.Thrown
        ],
        itemCopperCost: 5,
        type: ItemType.Weapon,
        attacks: {
            "Throw":
                [
                    {
                        diceCount: 1,
                        diceSize: 4,
                        modifier: 0,
                        damageType: DamageType.Piercing
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
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 80,
        longRange: 230,
        properties: [
            WeaponProperties.Ammunition,
            WeaponProperties.Loading,
            WeaponProperties.TwoHanded
        ],
        itemCopperCost: 2500,
        type: ItemType.Weapon,
        attacks: {
            "Fire":
                [
                    {
                        diceCount: 1,
                        diceSize: 8,
                        modifier: 0,
                        damageType: DamageType.Piercing
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
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 80,
        longRange: 230,
        properties: [
            WeaponProperties.Ammunition,
            WeaponProperties.TwoHanded
        ],
        itemCopperCost: 2500,
        type: ItemType.Weapon,
        attacks: {
            "Fire":
                [
                    {
                        diceCount: 1,
                        diceSize: 6,
                        modifier: 0,
                        damageType: DamageType.Piercing
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
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 30,
        longRange: 120,
        properties: [
            WeaponProperties.Ammunition
        ],
        itemCopperCost: 10,
        type: ItemType.Weapon,
        attacks: {
            "Throw":
                [
                    {
                        diceCount: 1,
                        diceSize: 4,
                        modifier: 0,
                        damageType: DamageType.Bludgeoning
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
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
            WeaponProperties.Versatile
        ],
        itemCopperCost: 100,
        type: ItemType.Weapon,
        attacks: {
            "Slash (1h)":
                [
                    {
                        diceCount: 1,
                        diceSize: 8,
                        modifier: 0,
                        damageType: DamageType.Slashing
                    }
                ],
            "Slash (2h)":
                [
                    {
                        diceCount: 1,
                        diceSize: 10,
                        modifier: 0,
                        damageType: DamageType.Slashing
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
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
            WeaponProperties.Heavy,
            WeaponProperties.Reach,
            WeaponProperties.TwoHanded
        ],
        itemCopperCost: 100,
        type: ItemType.Weapon,
        attacks: {
            "Slash":
                [
                    {
                        diceCount: 1,
                        diceSize: 10,
                        modifier: 0,
                        damageType: DamageType.Slashing
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
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
            WeaponProperties.Versatile
        ],
        itemCopperCost: 1500,
        type: ItemType.Weapon,
        attacks: {
            "Slash (1h)":
                [
                    {
                        diceCount: 1,
                        diceSize: 8,
                        modifier: 0,
                        damageType: DamageType.Slashing
                    }
                ],
            "Slash (2h)":
                [
                    {
                        diceCount: 1,
                        diceSize: 10,
                        modifier: 0,
                        damageType: DamageType.Slashing
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
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
            WeaponProperties.Versatile
        ],
        itemCopperCost: 1500,
        type: ItemType.Weapon,
        attacks: {
            "Slash (1h)":
                [
                    {
                        diceCount: 1,
                        diceSize: 8,
                        modifier: 1,
                        damageType: DamageType.Slashing
                    }
                ],
            "Slash (2h)":
                [
                    {
                        diceCount: 1,
                        diceSize: 10,
                        modifier: 1,
                        damageType: DamageType.Slashing
                    }
                ]
        },
    },
    {
        key: 'Flail',
        title: 'Flail',
        description: 'A spike-studded ball attached to an iron chain.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/Flail_weapon.png',
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
        ],
        itemCopperCost: 1000,
        type: ItemType.Weapon,
        attacks: {
            "Thrash":
                [
                    {
                        diceCount: 1,
                        diceSize: 8,
                        modifier: 0,
                        damageType: DamageType.Bludgeoning
                    }
                ],
        },
    },
    {
        key: 'Greataxe',
        title: 'Greataxe',
        description: 'A massive axe. Used for chopping of trees or tree-like things . . . or fighting.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/Greataxe.png',
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
            WeaponProperties.Heavy,
            WeaponProperties.TwoHanded
        ],
        itemCopperCost: 3000,
        type: ItemType.Weapon,
        attacks: {
            "Greatchop":
                [
                    {
                        diceCount: 1,
                        diceSize: 12,
                        modifier: 0,
                        damageType: DamageType.Slashing
                    }
                ],
        },
    },
    {
        key: 'Greatsword',
        title: 'Greatsword',
        description: 'A massive, mighty, pointy weapon.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/Greatsword.png',
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
            WeaponProperties.Heavy,
            WeaponProperties.TwoHanded
        ],
        itemCopperCost: 5000,
        type: ItemType.Weapon,
        attacks: {
            "Greatslash":
                [
                    {
                        diceCount: 2,
                        diceSize: 6,
                        modifier: 0,
                        damageType: DamageType.Slashing
                    }
                ],
        },
    },
    {
        key: 'Halberd',
        title: 'Halberd',
        description: 'An axe with a very long grip.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/Halberd.png',
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
            WeaponProperties.Heavy,
            WeaponProperties.Reach,
            WeaponProperties.TwoHanded
        ],
        itemCopperCost: 2000,
        type: ItemType.Weapon,
        attacks: {
            "Lunge":
                [
                    {
                        diceCount: 1,
                        diceSize: 10,
                        modifier: 0,
                        damageType: DamageType.Slashing
                    }
                ],
        },
    },
    {
        key: 'Lance',
        title: 'Lance',
        description: 'A conical, metal spear. It also GMs on occasion.',
        details: "Special: You have disadvantage when you use a lance to Attack a target within 5 feet of you. Also, a lance requires two hands to wield when you aren't mounted",
        iconSource: './images/Item_Shop/Items/Weapons/Lance.png',
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
            WeaponProperties.Reach,
            WeaponProperties.Special
        ],
        itemCopperCost: 1000,
        type: ItemType.Weapon,
        attacks: {
            "Pierce":
                [
                    {
                        diceCount: 1,
                        diceSize: 12,
                        modifier: 0,
                        damageType: DamageType.Piercing
                    }
                ],
        },
    },
    {
        key: 'Maul',
        title: 'Maul',
        description: 'A massive, unwieldy hammer.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/Maul.png',
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
            WeaponProperties.Heavy,
            WeaponProperties.TwoHanded
        ],
        itemCopperCost: 1000,
        type: ItemType.Weapon,
        attacks: {
            "Smash":
                [
                    {
                        diceCount: 2,
                        diceSize: 6,
                        modifier: 0,
                        damageType: DamageType.Bludgeoning
                    }
                ],
        },
    },
    {
        key: 'Morningstar',
        title: 'Morningstar',
        description: 'A spike-studded ball attached to a wooden shaft.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/Morningstar.png',
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
        ],
        itemCopperCost: 1500,
        type: ItemType.Weapon,
        attacks: {
            "Smack":
                [
                    {
                        diceCount: 1,
                        diceSize: 8,
                        modifier: 0,
                        damageType: DamageType.Piercing
                    }
                ],
        },
    },
    {
        key: 'Rapier',
        title: 'Rapier',
        description: 'A fancy, dexterous sword.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/Rapier.png',
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
            WeaponProperties.Finesse
        ],
        itemCopperCost: 2500,
        type: ItemType.Weapon,
        attacks: {
            "Stab Fancily":
                [
                    {
                        diceCount: 1,
                        diceSize: 8,
                        modifier: 0,
                        damageType: DamageType.Piercing
                    }
                ],
        },
    },
    {
        key: 'EdwardSteakSauce',
        title: "Edward's Steak Sauce",
        description: 'A magic-infused all-in-one steak sauce.',
        details: "The Edwards Steak Sauce company boasts a successful yet mysterious history. The brain child of one Edward Felm, the all-in-one steak sauce proved itself a massive hit on adventurer shelves across the continent. Its lethally acidic mixture simultaneously cooks, purifies, and tenderizes meat in efficient fashion. When applied to any object (or creature), the sauce deals 2d4 acid damage. Any impacted objects (or creatures) are instantly flavoured with Edward's 11 exotic herb & spice mixture. Impacted objects (or creatures) may be safely consumed after application, for up to 12 hours. If attuned to this bottle, the vial refills magically after a long rest.",
        iconSource: './images/Item_Shop/Items/Potions/SteakSauce.png',
        source: SourceType.Homebrew,
        requiresAttunement: true,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        shortRange: 20,
        longRange: 60,
        properties: [
            WeaponProperties.Finesse
        ],
        itemCopperCost: 1000,
        type: ItemType.Weapon,
        attacks: {
            "Bonk": [
                {
                    diceCount: 1,
                    diceSize: 4,
                    modifier: 0,
                    damageType: DamageType.Bludgeoning
                }
            ],
            "Marinate":
                [
                    {
                        diceCount: 2,
                        diceSize: 4,
                        modifier: 0,
                        damageType: DamageType.Acid
                    }
                ],
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
        source: SourceType.Official,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        hasWithdrawalEffect: false,
        itemCopperCost: 5000,
        type: ItemType.Consumable,
    },
    {
        key: 'SmallMana',
        title: 'Small Mana Potion',
        description: 'A small mana potion.',
        details: 'Restores 1 level 1 spell slot when consumed.',
        iconSource: './images/Item_Shop/Items/Potions/LowManaPotion.png',
        source: SourceType.Homebrew,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        hasWithdrawalEffect: true,
        itemCopperCost: 10000,
        type: ItemType.Consumable,
    },
    {
        key: 'DarkContract',
        title: 'Potion of the Dark Contract',
        description: 'A dark, bubbling brew.',
        details: 'Light that enters the bottle does not return. On consuming this potion, take 2d4 necrotic damage. Your next attack gains bonus damage equal to twice the necrotic damage that you have taken.',
        iconSource: './images/Item_Shop/Items/Potions/DarkContractPotion.png',
        source: SourceType.Homebrew,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        hasWithdrawalEffect: false,
        itemCopperCost: 10000,
        type: ItemType.Consumable,
    },
    {
        key: 'TiamatBrew',
        title: "Tiamat's Brew",
        description: 'A rainbow of shifting colors lives in this bottle.',
        details: "On consumption, cast the Dragon's Breath spell on self.",
        iconSource: './images/Item_Shop/Items/Potions/potion_tiamat.png',
        source: SourceType.Homebrew,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        hasWithdrawalEffect: true,
        itemCopperCost: 10000,
        type: ItemType.Consumable,
    },
    {
        key: 'PoisonousMiasma',
        title: 'Poisonous Miasma',
        description: 'A swirling, toxic potion. The likeness of a long, green, clay snake is enveloped around the bottle.',
        details: 'When used, causes a weapon to deal an additional 2 poison damage to attacks that deal slashing or piercing damage. The effect lasts 1 hour. Application takes 1 minute, and this item is consumed on use.',
        iconSource: './images/Item_Shop/Items/Potions/poison.png',
        source: SourceType.Homebrew,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        hasWithdrawalEffect: false,
        itemCopperCost: 10000,
        type: ItemType.Consumable,
    },
    {
        key: 'BurningMiasma',
        title: 'Burning Miasma',
        description: 'A swirling, heated potion. The likeness of a long, red, clay snake is enveloped around the bottle.',
        details: 'When used, causes a weapon to deal an additional 2 fire damage to attacks that deal slashing or piercing damage. The effect lasts 1 hour. Application takes 1 minute, and this item is consumed on use.',
        iconSource: './images/Item_Shop/Items/Potions/poison_burning.png',
        source: SourceType.Homebrew,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        hasWithdrawalEffect: false,
        itemCopperCost: 10000,
        type: ItemType.Consumable,
    },
    {
        key: 'ElectricMiasma',
        title: 'Electric Miasma',
        description: 'A swirling, shocking potion. The likeness of a long, yellow, clay snake is enveloped around the bottle.',
        details: 'When used, causes a weapon to deal an additional 2 lightning damage to attacks that deal slashing or piercing damage. The effect lasts 24 hours. Application takes 1 minute, and this item is consumed on use.',
        iconSource: './images/Item_Shop/Items/Potions/poison_lightning.png',
        source: SourceType.Homebrew,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        hasWithdrawalEffect: false,
        itemCopperCost: 10000,
        type: ItemType.Consumable,
    },
    {
        key: 'AngelicPotion',
        title: 'Angelic Potion',
        description: 'A large, winged potion. The bottle is miraculously light.',
        details: 'Bubbles rise endlessly from the bottom of the glass. When consumed, heals 2d4+2 hitpoints and grants the user the ability to fly for the next 18 seconds (3 rounds of combat).',
        iconSource: './images/Item_Shop/Items/Potions/AngelicPotion.png',
        source: SourceType.Homebrew,
        requiresAttunement: false,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        hasWithdrawalEffect: true,
        itemCopperCost: 25000,
        type: ItemType.Consumable,
    },
]

const ItemMap_Armor: IItemArmorJson[] = [];

const ItemMap_Wondrous: IItemWondrousJson[] =
[
    {
        key: 'FireyRing',
        title: 'Firey Ring',
        description: 'A golden ring with a ruby fastened to its exterior. The ring is warm to the touch.',
        details: 'Grants the bearer access to the Fire Bolt cantrip. If the user has no spellcasting modifier, they may use their Wisdom modifier.',
        iconSource: './images/Item_Shop/Items/Rings/Ring Jewel Red.png',
        source: SourceType.Homebrew,
        requiresAttunement: true,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        itemCopperCost: 10000,
        type: ItemType.Wondrous,
    },
    {
        key: 'FrigidRing',
        title: 'Frigid Ring',
        description: 'A silver ring with a sapphire fastened to its exterior. The ring is cold to the touch.',
        details: 'Grants the bearer access to the Ray of Frost cantrip. If the user has no spellcasting modifier, they may use their Wisdom modifier.',
        iconSource: './images/Item_Shop/Items/Rings/Ring Silver Jewel Green.png',
        source: SourceType.Homebrew,
        requiresAttunement: true,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        itemCopperCost: 10000,
        type: ItemType.Wondrous,
    },
    {
        key: 'FloralRing',
        title: 'Ring of Floral Accomodation',
        description: 'A silver ring with the likeness of a pink rose fastened to its exterior.',
        details: 'When touched to any surface, that surface will sprout flowers at a rapid pace for the next 6 seconds.',
        iconSource: './images/Item_Shop/Items/Rings/Ring Floral.png',
        source: SourceType.Homebrew,
        requiresAttunement: true,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        itemCopperCost: 5000,
        type: ItemType.Wondrous,
    },
    {
        key: 'BahamutScale',
        title: "Platinum Scale",
        description: 'A shimmering scale from a platinum god.',
        details: "The radiance of this scale permeates even the darkest of caverns. Light reflected off the surface of the scale is visible in all locations save for total darkness. This scale is believed to have fallen from the wings of Bahamut, The Platinum Dragon. On casting the Darkness spell, the darkness aura takes the following properties: * Rather than magical darkness, the aura is magical lightness. This lightness sheds bright light for 15 ft. and dim light for another 15 ft. * Creatures that enter the aura or are within the radius of the aura on cast take 1d4 lightning damage. This damage does not apply to the caster.",
        iconSource: './images/Item_Shop/Items/Wondrous/Scale.gif',
        source: SourceType.Homebrew,
        requiresAttunement: true,
        adjustments: {
            magicBonus: 0,
            isAttuned: false,
            notes: ""
        },
        itemCopperCost: 50000,
        type: ItemType.Wondrous,
    },
]
