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
    return items.map(i => 
        <ItemCard
            key={i.title}
            itemDetails={i}
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
    );
}
