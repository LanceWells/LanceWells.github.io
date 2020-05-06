import '../CharacterInfo.css';

import React from 'react';
import { MoneyDisplay } from './MoneyDisplay';
import { Spinner } from 'react-bootstrap';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { CharImageLayout } from '../../CharacterImage/Classes/CharImageLayout';
import { BodyType } from '../../CharacterImage/Enums/BodyType';
import { CharacterStateManager } from '../../FirebaseAuth/Classes/CharacterStateManager';

interface ICharacterInfoContainerProps {
}

interface ICharacterInfoContainerState {
    isLoading: boolean;
    charData: PlayerCharacterData;
}

export class CharacterInfoContainer extends React.Component<ICharacterInfoContainerProps, ICharacterInfoContainerState> {
    public constructor(props: ICharacterInfoContainerProps) {
        let defaultCharData: PlayerCharacterData = new PlayerCharacterData(
            "",
            0,
            [],
            new CharImageLayout(new Map(), BodyType.AverageSizedFeminine),
            "");

        super(props);
        this.state = {
            isLoading: true,
            charData: defaultCharData
        }

        CharacterStateManager.GetInstance().AddObserver(this.characterStateManager_NotifyObservers.bind(this))
        this.UpdateCharDisplay();
    }

    public characterStateManager_NotifyObservers(charData: PlayerCharacterData | undefined): void {
        if (charData !== undefined) {
            this.setState({
                charData: charData
            });
        }
    }

    public componentDidMount() {
        this.UpdateCharDisplay();
    }

    public render() {
        let showSpinner: boolean = this.state.isLoading;

        return (
            <div className="character-info-container">
                <Spinner
                    className="character-info-spinner"
                    animation="border"
                    role="character info status"
                    style={{ visibility: showSpinner ? 'visible' : 'hidden' }}
                />
                <h4>
                    {this.state.charData.Name}
                </h4>
                <MoneyDisplay
                    playerCopper={this.state.charData.Copper}
                />
            </div>
        );
    }

    private UpdateCharDisplay(): void {
        CharacterStateManager.GetInstance().GetCurrentStaticCharacterData().then(charData => {
            let newCharData: PlayerCharacterData = this.state.charData;

            if (charData !== undefined) {
                newCharData = charData;    
            }

            this.setState({
                isLoading: false,
                charData: newCharData
            });
        });
    }
}
