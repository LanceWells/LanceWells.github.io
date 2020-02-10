import React from 'react';
import { DMGameRoom } from '../../Classes/DMGameRoom';
import { ItemShopIcon } from './ItemShopIcon';
import { ItemFilter } from './ItemFilter';
import { IItem } from '../../../Items/Interfaces/IItem';

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

    public constructor(props: IItemShopManagerProps) {
        super(props);
        this.state = {
            currentView: "Creating",
            stagedItemsToAdd: []
        }
    }

    public render() {
        return (
            <div className="shopmgr">
                {this.GetView()}
            </div>
        );
    }

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
                        <div className="shopmgr-create-container">
                            <div className="shopmgr-create-selected">
                            </div>
                            <ItemFilter
                                _addItemCallback={this.HandleStageItem.bind(this)}
                            />
                        </div>
                    );
                }
        }
    }

    private HandleStageItem(item: IItem): void {
        this.state.stagedItemsToAdd.push(item);
    }

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
