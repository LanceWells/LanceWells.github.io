import '../css/ItemFilter.css';

import React, { ChangeEvent, useState } from 'react';
import { ItemSource } from '../../ItemData/Classes/ItemSource';
import { ItemCard } from '../../ItemData/React/ItemCard';
import { StageClick } from '../../ItemData/Types/CardButtonCallbackTypes/StageClick';
import { CardInteractions } from '../../ItemData/Enums/CardInteractions';
import { ItemClick } from '../../ItemData/Types/CardButtonCallbackTypes/ItemClick';

interface IItemFilterProps {
    onItemStaged: StageClick;
    onItemClick: ItemClick;
}

export function ItemFilter(props: IItemFilterProps) {
    const [searchKeywords, setSearchKeywords] = useState<string[]>([]);

    function HandleSearchInput(event: ChangeEvent<HTMLInputElement>) {
        let input = event?.target.value;

        // if (input) will not trigger if input is an empty string.
        if (input !== undefined && input !== null) {
            let keywords: string[] = input.split(' ');
            setSearchKeywords(keywords);
        }
    }

    return (
        <div className="item-filter-container item-staging-container">
            <h5 className="item-staging-title">Available Items</h5>
            <div className="item-filter-search">
                <input
                    placeholder="Search Items"
                    type="text"
                    className='item-filter'
                    name="item filter"
                    onInput={HandleSearchInput} />
            </div>
            <div className="card-staging">
                {GetCards(searchKeywords, props.onItemStaged, props.onItemClick)}
            </div>
        </div>
    );
}

function GetCards(keywords: string[], handleStageItem: StageClick, onItemClick: ItemClick): JSX.Element[] {
    let items = ItemSource.SearchItems(keywords);
    return items.map(i => {
        return (
            <ItemCard
                itemDetails={i}
                onItemClick={onItemClick}
                onAttackButton={undefined}
                onPurchaseButton={undefined}
                onStageButton={handleStageItem}
                onUnstageButton={undefined}
                onAttuneButton={undefined}
                onUnattuneButton={undefined}
                cardInteractions={[CardInteractions.Stage]}
                showCardCost={true}
                availablePlayerCopper={undefined}
                availableAttunementSlots={undefined}
            />
        );
    });
}
