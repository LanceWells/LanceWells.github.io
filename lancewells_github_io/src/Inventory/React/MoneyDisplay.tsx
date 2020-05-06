import React from 'react';
import { MoneyConverter } from '../Classes/MoneyConverter';

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
                <table>
                    <tr>
                        <td>
                            <img src='./images/Inventory/Coin_Platinum.png'/>
                        </td>
                        <td>
                            <img src='./images/Inventory/Coin_Gold.png' />
                        </td>
                        <td>
                            <img src='./images/Inventory/Coin_Silver.png' />
                        </td>
                        <td>
                            <img src='./images/Inventory/Coin_Copper.png' />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {moneyCount.Platinum}
                        </td>
                        <td>
                            {moneyCount.Gold}
                        </td>
                        <td>
                            {moneyCount.Silver}
                        </td>
                        <td>
                            {moneyCount.Copper}
                        </td>
                    </tr>
                </table>
            </div>
        );
    }
}
// <div className="character-money-display">
//     <div>
//         <span>P</span>
//     </div>
//     <span>P: {moneyCount.Platinum}</span>
//     <span>G: {moneyCount.Gold}</span>
//     <span>S: {moneyCount.Silver}</span>
//     <span>C: {moneyCount.Copper}</span>
// </div>