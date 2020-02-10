import React from 'react';
import { TAddClick } from '../../../Types/CardButtonCallbackTypes/TAddClick';
import { IItem } from '../../../Interfaces/IItem';

interface IAddButtonProps {
    item: IItem;
    cardIconSize: number;
    callbackFunction: TAddClick;
}

export function AddButton(props: IAddButtonProps) {
    return (
        <div
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
        </div>
    )
}
