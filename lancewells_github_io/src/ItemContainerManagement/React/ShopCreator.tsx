import '../css/ShopCreator.css';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { IItem } from '../../ItemData/Interfaces/IItem';
import { ItemContainerCreator } from './ItemContainerCreator';
import { ShopKeepers } from '../../Shops/Types/ShopKeepers';
import { GameRoomService } from '../../FirebaseAuth/Classes/GameRoomService';
import { ItemShopData } from '../../Shops/Types/ItemShopData';
import { LoadingPlaceholder } from '../../Utilities/React/LoadingPlaceholder';

export interface IShopCreatorProps {
}

export function ShopCreator(props: IShopCreatorProps) {
    const [stagedItems, setStagedItems] = useState<IItem[]>([]);
    const [shopTitle, setShopTitle] = useState("");
    const [shopkeeper, setShopkeeper] = useState(ShopKeepers.Indigo);
    const [errorMessage, setErrorMessage] = useState("");
    const [canCreateShop, setCanCreateShop] = useState(false);
    const [creatingShop, setCreatingShop] = useState(false);
    const [shopLink, setShopLink] = useState("");

    function HandleStagedItemsChanged(items: IItem[]): void {
        setStagedItems(items);
    }

    function HandleShopNameChange(event: ChangeEvent<HTMLInputElement>): void {
        let input = event?.target.value;

        // if (input) will not trigger if input is an empty string.
        if (input !== undefined && input !== null) {
            if (!/^[\w \-!~.,]*$/.test(input)) {
                setErrorMessage("Shop names may only use alphanumerics, spaces, and the following: [-!~.,]");
                setCanCreateShop(false);
            }
            else {
                setErrorMessage("");
                setCanCreateShop(true);
            }

            setShopTitle(input);
        }
    }

    function HandleShopkeeperChange(event: ChangeEvent<HTMLSelectElement>): void {
        let input = event?.target.value;

        // if (input) will not trigger if input is an empty string.
        if (input !== undefined && input !== null) {
            if (input as ShopKeepers) {
                setShopkeeper(input as ShopKeepers);
            }
        }
    }

    function HandleSubmitShop(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setCreatingShop(true);

        let shopData: ItemShopData = {
            ID: "undefined",
            Name: shopTitle,
            ShopKeeper: shopkeeper,
            Items: stagedItems
        };

        GameRoomService.CreateShop(shopData)
            .then(shopResponse => {
                if (shopResponse && shopResponse.ID) {
                    let hostName: string = window.location.host;
                    let shopUrl: string = `http://${hostName}/#/shop/${shopResponse.ID}`;
                    setShopLink(shopUrl);
                }
                setCreatingShop(false);
            })
            .catch(reason => {
                console.error(reason);
                setErrorMessage("There was a problem making that shop. Check for error messages and try again.");
                setCreatingShop(false);
            });
    }

    return (
        <div className="shop-creator">
            <form
                className="shop-creator-form"
                onSubmit={HandleSubmitShop}
            >
                <h1>Shop</h1>
                <span className="shop-creator-error-message">{errorMessage}</span>
                <h5 className="shop-form-title">Shop Name</h5>
                <input
                    className="shop-creator-field"
                    type="text"
                    name="Shop Name"
                    onInput={HandleShopNameChange}
                />
                <br /><br />
                <h5 className="shop-form-title">Shopkeeper</h5>
                <select
                    className="shop-creator-field"
                    id="shopkeepers"
                    name="shopkeepers"
                    value={ShopKeepers.Indigo}
                    onChange={HandleShopkeeperChange}
                >
                    {GetShopkeeperOptions()}
                </select>
                <br /><br />
                <LoadingPlaceholder
                    showSpinner={creatingShop}
                    role="Creating Shop Status">
                    <input
                        className="shop-creator-field"
                        type="submit"
                        value="Create Shop"
                        disabled={!canCreateShop}
                    />
                </LoadingPlaceholder>
                <div
                    className="shop-creator-link"
                    style={{ visibility: shopLink === "" ? "hidden" : "visible" }}>
                    <span>Successfully created a shop! </span>
                    <a href={shopLink}>Here's the link.</a>
                </div>
            </form>
            <ItemContainerCreator
                handleStagedItemsUpdated={HandleStagedItemsChanged}
            />
        </div>
    );
}

function GetShopkeeperOptions(): JSX.Element[] {
    let shopKeepers: ShopKeepers[] = Object.values(ShopKeepers);
    let options: JSX.Element[] = shopKeepers.map(o => {
        return (
            <option key={o} value={o}>{o}</option>
        );
    });

    return options;
}
