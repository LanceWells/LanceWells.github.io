import React from 'react';
import { Modal } from 'react-bootstrap';

import { LoadingPlaceholder } from './LoadingPlaceholder';

interface IStylizedModalProps {
    show: boolean;
    onHide: () => void;
    onEnterModal: (() => void) | undefined;
    title: string;
    isLoading: boolean;
}

interface IStylizedModalState {
}

export class StylizedModal extends React.Component<IStylizedModalProps, IStylizedModalState> {
    public constructor(props: IStylizedModalProps) {
        super(props);
        this.state = {
        }
    }

    public render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                centered={true}
                onEntering={this.props.onEnterModal}>
                <Modal.Header>
                    <Modal.Title>
                        {this.props.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LoadingPlaceholder
                        showSpinner={this.props.isLoading}
                        role={`${this.props.title} Loading Status`}>
                        {this.props.children}
                    </LoadingPlaceholder>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={this.props.onHide}>Close</button>
                </Modal.Footer>
            </Modal>
        );
    }
}
