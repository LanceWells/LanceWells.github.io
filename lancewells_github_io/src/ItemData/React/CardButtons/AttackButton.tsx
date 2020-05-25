import React from 'react';
import { Attack } from '../../Classes/Attack';
import { AttackClick } from '../../Types/CardButtonCallbackTypes/AttackClick';
import { DamageType } from '../../Enums/DamageType';

interface IAttackButtonProps {
    cardIconSize: number;
    attackName: string;
    attacks: Attack[];
    callbackFunction: AttackClick;
}

export function AttackButton(props: IAttackButtonProps) {
    let attackIndicators: JSX.Element[] = props.attacks.map(roll => {
        let indicators: JSX.Element[] = [];

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
        <button
            className="card-button"
            onClick={() => { props.callbackFunction(props.attackName, props.attacks) }}>
            <img
                alt="Attack Button"
                className="card-button-icon"
                src={AttackButtonStatics.GetAttackIcon(props.attacks)}
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
        </button>
    );
}

class AttackButtonStatics {
    private static readonly _elementalAttacks: DamageType[] = [
        DamageType.Acid,
        DamageType.Cold,
        DamageType.Fire,
        DamageType.Force,
        DamageType.Lightning,
        DamageType.Necrotic,
        DamageType.Poison,
        DamageType.Psychic,
        DamageType.Radiant,
        DamageType.Thunder
    ];

    private static readonly _damageIcons: Map<DamageType, string> = new Map(
        [
            [
                DamageType.Acid,
                "./images/Item_Shop/ItemCards/Icons/DamageIcons/Acid.png"
            ],
            [
                DamageType.Bludgeoning,
                "./images/Item_Shop/ItemCards/Icons/DamageIcons/Bludgeoning.png"
            ],
            [
                DamageType.Cold,
                "./images/Item_Shop/ItemCards/Icons/DamageIcons/Cold.png"
            ],
            [
                DamageType.Fire,
                "./images/Item_Shop/ItemCards/Icons/DamageIcons/Fire.png"
            ],
            [
                DamageType.Force,
                "./images/Item_Shop/ItemCards/Icons/DamageIcons/Force.png"
            ],
            [
                DamageType.Lightning,
                "./images/Item_Shop/ItemCards/Icons/DamageIcons/Lightning.png"
            ],
            [
                DamageType.Necrotic,
                "./images/Item_Shop/ItemCards/Icons/DamageIcons/Necrotic.png"
            ],
            [
                DamageType.Piercing,
                "./images/Item_Shop/ItemCards/Icons/DamageIcons/Piercing.png"
            ],
            [
                DamageType.Poison,
                "./images/Item_Shop/ItemCards/Icons/DamageIcons/Poison.png"
            ],
            [
                DamageType.Psychic,
                "./images/Item_Shop/ItemCards/Icons/DamageIcons/Psychic.png"
            ],
            [
                DamageType.Radiant,
                "./images/Item_Shop/ItemCards/Icons/DamageIcons/Radiant.png"
            ],
            [
                DamageType.Slashing,
                "./images/Item_Shop/ItemCards/Icons/DamageIcons/Slashing.png"
            ],
            [
                DamageType.Thunder,
                "./images/Item_Shop/ItemCards/Icons/DamageIcons/Thunder.png"
            ],
        ]
    )

    public static GetAttackIcon(attacks: Attack[]) {
        let retVal: string = this._damageIcons.get(DamageType.Slashing) as string;
        let attackIcon: string | undefined = undefined;

        attacks.forEach(a => {
            let attackIsElemental = this._elementalAttacks.some(e => e === a.damageType);
            if (attackIsElemental || attackIcon === undefined) {
                attackIcon = this._damageIcons.get(a.damageType);
            }
        });

        if (attackIcon) {
            retVal = attackIcon;
        }

        return retVal;
    }
}