import './ItemShopManager.css';

import React, { DragEvent, DragEventHandler } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { TShopTab } from '../../Types/TShopTab';

const shopIconLocation: string = './images/Item_Shop/ShopIcon.png'

interface IItemShopIconProps {
    ShopTab: TShopTab;
    MaxItemsInTooltip: number;
    Width: number;
    Height: number;
    HandleDragEvent: (shop: TShopTab) => void;
    // RemoveCallback
    // EditCallback
}

interface IItemShopIconState {
}

export class ItemShopIcon extends React.Component <IItemShopIconProps, IItemShopIconState>{
    public constructor(props: IItemShopIconProps) {
        super(props);
        this.state = {
        };
    }

    public render() {
        return (
            <div className="shopmgr-icon-container"
                id={this.props.ShopTab.ID}
                draggable={true}
                onDragStart={this.HandleOnDrag.bind(this)}>
                <span>{this.props.ShopTab.Name}</span>
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 0, hide: 400 }}
                    overlay={
                        <Tooltip id="item-shop-tooltip" className="shopmgr-icon-tooltip">
                            {this.GetTooltipText(this.props.ShopTab, this.props.MaxItemsInTooltip)}
                        </Tooltip>
                    }>
                    <div className="shopmgr-icon-bg">
                        <img
                            draggable={false}
                            className="shopmgr-icon"
                            alt="Shop Icon"
                            src={shopIconLocation}
                            style={{
                                width: `${this.props.Width}px`,
                                height: `${this.props.Height}px`
                            }}
                        />
                    </div>
                </OverlayTrigger>
            </div>
        )
    }

    /**
     * https://stackoverflow.com/questions/46063714/how-to-attach-drag-event-handlers-to-a-react-component-using-typescript
     */
    private HandleOnDrag(event: DragEvent<HTMLDivElement>){
        this.props.HandleDragEvent(this.props.ShopTab);
    }

    private GetTooltipText(shop: TShopTab, maxItemsInTooltip: number) {
        var itemsAsList: string[] = shop.Items.map(item => item.title);
        var numItemsToKeep: number = Math.min(itemsAsList.length, maxItemsInTooltip);
        var itemsDesc: string = itemsAsList.slice(0, numItemsToKeep).join(', ');

        if (maxItemsInTooltip < itemsAsList.length) {
            itemsDesc += " . . .";
        }

        var itemTooltip: string = `${itemsAsList.length} items: ${itemsDesc}`;
        return itemTooltip;
    }
}

