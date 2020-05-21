import React, { useEffect, useState } from 'react';
import { IItem } from '../../ItemData/Interfaces/IItem';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { ItemCard } from '../../ItemData/React/ItemCard';
import { ItemClick } from '../../ItemData/Types/CardButtonCallbackTypes/ItemClick';
import { MoneyDisplay } from '../../CharacterInfo/React/MoneyDisplay';
import { ChestState } from '../Enums/ChestState';
import { BagClick } from '../../ItemData/Types/CardButtonCallbackTypes/BagClick';

export interface IChestContentsProps {
    items: IItem[];
    copperCount: number;
    charData: PlayerCharacterData | undefined;
    handleItemClick: ItemClick;
    handleBagClick: BagClick;
    state: ChestState;
}

const _delayBetweenCards: number = 750;
const _delayBetweenAddingMoney: number = 250;

export function ChestContents(props: IChestContentsProps) {
    const [currentCopperCount, setCurrentCopperCount] = useState(0);
    const [doIncrementCopper, setDoIncrementCopper] = useState(false);
    
    let secondsToAddCopper: number = Math.min(Math.log(props.copperCount), 2.0);
    let msToAddCopper: number = Math.floor(secondsToAddCopper * 1000);
    let numberOfIncrements: number = Math.floor(msToAddCopper /_delayBetweenAddingMoney);
    let copperToIncrement: number = Math.floor(props.copperCount / numberOfIncrements);

    ChestItemStatics.ChestItemAppearAudio.volume = 0.1;
    ChestItemStatics.ChestCoinAudio.volume = 0.1;

    // Handle immediately displaying some things once this component has loaded. Only once though!
    useEffect(() => {
        for(let i: number = 0; i < props.items.length; i++) {
            let soundDelay = _delayBetweenCards * i;
            setTimeout(() => ChestItemStatics.ChestItemAppearAudio.play(), soundDelay);
        }

        // Don't start adding money until we've finished display ALL THE CARDS!
        let timeToAddMoolah = props.items.length * _delayBetweenCards;
        setTimeout(() => setDoIncrementCopper(true), timeToAddMoolah);
    }, []);

    // Increment that copper real slow-like. It adds drama!
    useEffect(() => {
        if (currentCopperCount < props.copperCount && doIncrementCopper) {
            let newCopperCount = Math.min(props.copperCount, currentCopperCount + copperToIncrement);
            setTimeout(() => {
                setCurrentCopperCount(newCopperCount)
                ChestItemStatics.ChestCoinAudio.play();
            }, _delayBetweenAddingMoney);
        }
    }, [currentCopperCount, doIncrementCopper]);

    return (
        <div className="chest-contents">
            <div className="chest-items">
                {GetItemCards(props.items, props.handleItemClick, props.handleBagClick)}
            </div>
            <MoneyDisplay
                copperCount={currentCopperCount}
                hideEmptyCurrencies={true}
            />
        </div>
    )
}


function GetItemCards(items: IItem[], handleItemClick: ItemClick, handleBagClick: BagClick): JSX.Element[] {
    let itemElements: JSX.Element[] = [];

    items.forEach((item, index) => {
        let animationDelay = _delayBetweenCards * index;

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
                    onBagButton={handleBagClick}
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
    public static readonly ChestCoinAudio = new Audio("./sounds/chestCoin.wav");
}
