import React from 'react';
import { Modal, Alert, Spinner, Button, AlertProps } from 'react-bootstrap';
import { IItem, IItemJson } from '../../Interfaces/IItem';
import { TSourceType } from '../../Types/TSourceType';

interface IItemDetailsModalState {
    showAlert: boolean;
}

interface IItemDetailsModalProps {
    show: boolean;
    hideModal: () => void;
    itemDetails: IItem;

    inventoryButtonCallback: (item: IItem) => void;
    inventoryButtonText: string;
    inventoryAlertText: string;
    inventoryAlertStyle: AlertProps["variant"];
}

export class ItemDetailsModal extends React.Component<IItemDetailsModalProps, IItemDetailsModalState> {
    /**
     * @description Performs an enum-<p> lookup to get something nice and pixelated to represent the source
     * of the item that is being displayed.
     * @param source The source to lookup and return a <p> element that represents it.
     */
    private getSourceText(source: TSourceType) {
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

    public constructor(props: IItemDetailsModalProps) {
        super(props);
        this.state = {
            showAlert: false
        };
    }

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.hideModal}
                centered={true}>
                <Modal.Header>
                    <Modal.Title className="pixel-font">
                        {this.props.itemDetails.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert
                        variant={this.props.inventoryAlertStyle}
                        show={this.state.showAlert}>
                        <Spinner animation="grow" variant={this.props.inventoryAlertStyle} />
                        Added item to inventory!
                </Alert>
                    <div className='item-preview'>
                        <img src={this.props.itemDetails.iconSource} width={128} height={128} alt="item preview" />
                    </div>
                    <hr className='white-hr' />
                    <div className='item-details pixel-font'>
                        <div className='item-tag'>
                            {this.getSourceText(this.props.itemDetails.source)}
                        </div>
                        <div className='item-tag'>
                            {`${this.props.itemDetails.itemCost}x`}
                            <img src='./images/Item_Shop/itemCoin.gif' alt="animated coin icon" />
                        </div>
                        <div className='item-tag'>
                            {this.getTypeDisplay(this.props.itemDetails)}
                        </div>
                    </div>
                    <hr className='white-hr' />
                    {this.props.itemDetails.RenderItemDescription()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='dark' onClick={this.props.hideModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
