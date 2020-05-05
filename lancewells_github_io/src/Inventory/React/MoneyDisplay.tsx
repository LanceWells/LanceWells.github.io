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
                <span>Platinum: {moneyCount.Platinum}</span>
                <span>Gold: {moneyCount.Gold}</span>
                <span>Silver: {moneyCount.Silver}</span>
                <span>Copper: {moneyCount.Copper}</span>
            </div>
        );
    }
}
