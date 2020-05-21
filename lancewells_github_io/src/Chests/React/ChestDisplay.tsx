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
import { CharacterStateManager } from '../../FirebaseAuth/Classes/CharacterStateManager';
import { BagClick } from '../../ItemData/Types/CardButtonCallbackTypes/BagClick';
import { DnDConstants } from '../../Utilities/Classes/DndConstants';
import { Toast } from 'react-bootstrap';

export interface IChestDisplayProps {
    chestData: ChestData;
    charData: PlayerCharacterData | undefined;
}

export function ChestDisplay(props: IChestDisplayProps) {
    const [chestState, setChestState] = useState(ChestState.ChestFalling);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [focusedItem, setFocusedItem] = useState<IItem>(new ItemWondrous());
    const [availableItems, setAvailableItems] = useState<IItem[]>(props.chestData.Items);
    const [toastText, setToastText] = useState<string | undefined>(undefined);
    const [showToast, setShowToast] = useState(false);

    ChestDisplayStatics.FallingChestAudio.volume = 0.1;
    ChestDisplayStatics.LandedChestAudio.volume = 0.1;
    ChestDisplayStatics.OpeningChestAudio.volume = 0.1;
    ChestDisplayStatics.ChestBagItemAudio.volume = 0.1;
    
    // The chest should be "falling" once in the room. Set it to land and be clickable after a set amount of
    // time.
    useEffect(() => {
        ChestDisplayStatics.FallingChestAudio.play();
        setTimeout(() => {
            setChestState(ChestState.ChestReadyToOpen)
            ChestDisplayStatics.LandedChestAudio.play();
        }, 1500);
    }, [])

    useEffect(() => {
        if (toastText) {
            // display the toast.
            HandleShowToast();
        }
    }, [toastText]);

    function HandleShowToast(): void {
        setShowToast(true);
    }

    function HandleHideToast(): void {
        setShowToast(false);
        setToastText(undefined);
    }

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

    function HandleBagItem(item: IItem): void {
        let cData = props.charData;
        if (cData) {
            // Go ahead and add the item first.
            cData.Items.push(item);
            CharacterStateManager.GetInstance().UploadCharacterData(cData);
            ChestDisplayStatics.ChestBagItemAudio.play();
            setToastText(item.title + " added to the bag!");

            // First, freshen up those items! Otherwise, when we use the JSON stringify to compare, we will
            // get a slew of other, nonsense stuff related to things are not in ItemKey.
            let itemAsFreshKey = DnDConstants.GetItemAsFreshItemKey(item);
            let availableItemsAsFreshKeys = DnDConstants.GetItemsAsFreshKeys(availableItems);

            // This is a little verbose, but it makes debugging easier!
            let jsonOfItemToRemove: string = JSON.stringify(itemAsFreshKey);
            let allItemsAsJson: string[] = availableItemsAsFreshKeys.map(i => JSON.stringify(i));

            let itemToRemove = allItemsAsJson.findIndex(i => i === jsonOfItemToRemove);

            if (itemToRemove > -1) {
                availableItems.splice(itemToRemove, 1);

                // Force a re-render!
                setAvailableItems(availableItems);
            }
        }
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
            {GetChestContents(chestState, props.chestData.CopperInChest, availableItems, props.charData, HandleItemClick, HandleBagItem)}
            <ChestButton
                state={chestState}
                onClick={HandleChestClick}
            />
            <div className="chest-toast-container">
                <Toast onClose={HandleHideToast} show={showToast} delay={3000} autohide>
                    <Toast.Body>{toastText}</Toast.Body>
                </Toast>
            </div>
        </div>
    );
}

function GetChestContents(chestState: ChestState, copper: number, items: IItem[], charData: PlayerCharacterData | undefined, handleItemClick: ItemClick, handleBagClick: BagClick): JSX.Element {
    let contents = (<div />);
    if (chestState === ChestState.ChestOpening) {
        contents = (
            <ChestContents
                items={items}
                copperCount={copper}
                charData={charData}
                handleItemClick={handleItemClick}
                handleBagClick={handleBagClick}
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
    public static readonly ChestBagItemAudio = new Audio("./sounds/chestBagItem.wav");
} 
