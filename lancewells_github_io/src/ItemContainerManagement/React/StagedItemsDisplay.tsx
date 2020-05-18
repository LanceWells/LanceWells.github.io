import "../css/StagedItemsDisplay.css";

import React from 'react';
import { UnstageClick } from '../../ItemData/Types/CardButtonCallbackTypes/UnstageClick';
import { IItem } from '../../ItemData/Interfaces/IItem';
import { ItemCard } from '../../ItemData/React/ItemCard';
import { CardInteractions } from '../../ItemData/Enums/CardInteractions';
import { ItemClick } from "../../ItemData/Types/CardButtonCallbackTypes/ItemClick";

export interface IStagedItemsDisplayProps {
    stagedItems: IItem[];
    onItemUnstaged: UnstageClick;
    onItemClick: ItemClick;
}

export function StagedItemsDisplay(props: IStagedItemsDisplayProps) {
    return (
        <div className="staged-items-display item-staging-container">
            <h5 className="item-staging-title">Staged Items</h5>
            <div className="card-staging">
                {GetCards(props.stagedItems, props.onItemUnstaged, props.onItemClick)}
            </div>
        </div>
    );
}

function GetCards(items: IItem[], handleUnstageItem: UnstageClick, onItemClick: ItemClick): JSX.Element[] {
    return items.map(i => {
        return (
            <ItemCard
                itemDetails={i}
                onItemClick={onItemClick}
                onAttackButton={undefined}
                onPurchaseButton={undefined}
                onStageButton={undefined}
                onUnstageButton={handleUnstageItem}
                onAttuneButton={undefined}
                onUnattuneButton={undefined}
                cardInteractions={[CardInteractions.Unstage]}
                showCardCost={true}
                availablePlayerCopper={undefined}
                availableAttunementSlots={undefined}
            />
        );
    });
}
