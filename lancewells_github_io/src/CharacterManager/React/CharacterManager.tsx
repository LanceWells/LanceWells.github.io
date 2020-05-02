import '../CharacterManager.css';

import React from 'react';
import { CurrentCharacterStatus } from './CurrentCharacterStatus';
import { PlayerInventoryService } from '../../FirebaseAuth/Classes/PlayerInventoryService';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { CharacterSelector } from './CharacterSelector';
import { CharacterStateManager } from '../../FirebaseAuth/Classes/CharacterStateManager';
import { NewCharacterForm } from './NewCharacterForm';

export interface ICharacterManagerProps {
}

export interface ICharacterManagerState {
    currentCharacterData: PlayerCharacterData | undefined;
    allCharactersData: PlayerCharacterData[];
    isLoading: boolean;
    showNewCharForm: boolean;
}

export class CharacterManager extends React.Component<ICharacterManagerProps, ICharacterManagerState> {
    private handleNewCharButtonClick(): void {
        this.setState({
            showNewCharForm: true
        });
    }

    private handleHideModal(): void {
        this.setState({
            showNewCharForm: false
        });
    }

    private handleSubmitNewCharForm(): void {
        this.setState({
            showNewCharForm: false
        });
        this.UpdateCharacterData();
    }

    public constructor(props: ICharacterManagerProps) {
        super(props);
        this.state = {
            currentCharacterData: undefined,
            allCharactersData: [],
            isLoading: true,
            showNewCharForm: false
        };
    }

    public render() {
        let allCharacterNames: string[] = this.state.allCharactersData.map(acn => acn.Name);

        return (
            <div className="character-manager">
                <NewCharacterForm
                    existingCharacterNames={allCharacterNames}
                    show={this.state.showNewCharForm}
                    onHideModal={this.handleHideModal.bind(this)}
                    onFormSubmission={this.handleSubmitNewCharForm.bind(this)}
                />
                <CurrentCharacterStatus
                    currentCharacterData={this.state.currentCharacterData}
                />
                <CharacterSelector
                    newCharacterButtonCallback={this.handleNewCharButtonClick.bind(this)}
                    characterSelectedCallback={this.handleCharacterSelected.bind(this)}
                    allCharacterData={this.state.allCharactersData}
                    isLoading={this.state.isLoading}
                />
            </div>
        )
    }

    public componentDidMount() {
        this.UpdateCharacterData();
    }

    private handleCharacterSelected(charData: PlayerCharacterData): void {
        PlayerInventoryService.SetCurrentCharacter(charData.Name);
        this.UpdateCharacterData();
    }

    private UpdateCharacterData(): void {
        PlayerInventoryService.FetchAllCharacters().then(characterData => {
            let currentCharacter: PlayerCharacterData | undefined = undefined;
            let characterName: string | null = PlayerInventoryService.GetCurrentCharacterName();

            if (characterData) {
                currentCharacter = characterData.find(c => c.Name === characterName);
            }

            this.setState({
                currentCharacterData: currentCharacter,
                allCharactersData: characterData,
                isLoading: false
            });

            // Modify our existing singleton that tracks our current character selection.
            CharacterStateManager.GetInstance().ChangeStaticCharacterData(currentCharacter);
        });
    }
}
