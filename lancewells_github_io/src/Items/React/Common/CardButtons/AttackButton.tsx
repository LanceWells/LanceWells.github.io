import React from 'react';
import { TAttack } from '../../../Types/TAttack';
import { TAttackClick } from '../../../Types/CardButtonCallbackTypes/TAttackClick';

interface IAttackButtonProps {
    cardIconSize: number;
    attackName: string;
    attacks: TAttack[];
    callbackFunction: TAttackClick;
}

export function AttackButton(props: IAttackButtonProps) {
    let attackIndicators: JSX.Element[] = props.attacks.map(roll => {
        var indicators: JSX.Element[] = [];

        for (let i = 0; i < roll.diceCount; i++) {
            indicators.push(
                <span className={`card-button-stat badge-color-${roll.damageType.toLowerCase()}`}>
                    {roll.diceSize}
                </span>
            )
        }

        return (
            <span>
                {indicators}{`${roll.modifier > 0 ? `+${roll.modifier}` : ''}`}
            </span>
        );
    });

    return (
        <div
            className="card-button"
            onClick={() => { props.callbackFunction(props.attackName, props.attacks) }}>
            <img
                alt="Attack Button"
                className="card-button-icon"
                src='./images/Item_Shop/ItemCards/Icons/Button_Attack.png'
                width={props.cardIconSize}
                height={props.cardIconSize}
                style={{
                    left: `-${props.cardIconSize / 2}px`
                }} />
            <div className="card-button-name">
                {props.attackName}
            </div>
            <div className="card-button-stats-container">
                {attackIndicators}
            </div>
        </div>
    )
}
