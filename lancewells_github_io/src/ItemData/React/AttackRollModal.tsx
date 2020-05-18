import '../css/AttackRollModal.css'

import React from 'react';
import { Attack } from '../Classes/Attack';
import { DamageType } from '../Enums/DamageType';
import { StylizedModal } from '../../Utilities/React/StylizedModal';
import { DTwenty } from './DTwenty';

type DamageRoll = {
    damageType: DamageType;
    rolledNumbers: number[];
    modifier: number;
}

enum RollType {
    Advantage,
    Disadvantage,
    Regular
}

interface IAttackRollModalState {
    /**
     * The damage values that have been rolled from using this modal.
     */
    damageRoll: DamageRoll[];

    /**
     * The current die faces that are shown to the user. This will change rapidly while rolling.
     */
    dieFaces: number[];

    /**
     * The type of roll that is performed. This will be adv/disadv/etc.
     */
    rollType: RollType;

    /**
     * If true, the modal is currently rolling die. Prevents some components from rendering.
     */
    isRolling: boolean;

    /**
     * The final die value. This will be a single number, if one exists.
     */
    finalDieValue: number | undefined;
}

interface IAttackRollModalProps {
    /**
     * If true, show this modal.
     */
    show: boolean;

    /**
     * The name of the attack to display in the title bar.
     */
    attackName: string;

    /**
     * A series of attack values to compute damage for.
     */
    attacks: Attack[];

    /**
     * A callback for when the user requests that this modal be closed.
     */
    onHide: () => void;
}

/**
 * A modal containing a dice rolling module. Computes random numbers for the attack as well as for the damage
 * of the provided item.
 */
export class AttackRollModal extends React.Component<IAttackRollModalProps, IAttackRollModalState> {
    /**
     * Generating a bunch of random numbers on the fly, in quick succession, is somewhat expensive, so 
     * intead use some pre-generated lists of numbers to flash at someone as the dice is being rolled.
     */
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

    private static readonly dieFrameLength: number = 50;
    private static readonly suspenseLength: number = 600;

    private static readonly rollDieAudio = new Audio("./sounds/rollDie.wav");
    private static readonly roll20Audio = new Audio("./sounds/roll20.wav");
    private static readonly roll1Audio = new Audio("./sounds/roll1.wav");
    private static readonly rollStopAudio: HTMLAudioElement = new Audio("./sounds/rollStop.wav");
    private static readonly rollResultAudio = new Audio("./sounds/rollResult.wav");

    /**
     * Creates a new instance of this object.
     * @param props A series of properties to pass to construct this object.
     */
    public constructor(props: IAttackRollModalProps) {
        super(props);
        this.state = {
            damageRoll: [],
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
                        {this.GetDiceDisplay()}
                    </div>
                    <div className="attack-die-total">
                        {this.GetTotalRollTextDisplay()}
                    </div>
                    <div className="roll-window-damage">
                        {this.GetDamageRollDisplay()}
                    </div>
                </div>
                <div className="roll-window-buttons">
                    <button
                        disabled={this.state.isRolling}
                        className="roll-window-button negative-button"
                        onClick={rollDisadvantage.bind(this)}>
                        With Disadvantage
                    </button>
                    <button
                        disabled={this.state.isRolling}
                        className="roll-window-button"
                        onClick={rollRegular.bind(this)}>
                        Regular Roll
                    </button>
                    <button
                        disabled={this.state.isRolling}
                        className="roll-window-button positive-button"
                        onClick={rollAdvantage.bind(this)}>
                        With Advantage
                    </button>
                </div>
            </StylizedModal>
        )
    }

    /**
     * Gets a random number between 1 and the provided number.
     * @param randomLimit The highest value to roll.
     */
    private GetRandomNumber(randomLimit: number): number {
        return Math.ceil(Math.random() * (randomLimit));
    }

    /**
     * Get a series of numbers to show for each die. The result will be a series of 
     * @param randomIndex The starting point in the random number array to use to represent the random numbers
     * that flash on each die.
     * @param dieIndex The 0-based index for this particular die. For example, if we are rolling two die, the
     * first die's index will be '0', the second, '1'. This is used to stagger dice rolls.
     * @param finalValue The final value to show on the die once it has finished rolling.
     * @returns A series of dice "frames". Duplicate frames are added towards the end of the roll sequence to
     * mimic the dice slowing to a halt.
     */
    private PopulateRollNumbers(randomIndex: number, dieIndex: number, finalValue: number): number[] {
        let rollTimer: number[] = [];

        let standardFastRolls: number = 10;
        let standardMedmRolls: number = 8;
        let standardSlowRolls: number = 2;
        let standardSnailRolls: number = 1;

        let extraDieRolls: number = 8 * dieIndex;

        // This is used to offset the initial roll with a 'cascading' effect of rolls.
        randomIndex = this.GetRandomRollSequence(rollTimer, extraDieRolls, 1, randomIndex);
        randomIndex = this.GetRandomRollSequence(rollTimer, standardFastRolls, 1, randomIndex);
        randomIndex = this.GetRandomRollSequence(rollTimer, standardMedmRolls, 2, randomIndex);
        randomIndex = this.GetRandomRollSequence(rollTimer, standardSlowRolls, 6, randomIndex);
        randomIndex = this.GetRandomRollSequence(rollTimer, standardSnailRolls, 10, randomIndex);

        rollTimer.push(finalValue);

        return rollTimer;
    }

