import React from 'react';
import { StageClick } from '../../Types/CardButtonCallbackTypes/StageClick';
import { IItem } from '../../Interfaces/IItem';

interface IAddButtonProps {
    item: IItem;
    cardIconSize: number;
    callbackFunction: StageClick;
}

export function StageButton(props: IAddButtonProps) {
    return (
        <button
            className="card-button"
            onClick={() => { props.callbackFunction(props.item) }}>
            <img
                alt="Add Button"
                className="card-button-icon"
                src='./images/Item_Shop/ItemCards/Icons/Button_Add.png'
                width={props.cardIconSize}
                height={props.cardIconSize}
                style={{
                    left: `-${props.cardIconSize / 2}px`
                }} />
            <div className="card-button-name">
                Stage Item
            </div>
        </button>
    )
}
