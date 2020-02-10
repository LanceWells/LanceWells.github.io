import React from 'react';
import { DMGameRoom } from '../../Classes/DMGameRoom';
import { ItemShopIcon } from './ItemShopIcon';
import { ItemFilter } from './ItemFilter';
import { IItem } from '../../../Items/Interfaces/IItem';
import { ShopStage } from './ShopStage';
import { ManagerButton } from './ManagerButton';

interface IItemShopManagerProps {
    _dmGameRoom: DMGameRoom;
    // AddNewShopCallback
}

interface IItemShopManagerState {
    currentView: ShopManagementState;
    stagedItemsToAdd: IItem[];
}

type ShopManagementState = "Viewing" | "Creating";

export class ItemShopManager extends React.Component<IItemShopManagerProps, IItemShopManagerState> {
    private iconWidth: number = 64;
    private iconHeight: number = 64;
    private maxItemsDesc: number = 4;

    /**
     * Creates a new instance of this class.
     * @param props The set of properties needed to create a new instance of this class.
     */
    public constructor(props: IItemShopManagerProps) {
        super(props);
        this.state = {
            currentView: "Creating",
            stagedItemsToAdd: []
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
     * Gets the view for this component based on its current state.
     */
    private GetView(): JSX.Element {
        switch (this.state.currentView) {
            case "Viewing":
                {
                    return (
                        <div className="shopmgr-shops">
                            {this.GetShopIcons()}
                        </div>
                    );
                }
            case "Creating":
                {
                    return (
                        <div className="shopmgr-container">
                            <div className="shopmgr-create-buttons">
                                <ManagerButton
                                    HandleButtonCallback={this.HandleCreateShop.bind(this)}
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
                                    _stagedItems={this.state.stagedItemsToAdd}
                                    _handleRemoveCallback={this.HandleRemoveItem.bind(this)}
                                />
                            </div>
                        </div>
                    );
                }
        }
    }

    private HandleConfirmShop(): void {
    }

    private HandleCreateShop(): void {
    }

    /**
     * Handles staging an item to a new item shop.
     * @param item The item to be staged.
     */
    private HandleStageItem(item: IItem): void {
        console.log("Staging item: " + item.GetEqualityString());

        var newStagedItems = this.state.stagedItemsToAdd;
        newStagedItems.push(item);

        this.setState({
            stagedItemsToAdd: newStagedItems
        });
    }

    /**
     * Handles de-staging an item from the item shop.
     * @param item The item to be de-staged.
     */
    private HandleRemoveItem(item: IItem): void {
        console.log("Removing item: " + item.GetEqualityString());

        var indexToRemove: number | undefined = undefined;

        for (let i = 0; i < this.state.stagedItemsToAdd.length; i++) {
            if (this.state.stagedItemsToAdd[i].GetEqualityString() === item.GetEqualityString())
            {
                indexToRemove = i;
            }
        }

        if (indexToRemove !== undefined) {
            var newStagedItems = this.state.stagedItemsToAdd;
            newStagedItems.splice(indexToRemove, 1);

            this.setState({
                stagedItemsToAdd: newStagedItems
            });
        }
    }

    /**
     * Gets a set of shop icons to display each known shop.
     */
    private GetShopIcons(): JSX.Element[] {
        return (this.props._dmGameRoom.Shops.map(shop => {
            return (
                <ItemShopIcon
                    _shopTab={shop}
                    _maxItemsInTooltip={this.maxItemsDesc}
                    _width={this.iconWidth}
                    _height={this.iconHeight}
                />
            )
        }));
    }
}
