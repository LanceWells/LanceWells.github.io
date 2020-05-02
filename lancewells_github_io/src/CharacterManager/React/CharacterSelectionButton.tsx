import React from 'react';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { SelectedCharacterCallback } from '../Types/SelectedCharacterCallback';
import { CharacterImageCanvas } from '../../CharacterImage/React/CharacterImageCanvas';

export interface ICharacterSelectionButtonProps {
    characterData: PlayerCharacterData;
    characterSelectedCallback: SelectedCharacterCallback;
}

export interface ICharacterSelectionButtonState {
}

export class CharacterSelectionButton extends React.Component<ICharacterSelectionButtonProps, ICharacterSelectionButtonState> {
    public constructor(props: ICharacterSelectionButtonProps) {
        super(props);
        this.state = {
        };
    }

    public render() {
        return (
            <div className="character-selector-container">
                <button
                    className="character-selection-button"
                    onClick={() => this.props.characterSelectedCallback(this.props.characterData)}>
                    <CharacterImageCanvas
                        charScaleFactor={2}
                        showLoadingSpinner={false}
                        imagesToRender={this.props.characterData.CharLayout.GetImages()}
                        borderColor={this.props.characterData.BorderColor}
                        />
                </button>
                <span className="character-selection-name">
                    {this.props.characterData.Name}
                </span>
            </div>
        )
    }
}
