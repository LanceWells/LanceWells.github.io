import React from 'react';
import { CarpetMap } from './CarpetMap';
import { ItemCard, TItemClick } from '../Common/ItemCard';
import { TPurchaseClick } from '../../Types/CardButtonCallbackTypes/TPurchaseClick';

/**
 * @description An interface used to represent the properties required to display this class.
 * @param itemDetails The list of items that will be represented on this carpet.
 * @param onItemClick The function that will be called-back to when an item is clicked on.
 * @param rugBorderSource The source image location for the rug border.
 */
interface IBazaarCarpetProps {
    carpetMap: CarpetMap;
    onItemClick: TItemClick;
    onPurchaseClick: TPurchaseClick;
}

interface IBazaarCarpetState {
}

/**
 * @description Returns an instance of this component, BazaarCarpet.
 * @param props The list of properties needed to render this item.
 */
export class BazaarCarpet extends React.Component<IBazaarCarpetProps, IBazaarCarpetState>
{
    /**
     * @description Gets the shop items as ShopItem elements.
     * @param itemDetails The list of item details to represent the items on this carpet.
     * @param onItemClick The click event-handler for items.
     * @see ShopItem
     */
    private getShopItems() {
        return this.props.carpetMap.items.map((item) => {
            return (
                <ItemCard
                    itemDetails={item}
                    onItemClick={this.props.onItemClick}
                    onAttackButton={undefined}
                    onPurchaseButton={this.props.onPurchaseClick}
                    onRemoveButton={undefined}
                    onAddButton={undefined}
                    cardInteractions={["Purchase"]}
                />
            );
        });
    }

    public render() {
        return (
            <div className='shop-section'>
                <h2 className='pixel-font' style={{ fontSize: 18 }}>{this.props.carpetMap.rugName}</h2>
                <div
                    className='shop-rug'
                    style={{ borderImageSource: `${this.props.carpetMap.rugBorderSource}` }}>
                    {this.getShopItems()}
                </div>
            </div>
        );
    }
}
