import './ItemShop.css';
import React from 'react';

import { Modal, Button, Alert, Spinner } from 'react-bootstrap';
import { IItem } from "../../Interfaces/IItem";
import { TSourceType } from "../../Types/TSourceType";
import { BazaarCarpet } from './BazaarCarpet';
import { CarpetMaps } from './CarpetMap';
import { InventoryStorage } from '../../Classes/InventoryStorage';

/**
 * @description
 * Describes the properties that are passed into this class.
 */
interface IItemShopProps {
};

/**
 * @description Describes the state that is maintained by this object.
 * @param showItemDialog A boolean value to describe whether the item dialog (modal) is displayed at any
 * given point.
 * @param itemDetails A set of details that describe the currently selected item. This is used to populate
 * the modal that appears.
 */
interface IItemShopState {
    showItemDialog: boolean;
    showAddedAlert: boolean;
    itemDetails: IItem;
};

/**
 * @description
 * Represents an item shop! This is a full-screen application that is used to 'browse' some digital items.
 */
export class ItemShop extends React.Component<IItemShopProps, IItemShopState> {

    /**
     * @description Creates a new instance of @see ItemShop .
     * @param props The properties required to instantiate this class.
     */
    constructor(props: IItemShopProps) {
        super(props);
        this.state = {
            showItemDialog: false,
            showAddedAlert: false,
            itemDetails: {
                key: '',
                title: '',
                description: '',
                details: '',
                iconSource: '',
                requiresAttunement: false,
                itemCost: 0,
                source: "Homebrew",
                type: "Wondrous",
            }
        };
    }

    /**
     * @description
     * Shows or hides the item details modal.
     * @param show If true, show the modal; otherwise false.
     */
    setModalVisiblity(show: boolean) {
        this.setState({
            showItemDialog: show,
            showAddedAlert: this.state.showAddedAlert && !show
        });
    }

    /**
     * @description Handles an item click event.
     * @param item The item details that are provided as a result of the click event (this is a set of
     * properties that represent the item that was clicked).
     */
    onItemClick(item: IItem) {
        this.setState({
            itemDetails: item,
        });

        this.setModalVisiblity(true);
    }

