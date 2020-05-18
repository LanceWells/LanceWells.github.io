import React from 'react';
import { IItem } from '../../Interfaces/IItem';
import { AttuneClick } from '../../Types/CardButtonCallbackTypes/AttuneClick';
import { UnattuneClick } from '../../Types/CardButtonCallbackTypes/UnattuneClick';

enum AttuneButtonOption {
    Attune = "Attune",
    Unattune = "Attuned!",
    SlotsFull = "Full attunements!"
}

interface IAttuneButtonProps {
    item: IItem;
    cardIconSize: number;
    availableAttunementSlots: number;
    attuneCallback: AttuneClick;
    unattuneCallback: UnattuneClick;
}

export function AttuneButton(props: IAttuneButtonProps) {
    let itemIsAttuned: boolean = props.item.adjustments.isAttuned;
    let buttonOption: AttuneButtonOption = itemIsAttuned ? AttuneButtonOption.Unattune : AttuneButtonOption.Attune;

    if (props.availableAttunementSlots <= 0 && !itemIsAttuned) {
        buttonOption = AttuneButtonOption.SlotsFull;
    }

    let buttonDisabled = buttonOption === AttuneButtonOption.SlotsFull;

    // Give attuned buttons a special color. Something that's obvious, but neutral.
    let buttonColorClass: string = buttonOption === AttuneButtonOption.Unattune ? "neutral-button" : "";

    return (
        <button
            onClick={() => HandleButtonPress(buttonOption, props.item, props.attuneCallback, props.unattuneCallback)}
            className={`card-button ${buttonColorClass}`}
            disabled={buttonDisabled}
            >
            <img
                alt="attunement button icon"
                className="card-button-icon"
                src='./images/Item_Shop/ItemCards/Icons/Button_Attune.png'
                width={props.cardIconSize}
                height={props.cardIconSize}
                style={{
                    left: `-${props.cardIconSize / 2}px`
                }} />
            <div className="card-button-name">
                {buttonOption}
            </div>
        </button>
    );
}

function HandleButtonPress(
    buttonOption: AttuneButtonOption,
    item: IItem,
    attuneCallback: AttuneClick,
    unattuneCallback: UnattuneClick) {

    switch (buttonOption) {
        case AttuneButtonOption.Attune: {
            attuneCallback(item);
            break;
        }
        case AttuneButtonOption.Unattune: {
            unattuneCallback(item);
            break;
        }
        default: {
            break;
        }
    }
}
