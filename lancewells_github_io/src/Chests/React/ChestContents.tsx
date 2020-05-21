import React, { useEffect, useState } from 'react';
import { IItem } from '../../ItemData/Interfaces/IItem';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { ItemCard } from '../../ItemData/React/ItemCard';
import { ItemClick } from '../../ItemData/Types/CardButtonCallbackTypes/ItemClick';
import { MoneyDisplay } from '../../CharacterInfo/React/MoneyDisplay';
import { ChestState } from '../Enums/ChestState';
import { AddCopperClick } from '../Types/AddCopperClick';
import { BagClick } from '../../ItemData/Types/CardButtonCallbackTypes/BagClick';
import { AddCopperSlider } from './AddCopperSlider';

export interface IChestContentsProps {
    items: IItem[];
    copperCount: number;
    charData: PlayerCharacterData | undefined;
    handleItemClick: ItemClick;
    handleBagClick: BagClick;
    handleAddCopper: AddCopperClick;
    state: ChestState;
}

const _delayBetweenCards: number = 750;
const _delayBetweenAddingMoney: number = 250;

export function ChestContents(props: IChestContentsProps) {
    const [currentCopperCount, setCurrentCopperCount] = useState(0);
    const [incrementingCopper, setIncrementingCopper] = useState(false);
    const [enableSlider, setEnableSlider] = useState(false);
    
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
        let timeToEnableSlider = timeToAddMoolah + msToAddCopper + _delayBetweenCards;
        setTimeout(() => setIncrementingCopper(true), timeToAddMoolah);
        setTimeout(() => setEnableSlider(true), timeToEnableSlider);
    }, []);

    // Increment that copper real slow-like. It adds drama!
    useEffect(() => {
        if (currentCopperCount < props.copperCount && incrementingCopper) {
            let newCopperCount = Math.min(props.copperCount, currentCopperCount + copperToIncrement);
            setTimeout(() => {
                setCurrentCopperCount(newCopperCount)
                ChestItemStatics.ChestCoinAudio.play();
            }, _delayBetweenAddingMoney);
        }
    }, [currentCopperCount, incrementingCopper]);

    // This is a little funny, I don't particularly like it. If we've already enabled the slider, and
    // we now have a different copper value coming from our props, that means that the copper count has
    // changed and we need to reflect that. If we don't include this if, then we statically set the copper
    // count as soon as this component mounts, which we don't want.
    useEffect(() => {
        if (enableSlider) {
            setCurrentCopperCount(props.copperCount);
        }
    }, [props.copperCount]);


    let slider: JSX.Element = (<div/>);
    if (enableSlider) {
        slider = (
            <AddCopperSlider
                availableCopper={props.copperCount}
                handleAddCopper={props.handleAddCopper}
            />
        );
    }

    return (
        <div className="chest-contents">
            <div className="chest-items">
                {GetItemCards(props.items, props.handleItemClick, props.handleBagClick)}
            </div>
            <MoneyDisplay
                copperCount={currentCopperCount}
                hideEmptyCurrencies={true}
            />
            {slider}
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
