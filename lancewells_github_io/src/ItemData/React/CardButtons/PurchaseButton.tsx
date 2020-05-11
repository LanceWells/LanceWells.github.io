import React from 'react';
import { PurchaseClick } from '../../Types/CardButtonCallbackTypes/PurchaseClick';
import { IItem } from '../../Interfaces/IItem';
import { MoneyDisplay } from '../../../CharacterInfo/React/MoneyDisplay';

interface IPurchaseButtonProps {
    item: IItem;
    cardIconSize: number;
    callbackFunction: PurchaseClick;
}

interface IPurchaseButtonState {
    canPurchase: boolean;
}

export class PurchaseButton extends React.Component<IPurchaseButtonProps, IPurchaseButtonState> {
    constructor(props: IPurchaseButtonProps) {
        super(props)
        this.state = {
            canPurchase: true
        };
    }

    private GetCustomButtonProperties(): React.CSSProperties {
        let properties: React.CSSProperties = {};
        if (!this.state.canPurchase) {
            properties = {
                background: "#33984b",
                cursor: "default"
            }
        }

        return properties;
    }

    private GetPurchaseStateText(): string {
        return this.state.canPurchase ? "Purchase" : "Purchased!";
    }

    public render() {
        const handleButtonClick = () => {
            if (this.state.canPurchase) {
                this.setState({
                    canPurchase: false
                },
                () => {
                    window.setTimeout(() => {
                        this.setState({
                            canPurchase: true
                        })
                    }, 2500)
                });
                this.props.callbackFunction(this.props.item);
            }
        }

        return (
            <button
                className="card-button"
                style={this.GetCustomButtonProperties()}
                onClick={handleButtonClick}>
                <img
                    alt="card purchase button"
                    className="card-button-icon"
                    src='./images/Item_Shop/ItemCards/Icons/Button_Purchase.png'
                    width={this.props.cardIconSize}
                    height={this.props.cardIconSize}
                    style={{
                        left: `-${this.props.cardIconSize / 2}px`
                    }} />
                <div className="card-button-name" ref="purchase-text">
                    {this.GetPurchaseStateText()}
                </div>
            </button>
        )
    }
}
