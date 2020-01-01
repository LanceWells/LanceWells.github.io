import { IItemIndexer } from "../../../Interfaces/IItemIndexer";

export const ItemMap_Potions: IItemIndexer = 
{
    "SmallHealth" : {
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
    "Angelic" : {
        title: 'Angelic Potion',
        body: 'A large, winged potion. The bottle is miraculously light. Bubbles rise endlessly from the bottom of the glass. When consumed, heals 2d4+2 hitpoints and grants the user the ability to fly for the next 18 seconds (3 rounds of combat). Use of this potion will result in a withdrawal effect.',
        iconSource: './images/Item_Shop/Items/Potions/AngelicPotion.png',
        source: "Homebrew",
        itemCost: 250,
        type: "Potion",
    },
}
