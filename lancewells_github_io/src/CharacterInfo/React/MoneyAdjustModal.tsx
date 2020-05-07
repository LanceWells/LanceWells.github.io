import React, { ChangeEvent } from 'react';
import { Modal } from 'react-bootstrap';
import { MoneyDisplay } from './MoneyDisplay';
import { MoneyAdjustCallback } from '../Types/MoneyAdjustCallback';
import { LoadingPlaceholder } from '../../Utilities/React/LoadingPlaceholder';

interface IMoneyAdjustModalProps {
    show: boolean;
    hideModal: () => void;
    playerCopper: number;
    moneyAdjustCallback: MoneyAdjustCallback;
    showAsProcessing: boolean;
}

interface IMoneyAdjustModalState {
    copperAdjustment: number;
}

export class MoneyAdjustModal extends React.Component<IMoneyAdjustModalProps, IMoneyAdjustModalState> {
    public constructor(props: IMoneyAdjustModalProps) {
        super(props);
        this.state = {
            copperAdjustment: 0
        };
    }

    private HandleCopperSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        let adjustedCopper: number = this.props.playerCopper + this.state.copperAdjustment;
        this.props.moneyAdjustCallback(adjustedCopper);

        this.setState({
            copperAdjustment: 0
        });
    }

    private HandleCopperInput(event: ChangeEvent<HTMLInputElement>) {
        let input = event.target?.value;

        // https://stackoverflow.com/questions/23437476/in-typescript-how-to-check-if-a-string-is-numeric
        if (input) {
            let inputAsNumber: number = Number(input);
            if (inputAsNumber !== NaN) {
                this.setState({
                    copperAdjustment: inputAsNumber
                });
            }
        }
    }

    render() {
        let adjustedCopper: number = this.props.playerCopper + this.state.copperAdjustment;

        return (
            <Modal
                show={this.props.show}
                onHide={this.props.hideModal}
                centered={true}>
                <Modal.Header>
                    <Modal.Title>
                        Money Adjustment
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="money-adjustment-container">
                        <LoadingPlaceholder
                        showSpinner={this.props.showAsProcessing}
                        role="Money Adjustment Window Status">
                            <MoneyDisplay
                                playerCopper={adjustedCopper}
                            />
                            <form
                                className="money-adjustment-form"
                                onSubmit={this.HandleCopperSubmit.bind(this)}>
                                <label>Money Changes (in copper, positive or negative)</label>
                                <input
                                    type="number"
                                    id="copperAdjustment"
                                    name="copperAdjustment"
                                    min={-this.props.playerCopper}
                                    max={this.props.playerCopper}
                                    onChange={this.HandleCopperInput.bind(this)} />
                                <input
                                    type="submit"
                                    value="Adjust that money"
                                />
                            </form>
                        </LoadingPlaceholder>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={this.props.hideModal}>Close</button>
                </Modal.Footer>
            </Modal>
        );
    }
}
