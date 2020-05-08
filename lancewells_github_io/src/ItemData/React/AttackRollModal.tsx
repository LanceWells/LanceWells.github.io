import React from 'react';
import { Attack } from '../Classes/Attack';
import { DamageType } from '../Enums/DamageType';
import { StylizedModal } from '../../Utilities/React/StylizedModal';
import { AttackRoll } from './AttackRoll';

type DamageRoll = {
    damageType: DamageType;
    rolledNumbers: number[];
    modifier: number;
}

type DieRoll = {
    value: number;
    randomNumberIndex: number;
    rollTimer: number[];
}

enum RollType {
    Advantage,
    Disadvantage,
    Regular
}

interface IAttackRollModalState {
    // attackRoll: number;
    damageRoll: DamageRoll[];
    // dieValues: number[];
    dieFaces: number[];
    rollType: RollType;
    isRolling: boolean;
    finalDieValue: number | undefined;
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
    // private randomRollNumbers: number[][] = [
    //     [8, 17, 4, 7, 2, 6, 11, 16, 1, 12, 15, 10, 18, 19, 5, 3, 14, 9, 13, 20],
    //     [17, 4, 3, 10, 2, 14, 11, 19, 18, 5, 13, 20, 7, 16, 9, 6, 1, 15, 12, 8],
    //     [12, 4, 6, 18, 15, 17, 19, 13, 14, 8, 7, 3, 9, 2, 16, 10, 1, 5, 20, 11],
    //     [9, 8, 16, 13, 6, 15, 3, 2, 10, 4, 18, 7, 5, 1, 17, 12, 20, 19, 14, 11],
    //     [4, 7, 2, 19, 10, 1, 6, 5, 13, 18, 8, 17, 14, 15, 11, 3, 20, 12, 16, 9],
    //     [20, 5, 19, 9, 12, 16, 4, 10, 2, 17, 8, 15, 6, 7, 11, 1, 13, 3, 18, 14],
    //     [17, 15, 14, 1, 16, 4, 20, 18, 19, 6, 8, 10, 9, 3, 13, 12, 2, 11, 7, 5],
    //     [4, 2, 18, 9, 13, 20, 7, 1, 10, 8, 14, 16, 19, 15, 5, 11, 6, 17, 12, 3],
    //     [6, 8, 14, 18, 7, 17, 20, 15, 11, 5, 2, 16, 3, 19, 12, 4, 10, 9, 13, 1],
    //     [7, 20, 9, 8, 13, 19, 6, 15, 14, 18, 5, 3, 2, 12, 11, 1, 10, 17, 4, 16],
    // ]

    private static readonly randomD20Numbers: number[] = [
        8, 17, 4, 7, 2, 6, 11, 16, 1, 12, 15, 10, 18, 19, 5, 3, 14, 9, 13, 20,
        17, 4, 3, 10, 2, 14, 11, 19, 18, 5, 13, 20, 7, 16, 9, 6, 1, 15, 12, 8,
        12, 4, 6, 18, 15, 17, 19, 13, 14, 8, 7, 3, 9, 2, 16, 10, 1, 5, 20, 11,
        9, 8, 16, 13, 6, 15, 3, 2, 10, 4, 18, 7, 5, 1, 17, 12, 20, 19, 14, 11,
        4, 7, 2, 19, 10, 1, 6, 5, 13, 18, 8, 17, 14, 15, 11, 3, 20, 12, 16, 9,
        20, 5, 19, 9, 12, 16, 4, 10, 2, 17, 8, 15, 6, 7, 11, 1, 13, 3, 18, 14,
        17, 15, 14, 1, 16, 4, 20, 18, 19, 6, 8, 10, 9, 3, 13, 12, 2, 11, 7, 5,
        4, 2, 18, 9, 13, 20, 7, 1, 10, 8, 14, 16, 19, 15, 5, 11, 6, 17, 12, 3,
        6, 8, 14, 18, 7, 17, 20, 15, 11, 5, 2, 16, 3, 19, 12, 4, 10, 9, 13, 1,
        7, 20, 9, 8, 13, 19, 6, 15, 14, 18, 5, 3, 2, 12, 11, 1, 10, 17, 4, 16,
    ]

