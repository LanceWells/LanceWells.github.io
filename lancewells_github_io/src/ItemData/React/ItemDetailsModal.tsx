import '../css/ItemDetailsModal.css';
import '../css/DamageType.css'

import React, { ChangeEvent } from 'react';
import { IItem } from '../Interfaces/IItem';
import { SourceType } from '../Enums/SourceType';
import { StylizedModal } from '../../Utilities/React/StylizedModal';
import { MoneyDisplay } from '../../CharacterInfo/React/MoneyDisplay';
import { RemoveClick } from '../Types/CardButtonCallbackTypes/RemoveClick';
import { RemoveButton } from './RemoveButton';

interface IItemDetailsModalState {
    showAlert: boolean;
}

interface IItemDetailsModalProps {
    show: boolean;
    hideModal: () => void;
    itemDetails: IItem;
    removeCallback: RemoveClick | undefined;
    handleUpdatedItemNotes: ((event: ChangeEvent<HTMLTextAreaElement>) => void) | undefined;
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


    public constructor(props: IItemDetailsModalProps) {
        super(props);
        this.state = {
            showAlert: false
        };
    }

    render() {
        let removeButton = (<div/>);
        if (this.props.removeCallback) {
            removeButton = (
                <RemoveButton
                    item={this.props.itemDetails}
                    callbackFunction={this.props.removeCallback}
                />
            )
        }

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
                    <div className='item-tag' style={this.props.itemDetails.GetItemTextStyle()}>
                        {this.props.itemDetails.type}
                    </div>
                </div>
                <hr className='white-hr' />
                {this.props.itemDetails.RenderItemDescription()}
                <hr className='white-hr' />
                <textarea
                    className="item-description-notes"
                    placeholder="It's a note! Shhh, it's a secret note."
                    onChange={this.props.handleUpdatedItemNotes}>
                    {this.props.itemDetails.adjustments.notes}
                </textarea>
                {removeButton}
            </StylizedModal>
        );
    }
}
