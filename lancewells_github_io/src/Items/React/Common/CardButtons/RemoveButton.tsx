import React from 'react';
import { TRemoveClick } from '../../../Types/CardButtonCallbackTypes/TRemoveClick';
import { IItem } from '../../../Interfaces/IItem';

interface IRemoveButtonProps {
    item: IItem;
    cardIconSize: number;
    callbackFunction: TRemoveClick;
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