    // private static readonly rollDelay: number[] = [
    //     50, 100, 150, 200, 250, 300, 350, 400, 450, 550, 650, 750, 850, 950, 1050, 1250, 1500, 1800, 1800, 2150
    // ]

    private static readonly dieFrameLength: number = 50;

    private static readonly rollDieAudio = new Audio("./sounds/rollDie.wav");
    private static readonly roll20Audio = new Audio("./sounds/roll20.wav");
    private static readonly roll1Audio = new Audio("./sounds/roll1.wav");
    private static readonly rollStopAudio: HTMLAudioElement = new Audio("./sounds/rollStop.wav");
    private static readonly rollResultAudio = new Audio("./sounds/rollResult.wav");

    private static dieDelay: number = 350;

    private GetRandomNumber(dieFaces: number): number {
        return Math.ceil(Math.random() * (dieFaces));
    }

    // private RollAttack(): void {
    //     let randomNumberList: number = Math.floor(Math.random() * this.randomRollNumbers.length);

    //     for (let i: number = 0; i < this.rollDelay.length; i++) {
    //         setTimeout(() => {
    //             this.setState({
    //                 attackRoll: this.randomRollNumbers[randomNumberList][i]
    //             });
    //         }, this.rollDelay[i])
    //     }

    //     setTimeout(() => {
    //         this.setState({
    //             attackRoll: this.GetDieValue(20)
    //         })
    //         if (this.state.attackRoll === 20) {
    //             this.roll20Audio.play();
    //         }
    //         else if (this.state.attackRoll === 1) {
    //             this.roll1Audio.play();
    //         }
    //     }, this.rollDelay[this.rollDelay.length - 1] + 350)
    // }

    // private SetDieFace(dieIndex: number, dieValue: number): void {
    //     this.setState({
    //         dieFaces[dieIndex]: dieValue
    //     });
    // }

    // private async RollDie(dieIndex: number, delayBeforeSlowdown: number): Promise<number> {
    //     let rollingDie: boolean = true;

    //     new Promise<void>(resolve => {
    //         setTimeout(() => {
    //             rollingDie = false;
    //             resolve();
    //         }, delayBeforeSlowdown);
    //     });
        
    //     setInterval()
    // }

