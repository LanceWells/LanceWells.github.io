import React from 'react';
import { Attack } from '../Classes/Attack';
import { Modal } from 'react-bootstrap';
import { DamageType } from '../Enums/DamageType';

type DamageRoll = {
    damageType: DamageType;
    rolledNumbers: number[];
    modifier: number;
}

interface IAttackRollModalState {
    attackRoll: number;
    damageRoll: DamageRoll[];
}

interface IAttackRollModalProps {
    show: boolean;
    attackName: string;
    attacks: Attack[];
    onHide: () => void;
}

export class AttackRollModal extends React.Component<IAttackRollModalProps, IAttackRollModalState> {
    /**
     * Generating a bunch of random numbers on the fly, in quick succession, is somewhat expensive, so 
     * intead use some pre-generated lists of numbers to flash at someone as the dice is being rolled.
     * 
     * TODO: I really don't like relying on these arrays being the exact size as the timing array. Fix this.
     */
    private randomRollNumbers: number[][] = [
        [8, 17, 4, 7, 2, 6, 11, 16, 1, 12, 15, 10, 18, 19, 5, 3, 14, 9, 13, 20],
        [17, 4, 3, 10, 2, 14, 11, 19, 18, 5, 13, 20, 7, 16, 9, 6, 1, 15, 12, 8],
        [12, 4, 6, 18, 15, 17, 19, 13, 14, 8, 7, 3, 9, 2, 16, 10, 1, 5, 20, 11],
        [9, 8, 16, 13, 6, 15, 3, 2, 10, 4, 18, 7, 5, 1, 17, 12, 20, 19, 14, 11],
        [4, 7, 2, 19, 10, 1, 6, 5, 13, 18, 8, 17, 14, 15, 11, 3, 20, 12, 16, 9],
        [20, 5, 19, 9, 12, 16, 4, 10, 2, 17, 8, 15, 6, 7, 11, 1, 13, 3, 18, 14],
        [17, 15, 14, 1, 16, 4, 20, 18, 19, 6, 8, 10, 9, 3, 13, 12, 2, 11, 7, 5],
        [4, 2, 18, 9, 13, 20, 7, 1, 10, 8, 14, 16, 19, 15, 5, 11, 6, 17, 12, 3],
        [6, 8, 14, 18, 7, 17, 20, 15, 11, 5, 2, 16, 3, 19, 12, 4, 10, 9, 13, 1],
        [7, 20, 9, 8, 13, 19, 6, 15, 14, 18, 5, 3, 2, 12, 11, 1, 10, 17, 4, 16],
    ]

    private rollDelay: number[] = [
        50, 100, 150, 200, 250, 300, 350, 400, 450, 550, 650, 750, 850, 950, 1050, 1250, 1500, 1800, 1800, 2150
    ]

    private rollDieAudio = new Audio("./sounds/rollDie.wav");
    private roll20Audio = new Audio("./sounds/roll20.wav");
    private roll1Audio = new Audio("./sounds/roll1.wav");


    private GetDieValue(dieFaces: number): number {
        return Math.ceil(Math.random() * (dieFaces));
    }

    private RollAttack(): void {
        var randomNumberList: number = Math.floor(Math.random() * this.randomRollNumbers.length);

        for (let i: number = 0; i < this.rollDelay.length; i++) {
            setTimeout(() => {
                this.setState({
                    attackRoll: this.randomRollNumbers[randomNumberList][i]
                });
            }, this.rollDelay[i])
        }

        setTimeout(() => {
            this.setState({
                attackRoll: this.GetDieValue(20)
            })
            if (this.state.attackRoll === 20) {
                this.roll20Audio.play();
            }
            else if (this.state.attackRoll === 1) {
                this.roll1Audio.play();
            }
        }, this.rollDelay[this.rollDelay.length - 1] + 350)
    }

    private RollDamage(): void {
        var rolls: DamageRoll[] = this.props.attacks.map((attack) => {
            let rolledNumbers: number[] = [];
            for(let i = 0; i < attack.diceCount; i++) {
                rolledNumbers.push(this.GetDieValue(attack.diceSize));
            }

            let roll: DamageRoll = {
                damageType: attack.damageType,
                rolledNumbers: rolledNumbers,
                modifier: attack.modifier
            };

            return roll;
        });

        this.setState({
            damageRoll: rolls
        });
    }

    private GetDamageRollDisplay(): JSX.Element[] {
        return this.state.damageRoll.map((roll) => {
            var rollStatement: string = "";
            
            var diceRollsMessage: string = roll.rolledNumbers.join(" + ");
            var rollModifierMessage: string = roll.modifier > 0 ? ` + ${roll.modifier}` : '';
            var damageMessage: string = `${roll.damageType} damage`;

            rollStatement = `${diceRollsMessage}${rollModifierMessage}`;

            return (
                <div className={`text-color-${roll.damageType.toLowerCase()}`}>
                    {rollStatement} {damageMessage}
                </div>
            );
        });
    }
    
    public constructor(props: IAttackRollModalProps) {
        super(props);
        this.state = {
            attackRoll: 0,
            damageRoll: []
        };

        this.rollDieAudio.volume = 0.25;
        this.roll1Audio.volume = 0.25;
        this.roll20Audio.volume = 0.25;
    }

    public render() {
        const handleModalShown: () => void = () => {
            this.rollDieAudio.play();
            this.RollAttack();
            this.RollDamage();
        };

        // SVG Generated with:
        // https://codepen.io/wvr/pen/WrNgJp

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
                        <img
                            alt="Dice Rolling"
                            src="./images/Item_Shop/RollImage.png"
                        />
                    </div>
                    <hr className='white-hr' />
                    <h5>Attack</h5>
                    <div className="roll-window-attack">
                        {this.state.attackRoll}
                        <div className="roll-window-attack-number">
                            {this.state.attackRoll}
                        </div>
                        <svg
                            className="roll-window-attack-die"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            width="64"
                            height="56" >
                            <path fill="#891e2b" d="M0 27.712812921102035L16 0L48 0L64 27.712812921102035L48 55.42562584220407L16 55.42562584220407Z"></path>
                        </svg>
                    </div>
                    <hr className='white-hr' />
                    <h5>Damage</h5>
                    <div className="roll-window-damage">
                        {this.GetDamageRollDisplay()}
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}
