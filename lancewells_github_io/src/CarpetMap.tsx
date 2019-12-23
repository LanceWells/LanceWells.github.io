import { IItemDetails } from "./interfaces/IItemDetails";
import { SourceTypes } from "./enums/SourceTypes";
import { ItemType } from "./enums/ItemType";

export type CarpetMap = {
    itemDetails: Array<IItemDetails>;
    rugBorderSource: string;
}

const redRing: IItemDetails = {
    title: 'Ring Jewel Red',
    body: 'Bacon ipsum dolor amet buffalo salami meatball, ribeye sirloin tri-tip pancetta. Doner capicola shankle porchetta drumstick. Chuck tail rump ham buffalo. Leberkas turkey pork loin, pig cow doner kevin landjaeger capicola shankle pork belly flank. Sirloin turkey tenderloin chislic tail spare ribs kielbasa short loin shank burgdoggen. Frankfurter hamburger venison, boudin pork loin turkey salami doner chicken tongue. Turkey ball tip buffalo, ribeye bacon leberkas sirloin cupim short loin venison.',
    iconSource: './images/Item_Shop/Items/Rings/Ring Jewel Red.png',
    source: SourceTypes.official,
    itemCost: 100,
    type: ItemType.wondrous,
};

const greenRing: IItemDetails = {
    title: 'Silver Ring with a Green Jewel',
    body: 'Bacon ipsum dolor amet bacon jowl venison, picanha porchetta salami boudin chicken. Bresaola cow chuck sirloin turducken salami ground round pancetta. Sausage alcatra chislic shankle leberkas bresaola. T-bone venison strip steak corned beef brisket, salami turkey. Kielbasa hamburger brisket pastrami bresaola, beef tail pork chop pork.',
    iconSource: './images/Item_Shop/Items/Rings/Ring Silver Jewel Green.png',
    source: SourceTypes.homebrew,
    itemCost: 1000,
    type: ItemType.armor,
};

export const CarpetMaps: CarpetMap[] = new Array(
    {
        rugBorderSource: "url(/images/Item_Shop/Items/Rings/rug.png)",
        itemDetails: new Array(redRing, greenRing)
    },
    {
        rugBorderSource: "url(/images/Item_Shop/Items/Rings/redrug.png)",
        itemDetails: new Array(redRing, greenRing)
    },
);
