import React from 'react';

interface IMoneyAdjustModalProps {
    /**
     * The die face to show on the die currently.
     */
    dieFace: number;

    /**
     * The color of the die.
     */
    dieColor: string;
}

/**
 * Gets a visual representation of a D20 to show to the user.
 * @param props 
 */
export function DTwenty (props: IMoneyAdjustModalProps) {
    return (
        <div className="attack-die">
            <div className="attack-die-value">
                {props.dieFace}
            </div>
            <svg
                className="roll-window-attack-die"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="56" >
                <path fill={props.dieColor} d="M0 27.712812921102035L16 0L48 0L64 27.712812921102035L48 55.42562584220407L16 55.42562584220407Z"></path>
            </svg>
        </div>
    )
}
