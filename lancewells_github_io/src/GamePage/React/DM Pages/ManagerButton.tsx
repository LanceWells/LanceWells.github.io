import './ManagerButton.css';

import React from 'react';

interface IManagerButtonProps {
    HandleButtonCallback: () => void;
    ButtonTitle: string;
    ButtonColor: string;
}

export function ManagerButton(props: IManagerButtonProps) {
    return (
        <button
            className="manager-button"
            onClick={props.HandleButtonCallback}style={{
                backgroundColor:props.ButtonColor
            }}>
            <h5>{props.ButtonTitle}</h5>
        </button>
    )
}
