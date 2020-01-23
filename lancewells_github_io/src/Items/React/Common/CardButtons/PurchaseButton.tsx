import React from 'react';
import { TPurchaseClick } from '../../../Types/CardButtonCallbackTypes/TPurchaseClick';
import { IItem } from '../../../Interfaces/IItem';

interface IPurchaseButtonProps {
    item: IItem;
    cardIconSize: number;
    callbackFunction: TPurchaseClick;
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
        var properties: React.CSSProperties = {};
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
            <div
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
                <div className="card-button-stats-container">
                    <div className="card-button-stat"
                        style={{
                            boxShadow: "none"
                        }}>
                        {this.props.item.itemCost}
                    </div>
                    <img
                        alt="coin icon"
                        className="card-button-stat-icon"
                        width={this.props.cardIconSize}
                        height={this.props.cardIconSize}
                        src='./images/Item_Shop/itemCoinStill.png' />
                </div>
            </div>
        )
    }
}
 