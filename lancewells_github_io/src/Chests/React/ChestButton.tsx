import React from 'react';
import { ChestState } from '../Enums/ChestState';
import { ChestClick } from '../Types/ChestClick';

export interface IChestButtonProps {
    state: ChestState;
    onClick: ChestClick;
}

export function ChestButton(props: IChestButtonProps) {
    let chestImage: string = GetChestImage(props.state);
    let chestCanClick: boolean = props.state === ChestState.ChestReadyToOpen;

    return (
        <button
            className={`chest-button`}
            disabled={!chestCanClick}
            onClick={props.onClick}>
            <img src={chestImage} />
        </button>
    )
}

function GetChestImage(chestState: ChestState): string {
    switch (chestState) {
        case ChestState.ChestFalling: return "./images/Chests/WoodenStaticChest.png";
        case ChestState.ChestReadyToOpen: return "./images/Chests/WoodenBouncingChest.gif";
        case ChestState.ChestOpening: return "./images/Chests/WoodenOpeningChest.gif";
        default: return "./images/Chests/WoodenStaticChest.png";
    }
}
