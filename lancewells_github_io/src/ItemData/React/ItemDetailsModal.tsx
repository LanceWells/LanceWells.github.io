import '../css/ItemDetailsModal.css';
import '../css/DamageType.css'

import React from 'react';
import { IItem } from '../Interfaces/IItem';
import { IItemJson } from '../Interfaces/IItemJson';
import { SourceType } from '../Enums/SourceType';
import { ItemType } from '../Enums/ItemType';
import { StylizedModal } from '../../Utilities/React/StylizedModal';
import { MoneyDisplay } from '../../CharacterInfo/React/MoneyDisplay';

interface IItemDetailsModalState {
    showAlert: boolean;
}

interface IItemDetailsModalProps {
    show: boolean;
    hideModal: () => void;
    itemDetails: IItem;
}

export class ItemDetailsModal extends React.Component<IItemDetailsModalProps, IItemDetailsModalState> {
    /**
     * @description Performs an enum-<p> lookup to get something nice and pixelated to represent the source
     * of the item that is being displayed.
     * @param source The source to lookup and return a <p> element that represents it.
     */
    private getSourceText(source: SourceType) {
        switch (source) {
            case "Official":
                {
                    return (<p style={{ color: 'rgb(255, 200, 37)' }}>Official</p>);
                }
            case "Homebrew":
                {
                    return (<p style={{ color: 'rgb(147, 56, 143)' }}>Homebrew</p>);
                }
        };
    }

    /**
     * @description Performs an enum-<p> lookup to get something nice and pixelated to represent the type
     * of the item that is being displayed.
     * @param type The item to lookup and return a <p> element that represents it.
     */
    private getTypeDisplay(item: IItemJson) {
        switch (item.type) {
            case ItemType.Weapon:
                {
                    return (<p style={{ color: 'rgb(199, 207, 221)' }}>Weapon</p>);
                }
            case ItemType.Armor:
                {
                    return (<p style={{ color: 'rgb(148, 253, 255)' }}>Armor</p>);
                }
            case ItemType.Consumable:
                {
                    return (<p style={{ color: 'rgb(253, 210, 237)' }}>Potion</p>);
                }
            case ItemType.Wondrous:
                {
                    return (<p style={{ color: 'rgb(255, 235, 87)' }}>Wondrous Item</p>);
                }
            default:
                {
                    return (<p style={{ color: 'rgb(255, 235, 87)' }}>Wondrous Item</p>);
                }
        }
    }

    public constructor(props: IItemDetailsModalProps) {
        super(props);
        this.state = {
            showAlert: false
        };
    }

    render() {
        return (
            <StylizedModal
                show={this.props.show}
                onHide={this.props.hideModal}
                title={this.props.itemDetails.title}
                isLoading={false}
                onEnterModal={undefined}>
                <div className='item-preview'>
                    <img src={this.props.itemDetails.iconSource} width={128} height={128} alt="item preview" />
                </div>
                <hr className='white-hr' />
                <div className='item-details pixel-font'>
                    <div className='item-tag'>
                        {this.getSourceText(this.props.itemDetails.source)}
                    </div>
                    <MoneyDisplay
                        copperCount={this.props.itemDetails.itemCopperCost}
                        hideEmptyCurrencies={true}
                    />
                    <div className='item-tag'>
                        {this.getTypeDisplay(this.props.itemDetails)}
                    </div>
                </div>
                <hr className='white-hr' />
                {this.props.itemDetails.RenderItemDescription()}
            </StylizedModal>
        );
    }
}

// <div className='item-tag'>
//     {`${this.props.itemDetails.itemCopperCost}x`}
//     <img src='./images/Item_Shop/itemCoin.gif' alt="animated coin icon" />
// </div>