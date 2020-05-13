import React, { useState, useEffect } from 'react';
import { PurchaseClick } from '../../Types/CardButtonCallbackTypes/PurchaseClick';
import { IItem } from '../../Interfaces/IItem';

enum PurchaseButtonOption {
    NotEnoughMoney = "Not enough money!",
    CanPurchase = "Purchase",
    Purchased = "Purchased!"
}

interface IPurchaseButtonProps {
    item: IItem;
    cardIconSize: number;
    callbackFunction: PurchaseClick;
    availablePlayerCopper: number | undefined;
}

export function PurchaseButton(props: IPurchaseButtonProps) {
    const [buttonOption, setButtonOption] = useState(PurchaseButtonOption.CanPurchase);

    useEffect(() => {
        if (props.availablePlayerCopper && props.availablePlayerCopper < props.item.itemCopperCost) {
            setButtonOption(PurchaseButtonOption.NotEnoughMoney);
        }
        else if (buttonOption !== PurchaseButtonOption.Purchased) {
            setButtonOption(PurchaseButtonOption.CanPurchase);
        }
    }, [buttonOption, props.availablePlayerCopper]);

    function HandleButtonClick(): void {
        if (buttonOption === PurchaseButtonOption.CanPurchase) {
            props.callbackFunction(props.item);

            setButtonOption(PurchaseButtonOption.Purchased);

            window.setTimeout(() => {
                setButtonOption(PurchaseButtonOption.CanPurchase);
            });
        }
    }

    let styleProperties: React.CSSProperties = GetButtonStyle(buttonOption);

    return (
        <button
            className="card-button"
            style={styleProperties}
            onClick={HandleButtonClick}
            disabled={buttonOption !== PurchaseButtonOption.CanPurchase}>
            <img
                alt="card purchase button"
                className="card-button-icon"
                src='./images/Item_Shop/ItemCards/Icons/Button_Purchase.png'
                width={props.cardIconSize}
                height={props.cardIconSize}
                style={{
                    left: `-${props.cardIconSize / 2}px`
                }} />
            <div className="card-button-name">
                {buttonOption}
            </div>
        </button>
    )
}

function GetButtonStyle(purchaseOption: PurchaseButtonOption): React.CSSProperties {
    let properties: React.CSSProperties = {};
    switch (purchaseOption) {
        case PurchaseButtonOption.Purchased: {
            properties = { background: "#1e6f50" }
            break;
        }
        case PurchaseButtonOption.CanPurchase: {
            properties = {};
            break;
        }
        case PurchaseButtonOption.NotEnoughMoney: {
            properties = { background: "#891e2b" };
            break;
        }
        default: {
            break;
        }
    }

    return properties;
}