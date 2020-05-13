import '../../css/ItemDetailsModal.css';

import React, { useState } from 'react';
import { RemoveClick } from '../../Types/CardButtonCallbackTypes/RemoveClick';
import { IItem } from '../../Interfaces/IItem';

interface IRemoveButtonProps {
    item: IItem;
    // cardIconSize: number;
    callbackFunction: RemoveClick;
}

export function RemoveButton(props: IRemoveButtonProps) {
    const [readyToDelete, setReadyToDelete] = useState(false);
    const [startedDelete, setStartedToDelete] = useState(false);
    const [progressTimeout, setProgressTimeout] = useState<NodeJS.Timeout>();

    function HandleMouseDown(event: React.MouseEvent) {
        let interval: NodeJS.Timeout = setTimeout(() => {
            setReadyToDelete(true);
        }, 2000);
        
        setStartedToDelete(true);
        setProgressTimeout(interval);
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

    function HandleMouseLeave(event: React.MouseEvent) {
        setReadyToDelete(false);
        setStartedToDelete(false);

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

    let buttonText = readyToDelete ? "Release to delete" : "Drop Item (Press & Hold)";

    return (
        <button
            className="card-button-remove negative-button"
            onMouseDown={HandleMouseDown}
            onMouseUp={HandleMouseUp}
            onMouseLeave={HandleMouseLeave}
            >

            {GetProgressBar()}
            <div className={startedDelete ? "card-button-progress-bar-red" : ""}/>
            <div className={`card-button-remove-name ${startedDelete ? "card-button-name-warn" : ""}`}>
                {buttonText}
            </div>
        </button>
    )
}
