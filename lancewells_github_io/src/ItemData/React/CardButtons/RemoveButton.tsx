import React from 'react';
import { RemoveClick } from '../../Types/CardButtonCallbackTypes/RemoveClick';
import { IItem } from '../../Interfaces/IItem';

interface IRemoveButtonProps {
    item: IItem;
    cardIconSize: number;
    callbackFunction: RemoveClick;
}

export function RemoveButton(props: IRemoveButtonProps) {
    return (
        <div
            className="card-button"
            onClick={() => { props.callbackFunction(props.item) }}>
            <img
                alt="Remove Button"
                className="card-button-icon"
                src='./images/Item_Shop/ItemCards/Icons/Button_Remove.png'
                width={props.cardIconSize}
                height={props.cardIconSize}
                style={{
                    left: `-${props.cardIconSize / 2}px`
                }} />
            <div className="card-button-name">
                Drop Item
            </div>
        </div>
    )
}