    private TossTheDice(dieCount: number) {
        let rolls: number[][] = [];
        for (let i: number = 0; i < dieCount; i++) {
            let value: number = this.GetRandomNumber(20);
            let randomNumberIndex: number = this.GetRandomNumber(AttackRollModal.randomD20Numbers.length);
            let rollFrames: number[] = this.PopulateRollNumbers(randomNumberIndex, i, value);

            rolls.push(rollFrames);
        }

        let longestDieArray: number = rolls[dieCount - 1].length;
        AttackRollModal.rollDieAudio.play();
        
        for (let rollIndex = 0; rollIndex < longestDieArray; rollIndex++) {
            setTimeout(() => {
                let currentRolls: number[] = [];
                // for (let dieIndex = 0; dieIndex < rolls.length; dieIndex++) {
                //     let indexToGet: number = Math.min(rollIndex, rolls.length - 1);
                //     currentRolls.push(rolls[dieIndex][indexToGet]);
                // }
                // currentRolls[0] = rolls[0][rollIndex];
                for (let dieIndex = 0; dieIndex < rolls.length; dieIndex++) {
                    let indexToGet = Math.min(rollIndex, rolls[dieIndex].length - 1);

                    if (rollIndex === rolls[dieIndex].length - 1) {
                        AttackRollModal.rollStopAudio.play();
                    }

                    currentRolls.push(rolls[dieIndex][indexToGet]);
                }

                this.setState({
                    dieFaces: currentRolls
                });

                if (rollIndex === longestDieArray - 1) {
                    this.HandleFinalDieRoll();
                }
            }, 50 * rollIndex)
        }
        // let timeForRolls = longestDieArray * AttackRollModal.dieFrameLength;

        // let intervalIndex: number = 0;
        // let diceUpdateInterval = setInterval(() => {
        //     let currentRolls: number[] = [];
        //     for (let i = 0; i < rolls.length; i++) {
        //         let indexToGet: number = Math.min(intervalIndex, rolls.length - 1);
        //         currentRolls[i] = rolls[i][indexToGet];
        //     }

        //     this.setState({
        //         dieFaces: currentRolls
        //     });
        // }, AttackRollModal.dieFrameLength);
        // for (let i = 0; i < longestDieArray; i++) {
        //     setTimeout(() => {
        //         let currentRolls: number[] = [];
        //         for (let j = 0; j < rolls.length; j++) {
        //             let indexToGet: number = Math.min(i, rolls.length - 1);
        //             currentRolls[j] = rolls[j][indexToGet];
        //         }

        //         this.setState({
        //             dieFaces: currentRolls
        //         });

        //         if (i == rolls.length - 1) {
        //             this.HandleFinalDieRoll();
        //         }
        //     }, AttackRollModal.dieFrameLength * i);
        // }

        // setTimeout(() => {
        //     clearInterval(diceUpdateInterval);
        //     this.HandleFinalDieRoll();
        // }, timeForRolls);
    }

    private PopulateRollNumbers(randomIndex: number, dieIndex: number, finalValue: number): number[] {
        let rollTimer: number[] = [];

        let standardFastRolls:  number = 10;
        let standardMedmRolls:  number = 8;
        let standardSlowRolls:  number = 2;
        let standardSnailRolls: number = 1;

        let extraDieRolls: number = 4;
        let randomNumberCount: number = AttackRollModal.randomD20Numbers.length - 1;

        // This is used to offset the initial roll with a 'cascading' effect of rolls.
        for (let i = 0; i < extraDieRolls * dieIndex; i++) {
            let nextRandomNumber: number = AttackRollModal.randomD20Numbers[randomIndex++ % randomNumberCount];
            rollTimer.push( nextRandomNumber,
                            nextRandomNumber);
        }

        for (let i = 0; i < standardFastRolls; i++) {
            let nextRandomNumber: number = AttackRollModal.randomD20Numbers[randomIndex++ % randomNumberCount];
            rollTimer.push(nextRandomNumber);
        }

        for (let i = 0; i < standardMedmRolls; i++) {
            let nextRandomNumber: number = AttackRollModal.randomD20Numbers[randomIndex++ % randomNumberCount];
            rollTimer.push( nextRandomNumber,
                            nextRandomNumber);
        }

        for (let i = 0; i < standardSlowRolls; i++) {
            let nextRandomNumber: number = AttackRollModal.randomD20Numbers[randomIndex++ % randomNumberCount];
            rollTimer.push( nextRandomNumber,
                            nextRandomNumber,
                            nextRandomNumber,
                            nextRandomNumber,
                            nextRandomNumber);
        }

        for (let i = 0; i < standardSnailRolls; i++) {
            let nextRandomNumber: number = AttackRollModal.randomD20Numbers[randomIndex++ % randomNumberCount];
            rollTimer.push( nextRandomNumber,
                            nextRandomNumber,
                            nextRandomNumber,
                            nextRandomNumber,
                            nextRandomNumber,
                            nextRandomNumber,
                            nextRandomNumber,
                            nextRandomNumber,
                            nextRandomNumber,
                            nextRandomNumber,
                            nextRandomNumber,
                            nextRandomNumber);
        }

        rollTimer.push(finalValue);

        return rollTimer;
    }

