import React from 'react';
import { UnstageClick } from '../../Types/CardButtonCallbackTypes/UnstageClick';
import { IItem } from '../../Interfaces/IItem';

interface IUnstageButtonProps {
    item: IItem;
    cardIconSize: number;
    callbackFunction: UnstageClick;
}

export function UnstageButton(props: IUnstageButtonProps) {
    return (
        <button
            className="card-button"
            onClick={() => { props.callbackFunction(props.item) }}>
            <img
                alt="Add Button"
                className="card-button-icon"
                src='./images/Item_Shop/ItemCards/Icons/Button_Remove.png'
                width={props.cardIconSize}
                height={props.cardIconSize}
                style={{
                    left: `-${props.cardIconSize / 2}px`
                }} />
            <div className="card-button-name">
                Unstage Item
            </div>
        </button>
    )
}
