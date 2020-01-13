import React from 'react';
import { TAttack } from '../../Types/TAttack';
import { Modal } from 'react-bootstrap';

type DamageRoll = {
    diceRolls: number[],
    modifier: number
}

interface IAttackRollModalState {
    attackRoll: number;
    damageRoll: DamageRoll;
}

interface IAttackRollModalProps {
    show: boolean;
    attackName: string;
    attacks: TAttack[];
    onHide: () => void;
}

export class AttackRollModal extends React.Component<IAttackRollModalProps, IAttackRollModalState> {
    private GetDieValue(dieFaces: number): number {
        return Math.ceil(Math.random() * (dieFaces));
    }

    private RollAttack(): void {
        this.setState({
            attackRoll: this.GetDieValue(20)
        })
    }

    // private RollDamage(): void {
    //     var diceRolls: number[] = this.props.attacks.flatMap((attack) => {
    //         let rolls: number[] = [];
    //         for (let i: number = 0; i < attack.diceCount; i++) {
    //             rolls.push(this.GetDieValue(attack.diceSize));
    //         }
    //         return rolls;
    //     });

    //     this.setState({
    //         damageRoll: {
    //             diceRolls = diceRolls,
    //             modifier = 
    //         }
    //     });
    // }
    
    public constructor(props: IAttackRollModalProps) {
        super(props);
        this.state = {
            attackRoll: 0,
            damageRoll: {
                diceRolls: [],
                modifier: 0
            }
        };
    }

    public render() {
        const handleModalShown: () => void = () => {
            this.RollAttack();
        };

        return (
            <Modal
                onEntering={handleModalShown}
                show={this.props.show}
                centered={true}
                onHide={this.props.onHide}>
                <Modal.Header>
                    <Modal.Title className="pixel-font">
                        {this.props.attackName}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="roll-window-image">
                        <img src="./images/Item_Shop/RollImage.png" />
                    </div>
                    <hr className='white-hr' />
                    <div className="roll-window-roll-area">
                        <div className="roll-window-attack-roll">
                            <h5 className="roll-window-title">Attack</h5>
                            <hr className='white-hr' />
                            {this.state.attackRoll}
                        </div>
                        <div className="roll-window-damage-roll">
                            <h5 className="roll-window-title">Attack</h5>
                            <hr className='white-hr' />
                            4 Piercing Damage (4 + 0)
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}
