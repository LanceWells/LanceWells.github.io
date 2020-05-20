import React, { useState, useEffect } from 'react';
import { ChestData } from '../Types/ChestData';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { ChestState } from '../Enums/ChestState';
import { ChestButton } from './ChestButton';
import { ChestContents } from './ChestContents';
import { ItemDetailsModal } from '../../ItemData/React/ItemDetailsModal';
import { IItem } from '../../ItemData/Interfaces/IItem';
import { ItemWondrous } from '../../ItemData/Classes/ItemWondrous';
import { ItemClick } from '../../ItemData/Types/CardButtonCallbackTypes/ItemClick';

export interface IChestDisplayProps {
    chestData: ChestData;
    charData: PlayerCharacterData | undefined;
}

export function ChestDisplay(props: IChestDisplayProps) {
    const [chestState, setChestState] = useState(ChestState.ChestFalling);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [focusedItem, setFocusedItem] = useState<IItem>(new ItemWondrous());

    ChestDisplayStatics.FallingChestAudio.volume = 0.1;
    ChestDisplayStatics.LandedChestAudio.volume = 0.1;
    ChestDisplayStatics.OpeningChestAudio.volume = 0.1;

    // The chest should be "falling" once in the room. Set it to land and be clickable after a set amount of
    // time.
    useEffect(() => {
        ChestDisplayStatics.FallingChestAudio.play();
        setTimeout(() => {
            setChestState(ChestState.ChestReadyToOpen)
            ChestDisplayStatics.LandedChestAudio.play();
        }, 1500);
    }, [])

    function HandleChestClick(): void {
        setChestState(ChestState.ChestOpening);
        ChestDisplayStatics.OpeningChestAudio.play();
    };

    function HandleHideModal(): void {
        setShowDetailsModal(false);
    }

    function HandleItemClick(item: IItem): void {
        setFocusedItem(item);
        setShowDetailsModal(true);
    }

    return (
        <div className="chest-display">
            <ItemDetailsModal
                show={showDetailsModal}
                hideModal={HandleHideModal}
                removeCallback={undefined}
                handleUpdatedItemNotes={undefined}
                itemDetails={focusedItem}
            />
            {GetChestContents(chestState, props.chestData, props.charData, HandleItemClick)}
            <ChestButton
                state={chestState}
                onClick={HandleChestClick}
            />
        </div>
    );
}

function GetChestContents(chestState: ChestState, chestData: ChestData, charData: PlayerCharacterData | undefined, handleItemClick: ItemClick): JSX.Element {
    let contents = (<div />);
    if (chestState === ChestState.ChestOpening) {
        contents = (
            <ChestContents
                items={chestData.Items}
                copperCount={chestData.CopperInChest}
                charData={charData}
                handleItemClick={handleItemClick}
                state={chestState}
            />
        )
    }

    return contents;
}

class ChestDisplayStatics {
    public static readonly FallingChestAudio = new Audio("./sounds/chestFalling.wav");
    public static readonly LandedChestAudio = new Audio("./sounds/chestLand.wav");
    public static readonly OpeningChestAudio = new Audio("./sounds/chestOpening.wav");
}
