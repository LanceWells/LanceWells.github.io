import React, { ChangeEvent } from 'react';
import { DMGameRoom } from '../../Classes/DMGameRoom';
import { ItemShopIcon } from './ItemShopIcon';
import { ItemFilter } from './ItemFilter';
import { IItem } from '../../../Items/Interfaces/IItem';
import { ShopStage } from './ShopStage';
import { ManagerButton } from './ManagerButton';
import { TShopTab } from '../../Types/TShopTab';

interface IItemShopManagerProps {
    DmGameRoom: DMGameRoom;
    AddNewShopCallback: (shopTab: TShopTab) => void;
}

interface IItemShopManagerState {
    _currentView: ShopManagementState;
    _stagedItemsToAdd: IItem[];
    _nameErrors: string[];
}

type ShopManagementState = "Viewing" | "Creating";

export class ItemShopManager extends React.Component<IItemShopManagerProps, IItemShopManagerState> {
    private _iconWidth: number = 64;
    private _iconHeight: number = 64;
    private _maxItemsDesc: number = 4;
    private _shopName: string = "";

    /**
     * Creates a new instance of this class.
     * @param props The set of properties needed to create a new instance of this class.
     */
    public constructor(props: IItemShopManagerProps) {
        super(props);
        this.state = {
            _currentView: "Creating",
            _stagedItemsToAdd: [],
            _nameErrors: []
        }
    }

    /**
     * The public render method for this react component.
     */
    public render() {
        return (
            <div className="shopmgr">
                {this.GetView()}
            </div>
        );
    }

    /**
     * Validates that the currently-input shop name is valid. If there are any errors, displays them on
     * the GUI.
     */
    private ValidateShopName(): boolean {
        var nameIsValid: boolean = true;
        var errors: string[] = [];

        if (this._shopName.length <= 0) {
            errors.push("Shop names must be at least 1 character in length.");
            nameIsValid = false;
        }
        if (!/^[\w \-!~.,]*$/.test(this._shopName)) {
            errors.push("Shop names may only use alphanumerics, spaces, and the following: [-!~.,]")
            nameIsValid = false;
        }

        // We did a validation, so display that to the user.
        this.setState({
            _nameErrors: errors
        });

        return nameIsValid;
    }

    /**
     * Gets the view for this component based on its current state.
     */
    private GetView(): JSX.Element {
        switch (this.state._currentView) {
            case "Viewing":
                {
                    return (
                        <div className="shopmgr-shops">
                            <ManagerButton
                                HandleButtonCallback={this.HandleCreateShop.bind(this)}
                                ButtonTitle="Create A New Shop"
                                ButtonColor="#1e6f50"
                            />
                            {this.GetShopIcons()}
                        </div>
                    );
                }
            case "Creating":
                {
                    return (
                        <div className="shopmgr-container">
                            <div className="shopmgr-name-container">
                                <h4>Shop Name:</h4>
                                <input
                                    onChange={this.HandleShopNameInput.bind(this)}
                                    className="shopmgr-name"
                                />
                                <p
                                    className="shopmgr-name-errors">
                                    {this.state._nameErrors.join("\n")}
                                </p>
                            </div>
                            <div className="shopmgr-create-buttons">
                                <ManagerButton
                                    HandleButtonCallback={this.HandleCancelShop.bind(this)}
                                    ButtonTitle="Cancel Shop"
                                    ButtonColor="#891e2b"
                                />
                                <ManagerButton
                                    HandleButtonCallback={this.HandleConfirmShop.bind(this)}
                                    ButtonTitle="Create Shop"
                                    ButtonColor="#1e6f50"
                                />
                            </div>
                            <div className="shopmgr-create-container">
                                <ItemFilter
                                    _addItemCallback={this.HandleStageItem.bind(this)}
                                />
                                <ShopStage
                                    _stagedItems={this.state._stagedItemsToAdd}
                                    _handleRemoveCallback={this.HandleRemoveItem.bind(this)}
                                />
                            </div>
                        </div>
                    );
                }
        }
    }

    /**
     * Handles a user event to create a new shop.
     */
    private HandleCreateShop(): void {
        this.setState({
            _currentView: "Creating"
        });
    }

    /**
     * Handles a user event to confirm a shop's creation.
     */
    private HandleConfirmShop(): void {
        if (this.ValidateShopName()) {
            var newShop: TShopTab = {
                ID: "",
                Name: this._shopName,
                ShopKeeper: "Indigo",
                Items: this.state._stagedItemsToAdd
            }

            this.props.AddNewShopCallback(newShop);
        }
    }

    /**
     * Handles a user event to cancel a shop's creation.
     */
    private HandleCancelShop(): void {
        this.setState({
            _stagedItemsToAdd: [],
            _currentView: "Viewing"
        });
    }

    /**
     * Handles staging an item to a new item shop.
     * @param item The item to be staged.
     */
    private HandleStageItem(item: IItem): void {
        console.log("Staging item: " + item.GetEqualityString());

        var newStagedItems = this.state._stagedItemsToAdd;
        newStagedItems.push(item);

        this.setState({
            _stagedItemsToAdd: newStagedItems
        });
    }

    /**
     * Handles de-staging an item from the item shop.
     * @param item The item to be de-staged.
     */
    private HandleRemoveItem(item: IItem): void {
        console.log("Removing item: " + item.GetEqualityString());

        var indexToRemove: number | undefined = undefined;

        for (let i = 0; i < this.state._stagedItemsToAdd.length; i++) {
            if (this.state._stagedItemsToAdd[i].GetEqualityString() === item.GetEqualityString())
            {
                indexToRemove = i;
            }
        }

        if (indexToRemove !== undefined) {
            var newStagedItems = this.state._stagedItemsToAdd;
            newStagedItems.splice(indexToRemove, 1);

            this.setState({
                _stagedItemsToAdd: newStagedItems
            });
        }
    }

    /**
     * Handles user input into the shop name input field.
     * @param event The event that has details about the input for the shop name.
     */
    private HandleShopNameInput(event: ChangeEvent<HTMLInputElement>) {
        var input = event?.target.value;
        if (input !== null) {
            this._shopName = input;
        }
    }

    /**
     * Gets a set of shop icons to display each known shop.
     */
    private GetShopIcons(): JSX.Element[] {
        return (this.props.DmGameRoom.Shops.map(shop => {
            return (
                <ItemShopIcon
                    _shopTab={shop}
                    _maxItemsInTooltip={this._maxItemsDesc}
                    _width={this._iconWidth}
                    _height={this._iconHeight}
                />
            )
        }));
    }
}
