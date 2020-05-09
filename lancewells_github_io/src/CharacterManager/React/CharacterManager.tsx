import '../CharacterManager.css';

import React from 'react';
import { CurrentCharacterStatus } from './CurrentCharacterStatus';
import { PlayerInventoryService } from '../../FirebaseAuth/Classes/PlayerInventoryService';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { CharacterSelector } from './CharacterSelector';
import { CharacterStateManager } from '../../FirebaseAuth/Classes/CharacterStateManager';
import { NewCharacterForm } from './NewCharacterForm';

/**
 * The input properties for this component.
 */
export interface ICharacterManagerProps {
}

/**
 * The state managed by this component.
 * @param currentCharacterData The data for the current character. This will be taken from the
 * CharacterStateManager class.
 * @param allCharactersData The data aggregate for all characters. This will include the currently-selected
 * character.
 * @param isLoading If true, this component is still loading and hasn't yet finished getting info from the
 * database.
 * @param showNewCharForm If true, show the new character for for a user to create a new character.
 */
export interface ICharacterManagerState {
    currentCharacterData: PlayerCharacterData | undefined;
    allCharactersData: PlayerCharacterData[];
    isLoading: boolean;
    showNewCharForm: boolean;
}

/**
 * A high-level component used to show all available characters for a user, with the ability for
 * the user to switch between characters.
 */
export class CharacterManager extends React.Component<ICharacterManagerProps, ICharacterManagerState> {
    /**
     * Handles a new character button press. Shows the new character form.
     */
    private handleNewCharButtonClick(): void {
        this.setState({
            showNewCharForm: true
        });
    }

    /**
     * Handles when a user chooses to hide the new character form.
     */
    private handleHideModal(): void {
        this.setState({
            showNewCharForm: false
        });
    }

    /**
     * Handles when the user selects the 'submit' button for the new character form. Note that
     * this doesn't handle creating the character, this only handles the resulting behavior. This is primarily
     * because we need to prevent the default form submission behavior of the character sheet. Following this,
     * it makes sense to keep the continguous functional behavior in one place, the form logic.
     */
    private handleSubmitNewCharForm(): void {
        this.setState({
            showNewCharForm: false
        });
        this.UpdateCharacterData();
    }

    /**
     * Creates a new instances of this component.
     * @param props The input parameters for this component.
     */
    public constructor(props: ICharacterManagerProps) {
        super(props);
        this.state = {
            currentCharacterData: undefined,
            allCharactersData: [],
            isLoading: true,
            showNewCharForm: false
        };
    }

    /**
     * Renders this object in the visual display.
     */
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

    /**
     * Handles when the component has successfully mounted.
     */
    public componentDidMount() {
        this.UpdateCharacterData();
    }

    /**
     * Handles when a character button is selected.
     * @param charData The character data for the character that was just selected.
     */
    private handleCharacterSelected(charData: PlayerCharacterData): void {
        PlayerInventoryService.SetCurrentCharacter(charData.Name);
        this.UpdateCharacterData();
    }

    /**
     * Updates the character data visible in this component. Gets information from database to show this
     * user's characters.
     */
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
            CharacterStateManager.GetInstance().ChangeCharacter(currentCharacter);
        });
    }
}
