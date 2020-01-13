import React from 'react';
import { TAttack } from '../../Types/TAttack';
import { Modal } from 'react-bootstrap';

interface IAttackRollModalProps {
    show: boolean;
    attackName: string;
    attacks: TAttack[];
    onHide: () => void;
}

export function AttackRollModal(props: IAttackRollModalProps) {
    return (
        <Modal
            show={props.show}
            centered={true}
            onHide={props.onHide}>
            <Modal.Header>
                <Modal.Title className="pixel-font">
                    {props.attackName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                HERE THERE WILL BE ROLLS
            </Modal.Body>
        </Modal>
    )
}
