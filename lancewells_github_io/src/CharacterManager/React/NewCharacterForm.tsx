import React, { ChangeEvent, FormEvent } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { BodyType } from '../../CharacterImage/Enums/BodyType';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { CharImageLayout } from '../../CharacterImage/Classes/CharImageLayout';
import { PlayerInventoryService } from '../../FirebaseAuth/Classes/PlayerInventoryService';
import { CharacterImageMap } from '../../CharacterImage/Classes/CharacterImageMap';

export interface INewCharacterFormProps {
    show: boolean;
    onHideModal: () => void;
    onFormSubmission: () => void;
}

export interface INewCharacterFormState {
    isCreating: boolean;
    inputIsValid: boolean;
    validationErrors: string[];
}

export class NewCharacterForm extends React.Component<INewCharacterFormProps, INewCharacterFormState> {
    private currentNewCharName: string;
    private currentBodyType: BodyType;

    public constructor(props: INewCharacterFormProps) {
        super(props);

        this.currentNewCharName = "";
        this.currentBodyType = BodyType.AverageSizedFeminine;

        this.state = {
            isCreating: false,
            inputIsValid: false,
            validationErrors: []
        };
    }

    private handleCharNameInput(event: ChangeEvent<HTMLInputElement>): void {
        let input = event.target?.value;
        if (input) {
            this.currentNewCharName = input;
        }

        this.validateInput();
    }

    private handleBodyTypeChange(event: ChangeEvent<HTMLSelectElement>): void {
        let input = event.target?.value;
        if (input) {
            this.currentBodyType = input as BodyType;
        }
        
        this.validateInput();
    }

    private validateInput() {
        let validCharNameRegex: RegExp = /^[A-Z0-9_ -]+$/i;
        let inputValid: boolean = true;
        let validationErrors: string[] = [];

        if (!this.currentNewCharName.match(validCharNameRegex)) {
            inputValid = false;
            validationErrors.push("Character names can only contain alphanumerics, underscores, and hyphens.")
        }

        this.setState({
            inputIsValid: inputValid,
            validationErrors: validationErrors
        });
    }

    private handleCreateCharacter(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.setState({
            isCreating: true
        });

        let charDefaults: CharImageLayout | undefined = CharacterImageMap.DefaultBodyParts.get(this.currentBodyType);
        let startingCharBits: CharImageLayout;

        if (charDefaults !== undefined) {
            startingCharBits = charDefaults;
        }
        else {
            startingCharBits = new CharImageLayout(new Map(), this.currentBodyType);
        }

        let newCharData: PlayerCharacterData = new PlayerCharacterData(
            this.currentNewCharName,
            0,
            [],
            startingCharBits,
            ""
        );

        PlayerInventoryService.CreateCharacterData(newCharData).then(() => {
            this.setState({
                isCreating: false
            });
            this.props.onFormSubmission();
        });
    }

    public render() {
        let formBodyOptions: JSX.Element[] = Object.values(BodyType).map(bt => {
            return (
                <option>
                    {bt.toString()}
                </option>
            )
        });

        let creatingMessage: boolean = this.state.isCreating;

        return (
            <Modal
                show={this.props.show}
                centered={true}
                onHide={this.props.onHideModal}
            >
                <Modal.Header>
                    <Modal.Title>New Character Deets</Modal.Title>
                </Modal.Header>
                {this.state.validationErrors.map(ve => (<span color="red">{ve}</span>))}
                <form className="new-character-form" onSubmit={this.handleCreateCharacter.bind(this)}>
                    <br />
                    <span className="new-character-form-title">
                        Character Name:
                    </span>
                    <input
                        type="text"
                        name="characterName"
                        className="new-character-form-field new-character-form-name"
                        onChange={this.handleCharNameInput.bind(this)}
                    />
                    <br />
                    <br />
                    <span className="new-character-form-title">
                        Body Type:
                    </span>
                    <select
                        id="new character body type"
                        className="new-character-form-field new-character-form-body-type"
                        onChange={this.handleBodyTypeChange.bind(this)}
                    >
                        {formBodyOptions}
                    </select>
                    <br />
                    <br />
                    <input
                        disabled={!this.state.inputIsValid || this.state.isCreating}
                        className="submit-new-character-button"
                        type="submit"
                        value="Create New Character"
                    />
                </form>
                <div style={{visibility: creatingMessage ? 'visible' : 'hidden'}}>
                    <Spinner
                        animation="border"
                        role="character button status"
                    />
                    <span>Creating {this.currentNewCharName} . . .</span>
                </div>
                <button
                        className="cancel-new-character-button"
                        onClick={this.props.onHideModal}
                    >
                        Close without creating
                </button>
            </Modal>
        )
    }
}