    private RollDamage(): void {
        let rolls: DamageRoll[] = this.props.attacks.map((attack) => {
            let rolledNumbers: number[] = [];
            for(let i = 0; i < attack.diceCount; i++) {
                rolledNumbers.push(this.GetRandomNumber(attack.diceSize));
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

    private HandleRollDie(dieCount: number, rollType: RollType): void {
        // let rolls: number[] = [];

        // for (let i: number = 0; i < dieCount; i++) {
        //     rolls.push(this.GetRandomNumber(20));
        // }

        // this.setState({
        //     dieValues: rolls,
        //     rollType: rollType
        // });
        // this.setState({
        //     rollType: rollType
        // });
        this.setState({
            rollType: rollType,
            isRolling: true,
            finalDieValue: undefined
        })
        this.TossTheDice(dieCount);
    }

    private GetDieToRoll(): JSX.Element[] {
        // let highestValue: number = this.state.dieFaces.sort()[0];
        // let lowestValue: number = this.state.dieFaces.sort().reverse()[0];

        return this.state.dieFaces.map(dieFace => {
            let dieColor: string = "#891e2b";

            // if (!this.state.isRolling) {
            //     if (dieFace === 20) {
            //         dieColor = "#33984b";
            //     }
            //     if (dieFace === 1) {
            //         dieColor = "#891e2b";
            //     }
            // }

            // if (!this.state.isRolling) {
            //     if (dieFace === highestValue) {
            //         dieColor = "#33984b";
            //     }
            //     else if (dieFace === lowestValue) {
            //         dieColor = "#891e2b";
            //     }
            // }

            // if (dieFace === this.state.finalDieValue) {
            //     dieColor = "#33984b";
            // }

            return (
                <div className="attack-die">
                    <div className="attack-die-value">
                        {dieFace}
                    </div>
                    <svg
                        className="roll-window-attack-die"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="56" >
                        <path fill={dieColor} d="M0 27.712812921102035L16 0L48 0L64 27.712812921102035L48 55.42562584220407L16 55.42562584220407Z"></path>
                    </svg>
                </div>
            )
        })
    }

    private GetTotalRollText(): JSX.Element {
        let finalDieText: string = "";

        if (this.state.finalDieValue !== undefined) {
            finalDieText = `${this.state.finalDieValue}`;
        }
        
        return (
            <span>
                {finalDieText}
            </span>
        )
    }

    // private GetDieToRoll(): JSX.Element[] {
    //     let die: JSX.Element[] = [];

    //     /**
    //      * Create the first set of die arbitrarily. We send the die off one-at-a-time to build SUSPENSE! This
    //      * means that when we need to listen for the die to stop, we only listen to the last die to stop.
    //      * Because of this, the first bunch of die are "special" and don't need as much attention.
    //      */
    //     for (let i: number = 0; i < this.state.dieValues.length - 1; i++) {
    //         die.push(
    //             <AttackRoll
    //                 attackRoll={this.state.dieValues[i]}
    //                 dieDelay={AttackRollModal.dieDelay * (i) + 1}
    //                 onStop={undefined}
    //             />
    //         );
    //     }

    //     if (this.state.dieValues.length > 0) {
    //         die.push(
    //             <AttackRoll
    //                 attackRoll={this.state.dieValues[this.state.dieValues.length - 1]}
    //                 dieDelay={AttackRollModal.dieDelay * this.state.dieValues.length}
    //                 onStop={this.HandleFinalDieRoll.bind(this)}
    //             />
    //         );
    //     }

    //     return die;
    // }

    private HandleFinalDieRoll(): void {
        let diceValues = this.state.dieFaces;
        let finalDie: number | undefined = undefined;
        
        switch (this.state.rollType) {
            case RollType.Disadvantage: {
                if (diceValues.length > 0) {
                    finalDie = diceValues.slice(0).sort((a, b) => a - b)[0];
                }
                break;
            }
            case RollType.Advantage: {
                if (diceValues.length > 0) {
                    finalDie = diceValues.slice(0).sort((a, b) => a - b).reverse()[0];
                }
                break;
            }
            case RollType.Regular: {
                if (diceValues.length > 0) {
                    finalDie = diceValues[0];
                }
                break;
            }
        }

        setTimeout(() => {
            if (finalDie === 20) {
                AttackRollModal.roll20Audio.play();
            }
            else if (finalDie === 1) {
                AttackRollModal.roll1Audio.play();
            }
            else {
                AttackRollModal.rollResultAudio.play();
            }
            
            this.setState({
                isRolling: false,
                finalDieValue: finalDie
            });
        }, 500);

        setTimeout(() => {
            AttackRollModal.rollStopAudio.play();
            this.RollDamage();
        }, 500 * 2);
    }

    private GetDamageRollDisplay(): JSX.Element[] {
        return this.state.damageRoll.map((roll) => {
            let rollStatement: string = "";
            
            let diceRollsMessage: string = roll.rolledNumbers.join(" + ");
            let rollModifierMessage: string = roll.modifier > 0 ? ` + ${roll.modifier}` : '';
            let damageMessage: string = `${roll.damageType} damage`;

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
            // attackRoll: 0,
            damageRoll: [],
            // dieValues: [],
            dieFaces: [],
            rollType: RollType.Regular,
            isRolling: false,
            finalDieValue: undefined
        };

        AttackRollModal.roll1Audio.volume = 0.1;
        AttackRollModal.roll20Audio.volume = 0.25;
        AttackRollModal.rollDieAudio.volume = 0.25;
        AttackRollModal.rollResultAudio.volume = 0.1;
        AttackRollModal.rollStopAudio.volume = 0.1;
    }

    // private HandleModalShown(): void {
        // this.rollDieAudio.play();
        // this.RollAttack()
        // this.RollDamage()
    // }

    public render() {
        // SVG Generated with:
        // https://codepen.io/wvr/pen/WrNgJp

        const rollAdvantage     = () => this.HandleRollDie(2, RollType.Advantage);
        const rollDisadvantage  = () => this.HandleRollDie(2, RollType.Disadvantage);
        const rollRegular       = () => this.HandleRollDie(1, RollType.Regular);

        return (
            <StylizedModal
                show={this.props.show}
                onHide={this.props.onHide}
                onEnterModal={undefined}
                title={this.props.attackName}
                isLoading={false}>
                <div className="roll-window-image">
                    <img
                        alt="Dice Rolling"
                        src="./images/Item_Shop/RollImage.png"
                    />
                </div>
                <hr className='white-hr' />
                <div className="attack-results-container">
                    <h5>Attack</h5>
                    <div className="attack-die-container">
                        {this.GetDieToRoll()}
                    </div>
                    <div className="attack-die-total">
                        {this.GetTotalRollText()}
                    </div>
                    <div className="roll-window-damage">
                        {this.GetDamageRollDisplay()}
                    </div>
                </div>
                <button onClick={rollDisadvantage.bind(this)}>
                    With Disadvantage
                </button>
                <button onClick={rollRegular.bind(this)}>
                    Regular Roll
                </button>
                <button onClick={rollAdvantage.bind(this)}>
                    With Advantage
                </button>
            </StylizedModal>
        )
    }
}

// <div className="roll-window-attack">
//     {this.state.attackRoll}
//     <div className="roll-window-attack-number">
//         {this.state.attackRoll}
//     </div>
//     <svg
//         className="roll-window-attack-die"
//         version="1.1"
//         xmlns="http://www.w3.org/2000/svg"
//         width="64"
//         height="56" >
//         <path fill="#891e2b" d="M0 27.712812921102035L16 0L48 0L64 27.712812921102035L48 55.42562584220407L16 55.42562584220407Z"></path>
//     </svg>
// </div>