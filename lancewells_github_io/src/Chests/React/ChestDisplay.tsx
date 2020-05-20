import React, { useState, useEffect } from 'react';
import { ChestData } from '../Types/ChestData';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { ChestState } from '../Enums/ChestState';
import { ChestButton } from './ChestButton';

export interface IChestDisplayProps {
    chestData: ChestData;
    charData: PlayerCharacterData | undefined;
}

export function ChestDisplay(props: IChestDisplayProps) {
    const [chestState, setChestState] = useState(ChestState.ChestFalling);

    ChestDisplayStatics.FallingChestAudio.volume = 0.2;
    ChestDisplayStatics.LandedChestAudio.volume = 0.2;

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
    };

    return (
        <div className="chest-display">
            <ChestButton
                state={chestState}
                onClick={HandleChestClick}
            />
        </div>
    );
}

class ChestDisplayStatics {
    public static readonly FallingChestAudio = new Audio("./sounds/chestFalling.wav");
    public static readonly LandedChestAudio = new Audio("./sounds/chestLand.wav");
}