    /**
     * Gets a series of random numbers to flash on the screen while each die rolls.
     * @param rollArray The existing list of roll frames. This is added to by this function. Passed by
     * reference.
     * @param numbersToShow A count of how many numbers should be shown while the dice is rolling.
     * @param framesPerNumber The number of frames assocated with each number that is shown on the die.
     * @param randomIndex This is an indexer used to point at a specific value in a list of pre-generated
     * random numbers. This will be adjusted and returned as the result of this function.
     * @returns The adjusted value for randomIndex. Basically, this should be passed in by-reference.
     * However, typescript isn't great at boxing numbers and making those numbers immutable. It's easier to
     * just return the newly adjusted randomIndex.
     */
    private GetRandomRollSequence(rollArray: number[], numbersToShow: number, framesPerNumber: number, randomIndex: number): number {
        let randomNumberCount: number = AttackRollModal.randomD20Numbers.length - 1;

        for (let i = 0; i < numbersToShow; i++) {
            // Increment that index and ensure it doesn't run off the edge of our array.
            randomIndex++;
            randomIndex %= randomNumberCount;

            let nextRandomNumber: number = AttackRollModal.randomD20Numbers[randomIndex];

            for (let frameIndex: number = 0; frameIndex < framesPerNumber; frameIndex++) {
                rollArray.push(nextRandomNumber);
            }
        }

        return randomIndex;
    }

    /**
     * Rolls the attack die. This incorporates a visual component, and will roll "virtual" dice on screen.
     * @param dieCount The number of dice to roll.
     */
    private RollAttackDice(dieCount: number) {
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

                // This looks a little dumb, but it handles the final die roll effectively.
                if (rollIndex === longestDieArray - 1) {
                    this.FinalizeDieRoll();
                }
            }, AttackRollModal.dieFrameLength * rollIndex)
        }
    }

    /**
     * Rolls damage dice. This value appears after the attack dice have been rolled.
     */
    private RollDamageDice(): void {
        let rolls: DamageRoll[] = this.props.attacks.map((attack) => {
            let rolledNumbers: number[] = [];
            for (let i = 0; i < attack.diceCount; i++) {
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

    /**
     * Handles a user request to roll the attack dice.
     * @param dieCount The number of dice to roll.
     * @param rollType If this is a normal roll, with advantage, or with disadvantage.
     */
    private HandleRollDie(dieCount: number, rollType: RollType): void {
        this.setState({
            rollType: rollType,
            isRolling: true,
            finalDieValue: undefined,
            damageRoll: []
        })
        this.RollAttackDice(dieCount);
    }

    /**
     * Handles some of the stateful logic when our dice have finished rolling.
     */
    private FinalizeDieRoll(): void {
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
                finalDieValue: finalDie
            });
        }, AttackRollModal.suspenseLength);

        setTimeout(() => {
            AttackRollModal.rollStopAudio.play();
            this.RollDamageDice();
            this.setState({
                isRolling: false
            });
        }, AttackRollModal.suspenseLength * 2);
    }

    /**
     * Gets the final value to display for the last dice roll.
     */
    private GetTotalRollTextDisplay(): JSX.Element {
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

    /**
     * Gets the attack dice visual component.
     */
    private GetDiceDisplay(): JSX.Element[] {
        return this.state.dieFaces.map(dieFace => {
            let dieColor: string = "#891e2b";

            return (
                <DTwenty
                    dieFace={dieFace}
                    dieColor={dieColor}
                />
            )
        })
    }

    /**
     * Gets the damage roll text to display to the user.
     */
    private GetDamageRollDisplay(): JSX.Element[] {
        return this.state.damageRoll.map((roll) => {
            let rollStatement: string = "";

            let isCrit: boolean = this.state.finalDieValue === 20;
            let critModifier: string = isCrit ? "2x" : "";

            let diceRollsMessage: string = roll.rolledNumbers.join(" + ");
            let rollModifierMessage: string = roll.modifier > 0 ? ` + ${roll.modifier}` : '';
            let damageMessage: string = `${roll.damageType} damage`;

            rollStatement = `${critModifier}${diceRollsMessage}${rollModifierMessage}`;

            return (
                <div
                    className={`text-color-${roll.damageType.toLowerCase()}`}>
                    {rollStatement} {damageMessage}
                </div>
            );
        });
    }
}
