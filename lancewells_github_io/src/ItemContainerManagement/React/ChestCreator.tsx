import '../css/ContainerManager.css';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { IItem } from '../../ItemData/Interfaces/IItem';
import { ItemContainerCreator } from './ItemContainerCreator';
import { ChestTypes } from '../../Chests/Enums/ChestTypes';
import { GameRoomService } from '../../FirebaseAuth/Classes/GameRoomService';
import { ChestData } from '../../Chests/Types/ChestData';
import { LoadingPlaceholder } from '../../Utilities/React/LoadingPlaceholder';

export interface IChestCreatorProps {
}

export function ChestCreator(props: IChestCreatorProps) {
    const [stagedItems, setStagedItems] = useState<IItem[]>([]);
    const [ChestTitle, setChestTitle] = useState("");
    const [ChestType, setChestType] = useState(ChestTypes.Wooden);
    const [copperInChest, setCopperInChest] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [canCreateChest, setCanCreateChest] = useState(false);
    const [creatingChest, setCreatingChest] = useState(false);
    const [ChestLink, setChestLink] = useState("");

    function HandleStagedItemsChanged(items: IItem[]): void {
        setStagedItems(items);
    }

    function HandleChestNameChange(event: ChangeEvent<HTMLInputElement>): void {
        let input = event?.target.value;

        // if (input) will not trigger if input is an empty string.
        if (input !== undefined && input !== null) {
            if (!/^[\w \-!~.,]*$/.test(input)) {
                setErrorMessage("Chest names may only use alphanumerics, spaces, and the following: [-!~.,]");
                setCanCreateChest(false);
            }
            else {
                setErrorMessage("");
                setCanCreateChest(true);
            }

            setChestTitle(input);
        }
    }

    function HandleChestTypeChange(event: ChangeEvent<HTMLSelectElement>): void {
        let input = event?.target.value;

        // if (input) will not trigger if input is an empty string.
        if (input !== undefined && input !== null) {
            if (input as ChestTypes) {
                setChestType(input as ChestTypes);
            }
        }
    }

    function HandleCopperInput(event: ChangeEvent<HTMLInputElement>) {
        let input = event.target?.value;

        // https://stackoverflow.com/questions/23437476/in-typescript-how-to-check-if-a-string-is-numeric
        if(input) {
            let inputAsNumber: number = Number(input);
            if (!isNaN(inputAsNumber)) {
                setCopperInChest(inputAsNumber);
            }
        }
    }

    function HandleSubmitChest(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setCreatingChest(true);

        let ChestData: ChestData = {
            ID: "undefined",
            Name: ChestTitle,
            CopperInChest: copperInChest,
            ChestType: ChestType,
            Items: stagedItems
        };

        GameRoomService.CreateChest(ChestData)
            .then(ChestResponse => {
                if (ChestResponse && ChestResponse.ID) {
                    let hostName: string = window.location.host;
                    let ChestUrl: string = `http://${hostName}/#/chest/${ChestResponse.ID}`;
                    setChestLink(ChestUrl);
                }
                setCreatingChest(false);
            })
            .catch(reason => {
                console.error(reason);
                setErrorMessage("There was a problem making that Chest. Check for error messages and try again.");
                setCreatingChest(false);
            });
    }

    return (
        <div className="container-manager">
            <form
                className="container-manager-form"
                onSubmit={HandleSubmitChest}
            >
                <h1>Chest</h1>
                <span className="container-manager-error-message">{errorMessage}</span>
                <h5 className="Chest-form-title">Chest Name</h5>
                <input
                    className="container-manager-field"
                    type="text"
                    name="Chest Name"
                    onInput={HandleChestNameChange}
                />
                <br /><br />
                <h5 className="Chest-form-title">ChestType</h5>
                <select
                    className="container-manager-field"
                    id="ChestTypes"
                    name="ChestTypes"
                    value={ChestTypes.Wooden}
                    onChange={HandleChestTypeChange}
                >
                    {GetChestTypeOptions()}
                </select>
                <input
                    type="number"
                    id="containerCreatorMoney"
                    name="containerCreatorMoney"
                    className="container-manager-money"
                    onChange={HandleCopperInput}
                />
                <br /><br />
                <LoadingPlaceholder
                    showSpinner={creatingChest}
                    role="Creating Chest Status">
                    <input
                        className="container-manager-field"
                        type="submit"
                        value="Create Chest"
                        disabled={!canCreateChest}
                    />
                </LoadingPlaceholder>
                <div
                    className="container-manager-link"
                    style={{ visibility: ChestLink === "" ? "hidden" : "visible" }}>
                    <span>Successfully created a Chest! </span>
                    <a href={ChestLink}>Here's the link.</a>
                </div>
            </form>
            <ItemContainerCreator
                handleStagedItemsUpdated={HandleStagedItemsChanged}
            />
        </div>
    );
}

function GetChestTypeOptions(): JSX.Element[] {
    let ChestType: ChestTypes[] = Object.values(ChestTypes);
    let options: JSX.Element[] = ChestType.map(o => {
        return (
            <option key={o} value={o}>{o}</option>
        );
    });

    return options;
}
