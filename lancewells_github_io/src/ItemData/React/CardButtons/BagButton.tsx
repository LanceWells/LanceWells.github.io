import React from 'react';
import { BagClick } from '../../Types/CardButtonCallbackTypes/BagClick';
import { IItem } from '../../Interfaces/IItem';

interface IBagButtonProps {
    item: IItem;
    cardIconSize: number;
    callbackFunction: BagClick;
}

export function BagButton(props: IBagButtonProps) {
    return (
        <button
            className="card-button"
            onClick={() => { props.callbackFunction(props.item) }}>
            <img
                alt="Bag Button"
                className="card-button-icon"
                src='./images/Item_Shop/ItemCards/Icons/Button_Bag.png'
                width={props.cardIconSize}
                height={props.cardIconSize}
                style={{
                    left: `-${props.cardIconSize / 2}px`
                }} />
            <div className="card-button-name">
                Add To Bag
            </div>
        </button>
    )
}
