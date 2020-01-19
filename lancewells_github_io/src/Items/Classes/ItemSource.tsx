import { ItemWeapon, IItemWeaponJson, IItemIsItemWeapon } from "./ItemWeapon";
import { ItemPotion, IItemPotionJson, IItemIsItemPotion } from './ItemPotion';
import { ItemArmor, IItemArmorJson, IItemIsItemArmor } from './ItemArmor';
import { ItemWondrous, IItemWondrousJson, IItemIsItemWondrous } from './ItemWondrous';
import { TItemType } from "../Types/TItemType";
import { IItemJson, IItem } from "../Interfaces/IItem";
import * as AWS from 'aws-sdk';

/**
 * @description A class used to fetch items based on a specific index and call.
 * 
 * In future, recall that this link explains how to self-initialize:
 * https://basarat.gitbooks.io/typescript/docs/tips/staticConstructor.html
 */
export class ItemSource {
    private readonly _tableName: string = 'LantsPants.Items'

    private static instance: ItemSource;

    private DynamoDb: AWS.DynamoDB;

    private constructor() {
        AWS.config.update({
            region: 'us-east-2',
            accessKeyId: process.env.REACT_APP_DYNAMO_KEY,
            secretAccessKey: process.env.REACT_APP_DYNAMODB_SECRET_KEY
        })

        this.DynamoDb = new AWS.DynamoDB();





        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#putItem-property
        // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-table-read-write.html
        // This is how to insert a single item!!
        // var putItemParams = {
        //     TableName: this._tableName,
        //     Item: {
        //         'ItemType': { S: "Potion" },
        //         'key': { S: "TestItem" },
        //         'itemJsonData': { S: '{"key":"DarkContract","title":"Potion of the Dark Contract","description":"A dark, bubbling brew.","details":"Light that enters the bottle does not return. On consuming this potion, take 2d4 necrotic damage. Your next attack gains bonus damage equal to twice the necrotic damage that you have taken.","iconSource":"./images/Item_Shop/Items/Potions/DarkContractPotion.png","source":"Homebrew","requiresAttunement":false,"hasWithdrawalEffect":false,"itemCost":100,"type":"Potion"    }' }
        //     }
        // }

        // this.DynamoDb.putItem(putItemParams, function(err, data) {
        //     if (err) {
        //         console.error("AWS Error", err);
        //     } else {
        //         console.log("AWS Success", data);
        //     }
        // });





        // This is how to get a single item!!
        // var getItemParams = {
        //     TableName: this._tableName,
        //     Key: {
        //         'ItemType': {S: 'Weapon'},
        //         'key': {S: 'SnakeStaff'}
        //     },
        //     ProjectionExpression: 'itemJsonData'
        // };

        // var item: ItemWeapon;
        // this.DynamoDb.getItem(getItemParams, function(err, data) {
        //     if (err) {
        //         console.error("AWS Error", err);
        //     } else {
        //         console.log("AWS Success", data.Item);
        //         if (data.Item !== undefined) { // If the items are right, but we didn't get anything, this will return undefined.
        //             var itemContent: string = data.Item.itemJsonData.S as string; // If the projected expression wasn't found as an attribute, but the item was found, then itemJsonData will be undefined.
        //             console.log(itemContent);
        //             var parsedJson = JSON.parse(itemContent);
        //             console.log(parsedJson);
        //             var typedJson = parsedJson as IItemWeaponJson;
        //             console.log(typedJson);
        //             item = ItemWeapon.fromJson(typedJson);
        //             console.log(item);
        //         }
        //     }
        // });

        // var getItemParams = {
        //     TableName: this._tableName,
        //     Key: {
        //         'ItemType': { S: 'Weapon'},
        //         'key': {S: 'SnakeStaff'}
        //     },
        //     ProjectionExpression: 'expressionthatdoesnotexist'
        // };

        // var item: ItemWeapon;
        // this.DynamoDb.getItem(getItemParams, function(err, data) {
        //     if (err) {
        //         console.error("AWS Error", err);
        //     } else {
        //         console.log("AWS Success", data.Item); 
        //         if (data.Item !== undefined) {
        //             var itemContent: string = data.Item.itemJsonData.S as string;
        //             console.log(itemContent);
        //             var parsedJson = JSON.parse(itemContent);
        //             console.log(parsedJson);
        //             var typedJson = parsedJson as IItemWeaponJson;
        //             console.log(typedJson);
        //             item = ItemWeapon.fromJson(typedJson);
        //             console.log(item);
        //         }
        //     }
        // });




    }

    public static GetInstance() {
        if (!ItemSource.instance) {
            ItemSource.instance = new ItemSource();
        }

        return ItemSource.instance;
    }

    /**
     * @description Finds the item under the specified index, and returns that item. If the item cannot be
     * found, returns undefined instead. This function returns undefined such that a caller can determine how
     * to handle the missing element, rather than throw an exception.
     * @param index The index to search for the item.
     * @param type The type of item to search for.
     */
    static GetItem(index: string, type: TItemType): IItem | undefined {
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
        }

        return constructedItem;
    }
}

/**
 * The purpose of the following classes and constants is to act as a proxy for a server. This will likely all
 * go away if/when this software switches to use AWS or something similar.
 */
const ItemMap_Weapons: Array<IItemWeaponJson> =
[
    {
        key: 'Club',
        title: 'Club',
        description: 'A stout bludgeoning weapon made of oak.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/club.png',
        source: "Official",
        requiresAttunement: false,
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
        description: 'A large, double-bladed axe.',
        details: '',
        iconSource: './images/Item_Shop/Items/Weapons/longsword.png',
        source: "Official",
        requiresAttunement: false,
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
        }
    },
]

const ItemMap_Potions: Array<IItemPotionJson> =
[
    {
        key: 'SmallHealing',
        title: 'Small Healing Potion',
        description: 'A small healing potion.',
        details: 'Heals 2d4+2 when consumed.',
        iconSource: './images/Item_Shop/Items/Potions/LowHealthPotion.png',
        source: "Official",
        requiresAttunement: false,
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
        hasWithdrawalEffect: true,
        itemCost: 250,
        type: "Potion",
    },
]

const ItemMap_Armor: Array<IItemArmorJson> = [];

const ItemMap_Wondrous: Array<IItemWondrousJson> =
[
    {
        key: 'FireyRing',
        title: 'Firey Ring',
        description: 'A golden ring with a ruby fastened to its exterior. The ring is warm to the touch.',
        details: 'Grants the bearer access to the Fire Bolt cantrip. If the user has no spellcasting modifier, they may use their Wisdom modifier. Wearing more than one spell-ring at once will cause the user to take 1 level of exhaustion every 10 seconds.',
        iconSource: './images/Item_Shop/Items/Rings/Ring Jewel Red.png',
        source: "Homebrew",
        requiresAttunement: true,
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
        itemCost: 50,
        type: "Wondrous",
    },
]
