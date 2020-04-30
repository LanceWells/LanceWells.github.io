import React from 'react';
import { PlayerInventoryService } from '../../FirebaseAuth/Classes/PlayerInventoryService';

export interface ICharacterManagerProps {
}

export interface ICharacterManagerState {
}

export class CharacterManager extends React.Component<ICharacterManagerProps, ICharacterManagerState> {
    public constructor(props: ICharacterManagerProps) {
        super(props);
        this.state = {
        };
    }

    public render() {
        return (
            <div>
                {this.GetCharacterNameMessage()}
            </div>
        )
    }

    private GetCharacterNameMessage(): JSX.Element {
        let characterName: string | null = PlayerInventoryService.GetCurrentCharacterName();

        let message: JSX.Element = (
            <div>
                <h6>No characters yet! You should make one!</h6>
            </div>
        );

        if (characterName) {
            message = (
                <div>
                    <h6>You are playing as . . </h6>
                    <h2>{characterName}</h2>
                </div>
            )
        }

        return message;
    }
}
