import React from 'react';
import { IItem } from '../../ItemData/Interfaces/IItem';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { ItemCard } from '../../ItemData/React/ItemCard';
import { ItemClick } from '../../ItemData/Types/CardButtonCallbackTypes/ItemClick';
import { MoneyDisplay } from '../../CharacterInfo/React/MoneyDisplay';
import { ChestState } from '../Enums/ChestState';

export interface IChestContentsProps {
    items: IItem[];
    copperCount: number;
    charData: PlayerCharacterData | undefined;
    handleItemClick: ItemClick;
    state: ChestState;
}

export function ChestContents(props: IChestContentsProps) {

    ChestItemStatics.ChestItemAppearAudio.volume = 0.1;

    return (
        <div className="chest-contents">
            <div className="chest-items">
                {GetItemCards(props.items, props.handleItemClick)}
            </div>
            <MoneyDisplay
                copperCount={props.copperCount}
                hideEmptyCurrencies={true}
            />
        </div>
    )
}


function GetItemCards(items: IItem[], handleItemClick: ItemClick): JSX.Element[] {
    let itemElements: JSX.Element[] = [];

    items.forEach((item, index) => {
        let animationDelay = 750 * index;
        
        // This is a little weird. Yet, we should only be calling this function on a successful render, so it
        // makes sense to tie in the audio cue with this feature.
        setTimeout(() => ChestItemStatics.ChestItemAppearAudio.play(), animationDelay);

        itemElements.push(
            <div className="fadingCardContainer"
                style={{
                    animationDelay: `${animationDelay}ms`
                }}>
                <ItemCard
                    key={index + item.title}

                    itemDetails={item}
                    onItemClick={handleItemClick}
                    onAttackButton={undefined}
                    onPurchaseButton={undefined}
                    onStageButton={undefined}
                    onUnstageButton={undefined}
                    onAttuneButton={undefined}
                    onUnattuneButton={undefined}
                    cardInteractions={[]}
                    showCardCost={false}
                    availablePlayerCopper={undefined}
                    availableAttunementSlots={undefined}
                />
            </div>
        );
    });

    return itemElements;
}

class ChestItemStatics {
    public static readonly ChestItemAppearAudio = new Audio("./sounds/chestItemAppear.wav");
}
