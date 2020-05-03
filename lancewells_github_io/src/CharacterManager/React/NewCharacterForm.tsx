import React, { ChangeEvent, FormEvent } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { BodyType } from '../../CharacterImage/Enums/BodyType';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { CharImageLayout } from '../../CharacterImage/Classes/CharImageLayout';
import { PlayerInventoryService } from '../../FirebaseAuth/Classes/PlayerInventoryService';
import { CharacterImageMap } from '../../CharacterImage/Classes/CharacterImageMap';

/**
 * The input properties for this component.
 * @param show If true, make this component visible and centered on-screen.
 * @param existingCharacterNames A list of existing character names. This is strictly only the names for
 * characters that have been created. This is to ensure a duplicate character is not created.
 * @param onHideModal A callback for when the user requests that the modal is closed.
 * @param onFormSubmission A callback for when the form has been submitted.
 */
export interface INewCharacterFormProps {
    show: boolean;
    existingCharacterNames: string[];
    onHideModal: () => void;
    onFormSubmission: () => void;
}

/**
 * A class used to maintain the state for this component.
 * @param isCreating If true, render this component as though it is creating a new character.
 * @param inputIsValid If false, prevent form submission and display validation errors.
 * @param validationErrors A list of errors regarding character name validation.
 */
export interface INewCharacterFormState {
    isCreating: boolean;
    inputIsValid: boolean;
    validationErrors: string[];
}

/**
 * A form contained within a modal. Used to provide a user with the means to create a new character.
 */
export class NewCharacterForm extends React.Component<INewCharacterFormProps, INewCharacterFormState> {
    private currentNewCharName: string;
    private currentBodyType: BodyType;

    /**
     * Creates a new instance of this object.
     * @param props The input properties for this component.
     */
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

    /**
     * Handles when the user inputs data to the character name field.
     * @param event The event arguments when the name field is changed.
     */
    private handleCharNameInput(event: ChangeEvent<HTMLInputElement>): void {
        let input = event.target?.value;
        if (input) {
            this.currentNewCharName = input;
        }

        this.validateInput();
    }

    /**
     * Handles when the user inputs data to the body type field.
     * @param event The event arguments when the body type field is changed.
     */
    private handleBodyTypeChange(event: ChangeEvent<HTMLSelectElement>): void {
        let input = event.target?.value;
        if (input) {
            this.currentBodyType = input as BodyType;
        }
        
        this.validateInput();
    }

    /**
     * Validates the form's input. Will prevent submission if validation indicates errors.
     */
    private validateInput() {
        let validCharNameRegex: RegExp = /^[A-Z0-9_ -]+$/i;
        let inputValid: boolean = true;
        let validationErrors: string[] = [];

        if (!this.currentNewCharName.match(validCharNameRegex)) {
            inputValid = false;
            validationErrors.push("Character names can only contain alphanumerics, underscores, and hyphens.")
        }

        if (this.props.existingCharacterNames.some(existingName => this.currentNewCharName === existingName)) {
            inputValid = false;
            validationErrors.push(`${this.currentNewCharName} already exists!`);
        }

        this.setState({
            inputIsValid: inputValid,
            validationErrors: validationErrors
        });
    }

    /**
     * Handles the form's submission event. This creates a new character and informs watchers to proceed with
     * their next events.
     * @param event The event data concerning the submission.
     */
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

    /**
     * Renders the component.
     */
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
                <div className="new-character-form-errors">
                    {
                        this.state.validationErrors.map(errormessage => (<span>{errormessage}</span>))
                    }
                </div>
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
