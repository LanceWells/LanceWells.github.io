import React from 'react';
import { MoneyConverter } from '../../Inventory/Classes/MoneyConverter';

interface IMoneyDisplayProps {
    playerCopper: number;
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
        let moneyCount: MoneyConverter = new MoneyConverter(this.props.playerCopper);

        return (
            <div className="character-money-display">
                <div className="money-column">
                    <img
                        className='money-icon'
                        src='./images/Inventory/Coin_Platinum.png'/>
                    {moneyCount.Platinum}
                </div>
                <div className="money-column">
                    <img
                        className='money-icon'
                        src='./images/Inventory/Coin_Gold.png' />
                    {moneyCount.Gold}
                </div>
                <div className="money-column">
                    <img
                        className='money-icon'
                        src='./images/Inventory/Coin_Silver.png' />
                    {moneyCount.Silver}
                </div>
                <div className="money-column">
                    <img
                        className='money-icon'
                        src='./images/Inventory/Coin_Copper.png' />
                    {moneyCount.Copper}
                </div>
            </div>
        );
    }
}
