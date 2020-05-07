import React from 'react';

interface IAttackRollProps {
    attackRoll: number;
    dieDelay: number;
    onStop: (() => void) | undefined;
}

interface IAttackRollState {
    showRoll: number;
    dieColor: string;
}

export class AttackRoll extends React.Component<IAttackRollProps, IAttackRollState> {
    /**
     * Generating a bunch of random numbers on the fly, in quick succession, is somewhat expensive, so 
     * intead use some pre-generated lists of numbers to flash at someone as the dice is being rolled.
     * 
     * I really don't like relying on these arrays being the exact size as the timing array. That said, this
     * is computationally very inexpensive. Otherwise, there will need to be some graphing or equation
     * performed. Keep it as it is, but DO NOT MODIFY THE LENGTH OF THIS ARRAY WITHOUT MODIFYING rollDelay!!!
     */
    private static readonly randomRollNumbers: number[][] = [
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

    /**
     * I really don't like relying on these arrays being the exact size as the timing array. That said, this
     * is computationally very inexpensive. Otherwise, there will need to be some graphing or equation
     * performed. Keep it as it is, but DO NOT MODIFY THE LENGTH OF THIS ARRAY WITHOUT MODIFYING
     * randomRollNumbers!!!
     */
    private static readonly rollDelay: number[] = [
        50, 100, 150, 200, 250, 300, 350, 400, 450, 550, 650, 750, 850, 950, 1050, 1250, 1500, 1800, 1800, 2150
    ]

    private static readonly rollDieAudio: HTMLAudioElement = new Audio("./sounds/rollDie.wav");
    private static readonly rollStopAudio: HTMLAudioElement = new Audio("./sounds/rollStop.wav");
    // private static readonly roll20Audio: HTMLAudioElement = new Audio("./sounds/roll20.wav");
    // private static readonly roll1Audio: HTMLAudioElement = new Audio("./sounds/roll1.wav");

    public constructor(props: IAttackRollProps) {
        super(props);
        this.state = {
            showRoll: 0,
            dieColor: "#891e2b"
        }
        
        AttackRoll.rollDieAudio.play();
        this.RollAttack();
    }

    public componentDidMount() {

    }

    private RollAttack(): void {
        let randomNumberList: number = Math.floor(Math.random() * AttackRoll.randomRollNumbers.length);

        for (let i: number = 0; i < AttackRoll.rollDelay.length; i++) {
            setTimeout(() => {
                this.setState({
                    showRoll: AttackRoll.randomRollNumbers[randomNumberList][i]
                });
            }, AttackRoll.rollDelay[i] + this.props.dieDelay)
        }

        setTimeout(() => {
            this.setState({
                showRoll: this.props.attackRoll
            })
            AttackRoll.rollStopAudio.play();

            if (this.props.onStop !== undefined) {
                this.props.onStop();
            }

            // if (this.props.attackRoll === 20) {
            //     AttackRoll.roll20Audio.play();
            // }
            // else if (this.props.attackRoll === 1) {
            //     AttackRoll.roll1Audio.play();
            // }
        }, AttackRoll.rollDelay[AttackRoll.rollDelay.length - 1] + (this.props.dieDelay * 2))
        // }, AttackRoll.rollDelay[AttackRoll.rollDelay.length - 1] + 350)
    }

    public render() {
        return (
            <div className="roll-window-attack">
                <div className="roll-window-attack-number">
                    {this.state.showRoll}
                </div>
                <svg
                    className="roll-window-attack-die"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="56" >
                    <path fill={this.state.dieColor} d="M0 27.712812921102035L16 0L48 0L64 27.712812921102035L48 55.42562584220407L16 55.42562584220407Z"></path>
                </svg>
            </div>
        );
    }
}
