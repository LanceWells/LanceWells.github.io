import React, { useState } from 'react';
import { RemoveClick } from '../../Types/CardButtonCallbackTypes/RemoveClick';
import { IItem } from '../../Interfaces/IItem';

interface IRemoveButtonProps {
    item: IItem;
    cardIconSize: number;
    callbackFunction: RemoveClick;
}

export function RemoveButton(props: IRemoveButtonProps) {
    const [readyToDelete, setReadyToDelete] = useState(false);
    const [startedDelete, setStartedToDelete] = useState(false);
    const [progressTimeout, setProgressTimeout] = useState<NodeJS.Timeout>();

    function HandleMouseDown(event: React.MouseEvent) {
        let clearInterval: NodeJS.Timeout = setTimeout(() => {
            setReadyToDelete(true);
        }, 2000);
        
        setStartedToDelete(true);
        setProgressTimeout(clearInterval);
    }

    function HandleMouseUp(event: React.MouseEvent) {
        setStartedToDelete(false);

        if (readyToDelete) {
            props.callbackFunction(props.item);
            setReadyToDelete(false);
        }
        if (progressTimeout) {
            clearInterval(progressTimeout);
        }
    }

    function GetProgressBar(): JSX.Element {
        let content: JSX.Element = (<div/>);

        if (startedDelete) {
            content = (<div className="card-button-progress-bar-red" />);
        }

        return content;
    }

    return (
        <button
            className="card-button"
            onMouseDown={HandleMouseDown}
            onMouseUp={HandleMouseUp}
            >
            <img
                alt="Remove Button"
                className="card-button-icon"
                src='./images/Item_Shop/ItemCards/Icons/Button_Remove.png'
                width={props.cardIconSize}
                height={props.cardIconSize}
                style={{
                    left: `-${props.cardIconSize / 2}px`
                }} />
            {GetProgressBar()}
            <div className={startedDelete ? "card-button-progress-bar-red" : ""}/>
            <div className={`card-button-name ${startedDelete ? "card-button-name-warn" : ""}`}>
                Drop Item
            </div>
        </button>
    )
}
