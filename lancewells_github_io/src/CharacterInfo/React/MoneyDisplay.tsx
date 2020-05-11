import React from 'react';
import { MoneyConverter } from '../../Inventory/Classes/MoneyConverter';

interface IMoneyDisplayProps {
    copperCount: number;
    hideEmptyCurrencies: boolean;
}

interface IMoneyDisplayState {
}

export class MoneyDisplay extends React.Component<IMoneyDisplayProps, IMoneyDisplayState> {
    public constructor(props: IMoneyDisplayProps) {
        super(props);
        this.state = {
        }
    }

    public render() {
        let moneyCount: MoneyConverter = new MoneyConverter(this.props.copperCount);

        return (
            <div className="character-money-display">
                {this.GetMoneyColumns()}
            </div>
        );
    }

    private GetMoneyColumns(): JSX.Element[] {
        let elements: JSX.Element[] = [];
        let moneyCount: MoneyConverter = new MoneyConverter(this.props.copperCount);

        if (moneyCount.Platinum > 0 || !this.props.hideEmptyCurrencies) {
            elements.push(
                <div className="money-column">
                    <img
                        className='money-icon'
                        src='./images/Inventory/Coin_Platinum.png' />
                    {moneyCount.Platinum}
                </div>
            );
        }

        if (moneyCount.Gold > 0 || !this.props.hideEmptyCurrencies) {
            elements.push(
                <div className="money-column">
                    <img
                        className='money-icon'
                        src='./images/Inventory/Coin_Gold.png' />
                    {moneyCount.Gold}
                </div>
            );
        }

        if (moneyCount.Silver > 0 || !this.props.hideEmptyCurrencies) {
            elements.push(
                <div className="money-column">
                    <img
                        className='money-icon'
                        src='./images/Inventory/Coin_Silver.png' />
                    {moneyCount.Silver}
                </div>
            );
        }

        if (moneyCount.Copper > 0 || !this.props.hideEmptyCurrencies) {
            elements.push(
                <div className="money-column">
                    <img
                        className='money-icon'
                        src='./images/Inventory/Coin_Copper.png' />
                    {moneyCount.Copper}
                </div>
            );
        }

        return elements;
    }
}