    /**
     * @description Performs an enum-<p> lookup to get something nice and pixelated to represent the source
     * of the item that is being displayed.
     * @param source The source to lookup and return a <p> element that represents it.
     */
    getSourceText(source: TSourceType) {
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
    getTypeDisplay(item: IItem) {
        switch (item.type) {
            case "Weapon":
                {
                    return (<p style={{ color: 'rgb(199, 207, 221)' }}>Weapon</p>);
                }
            case "Armor":
                {
                    return (<p style={{ color: 'rgb(148, 253, 255)' }}>Armor</p>);
                }
            case "Potion":
                {
                    return (<p style={{ color: 'rgb(253, 210, 237)' }}>Potion</p>);
                }
            case "Wondrous":
                {
                    return (<p style={{ color: 'rgb(255, 235, 87)' }}>Wondrous Item</p>);
                }
            default:
                {
                    return (<p style={{ color: 'rgb(255, 235, 87)' }}>Wondrous Item</p>);
                }
        }
    }

    /**
     * @description Gets a list of bazaar carpets for display.
     * @param onItemClick The click event-handler for item clicks.
     */
    getBazaarCarpets(onItemClick: Function) {
        return CarpetMaps.map((carpet) => {
            return (
                <BazaarCarpet
                    carpetMap={carpet}
                    onItemClick={onItemClick}
                />
            );
        });
    }

    /**
     * @description Gets the color association for a given damage type.
     * @param damageDesc The snippet from the description associated with the damage type.
     */
    getDescriptionStyle(desc: string): string {
        if (/withdrawal effect/.test(desc)) {
            return 'text-color-withdrawal';
        }
        if (/acid/.test(desc)) {
            return 'text-color-acid';
        }
        if (/bludgeoning/.test(desc)) {
            return 'text-color-bludgeoning';
        }
        if (/cold/.test(desc)) {
            return 'text-color-cold';
        }
        if (/fire/.test(desc)) {
            return 'text-color-fire';
        }
        if (/force/.test(desc)) {
            return 'text-color-force';
        }
        if (/lightning/.test(desc)) {
            return 'text-color-lightning';
        }
        if (/necrotic/.test(desc)) {
            return 'text-color-necrotic';
        }
        if (/piercing/.test(desc)) {
            return 'text-color-piercing';
        }
        if (/poison/.test(desc)) {
            return 'text-color-poison';
        }
        if (/psychic/.test(desc)) {
            return 'text-color-psychic';
        }
        if (/radiant/.test(desc)) {
            return 'text-color-radiant';
        }
        if (/slashing/.test(desc)) {
            return 'text-color-slashing';
        }
        if (/thunder/.test(desc)) {
            return 'text-color-thunder';
        }

        // Not sure what it was, but don't return nothing.
        return 'text-color-plain';
    }

    /**
     * @description Gets the description for an item as a set of elements.
     * @param description The description that will be represented as a series of elements.
     */
    getFormattedItemDescription(description: string) {
        // https://regex101.com/r/PneEIz/4
        // https://github.com/facebook/react/issues/3386
        var splitDesc: string[];
        splitDesc = description.split(/(\b(?:\d+d\d+|\d)\s(?:acid|bludgeoning|cold|fire|force|lightning|necrotic|piercing|poison|psychic|radiant|slashing|thunder)\b|(?:\bwithdrawal effect\b))/gi);

        return (splitDesc.map((desc, index) => {
            if (index % 2 === 0) {
                return <span>{desc}</span>
            }
            else {
                return (
                    <span
                        style={{ fontWeight: 'bolder' }}
                        className={this.getDescriptionStyle(desc)}>
                        {desc}
                    </span>
                );
            }
        }));
    }

    /**
     * @description Renders an instance of this class.
     */
    render() {
        var item: IItem = this.state.itemDetails;

        /* Keep these as consts because if we were to use a function callback when closing the Modal,
         * that would result in an exception (because we're then in a state that doesn't recognize)
         * ItemShop as 'this'. */

        const handleItemClick = (itemDetails: IItem) => this.onItemClick(itemDetails);

        const hideModal = () => {
            this.setState({
                showItemDialog: false,
                showAddedAlert: false
            });
        };

        // https://codesandbox.io/s/qqn6nxjp9
        const addItem = () => {
            // this.showAlert();
            this.setState({
                showAddedAlert: true
            }, () => {
                window.setTimeout(() => {
                    this.setState({
                        showAddedAlert: false
                    })
                }, 3000)
            })

            InventoryStorage.getInstance().AddItem(item.key, item.type);
        };

        return (
            <div className="ItemShop">
                <h1>Item Shop</h1>
                <div className='shopkeeper-area'>
                    <img src='./images/Item_Shop/brazier-lit.gif' alt="animated left brazier" />
                    <img src='./images/Item_Shop/shopkeeper.gif' alt="shopkeeper" />
                    <img src='./images/Item_Shop/brazier-lit.gif' alt="animated left brazier" />
                </div>
                <div className='bazaar-area'>
                    {this.getBazaarCarpets(handleItemClick)}
                </div>
                <Modal
                    show={this.state.showItemDialog}
                    onHide={hideModal}
                    centered={true}>
                    <Modal.Header>
                        <Modal.Title className='pixel-font'>
                            {this.state.itemDetails.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Alert
                            variant='success'
                            show={this.state.showAddedAlert}>
                            <Spinner animation="grow" variant="success"/>
                            Added item to inventory!
                        </Alert>
                        <div className='item-preview'>
                            <img src={this.state.itemDetails.iconSource} width={128} height={128} alt="item preview" />
                        </div>
                        <hr className='white-hr' />
                        <div className='item-details pixel-font'>
                            <div className='item-tag'>
                                {this.getSourceText(this.state.itemDetails.source)}
                            </div>
                            <div className='item-tag'>
                                {`${this.state.itemDetails.itemCost}x`}
                                <img src='./images/Item_Shop/itemCoin.gif' alt="animated coin icon" />
                            </div>
                            <div className='item-tag'>
                                {this.getTypeDisplay(this.state.itemDetails)}
                            </div>
                        </div>
                        <hr className='white-hr' />
                        {this.getFormattedItemDescription(this.state.itemDetails.description + " " + this.state.itemDetails.details)}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant='dark'
                            onClick={this.state.showAddedAlert ? undefined : addItem}
                            disabled={this.state.showAddedAlert}
                            style={this.state.showAddedAlert ? { cursor: "default" } : { cursor: "pointer" }}>
                            Add to Inventory
                        </Button>
                        <Button variant='dark' onClick={hideModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
