import '../CharacterInfo.css';

import React from 'react';
import { MoneyDisplay } from './MoneyDisplay';
import { MoneyAdjustModal } from './MoneyAdjustModal';
import { Spinner } from 'react-bootstrap';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { CharImageLayout } from '../../CharacterImage/Classes/CharImageLayout';
import { BodyType } from '../../CharacterImage/Enums/BodyType';
import { CharacterStateManager } from '../../FirebaseAuth/Classes/CharacterStateManager';
import { UserDataAuth } from '../../FirebaseAuth/Classes/UserDataAuth';
import { LoginState } from '../../LoginPage/Enums/LoginState';

enum LoadingState {
    Loading,
    Loaded,
    Anonymous,
    NoCharacters
}

interface ICharacterInfoContainerProps {
    loginState: LoginState;
}

interface ICharacterInfoContainerState {
    charData: PlayerCharacterData;
    showMoneyAdjustModal: boolean;
    showMoneyAdjustModalProcessing: boolean;
    loadingState: LoadingState;
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
            charData: defaultCharData,
            showMoneyAdjustModal: false,
            showMoneyAdjustModalProcessing: false,
            loadingState: LoadingState.Loading
        }

        CharacterStateManager.GetInstance().AddObserver(this.characterStateManager_NotifyObservers.bind(this))
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
        return (
            <div className="character-info-container">
                {this.GetContextualContent()}
            </div>
        );
    }

    private GetContextualContent(): JSX.Element {
        if (this.props.loginState !== LoginState.LoggedIn) {
            return this.GetAnonContent();
        }

        switch(this.state.loadingState) {
            case LoadingState.Loading:      return this.GetLoadingContent();
            case LoadingState.Loaded:       return this.GetLoadedContent();
            case LoadingState.Anonymous:    return this.GetAnonContent();
            case LoadingState.NoCharacters: 
            default:                        return this.GetNoCharsContent();
        }
    }

    private GetLoadingContent(): JSX.Element {
        return (
            <Spinner
                className="character-info-spinner"
                animation="border"
                role="character info status"
            />
        );
    }

    private GetLoadedContent(): JSX.Element {
        return (
            <div className="character-info-content">
                <MoneyAdjustModal
                    show={this.state.showMoneyAdjustModal}
                    hideModal={this.HandleHideMoneyAdjustModal.bind(this)}
                    playerCopper={this.state.charData.Copper}
                    showAsProcessing={this.state.showMoneyAdjustModalProcessing}
                    moneyAdjustCallback={this.HandleCopperAdjustCallback.bind(this)}
                />
                <span className="character-info-name">
                    {this.state.charData.Name}
                </span>
                <MoneyDisplay
                    playerCopper={this.state.charData.Copper}
                />
                <button
                    className="character-money-add"
                    onClick={this.HandleMoneyAdjustButtonClick.bind(this)}>
                    +
                </button>
            </div>
        );
    }

    private GetAnonContent(): JSX.Element {
        return (
            <div>
                Logged Out
            </div>
        )
    }

    private GetNoCharsContent(): JSX.Element {
        return (
            <div>
                No Characters
            </div>
        )
    }

    private async UpdateCharDisplay(): Promise<void> {
        let userHasAccess: boolean = await UserDataAuth.GetInstance().CheckForAccess();
        let loadingState: LoadingState = LoadingState.Anonymous;
        let newCharData: PlayerCharacterData = this.state.charData;

        if (userHasAccess) {
            let staticCharData: PlayerCharacterData | undefined = undefined; 
            staticCharData = await CharacterStateManager.GetInstance().GetCurrentStaticCharacterData();
            
            if (staticCharData === undefined) {
                loadingState = LoadingState.NoCharacters;
            }
            if (staticCharData !== undefined) {
                newCharData = staticCharData;    
                loadingState = LoadingState.Loaded;
            }
        }

        this.setState({
            loadingState: loadingState,
            charData: newCharData
        });
    }

    private HandleMoneyAdjustButtonClick(): void {
        this.setState({
            showMoneyAdjustModal: true
        });
    }

    private HandleHideMoneyAdjustModal(): void {
        this.setState({
            showMoneyAdjustModal: false
        });
    }

    private HandleCopperAdjustCallback(newCopperTotal: number): void {
        let charData: PlayerCharacterData = this.state.charData;
        charData.Copper = newCopperTotal;

        this.setState({
            showMoneyAdjustModalProcessing: true
        });

        CharacterStateManager.GetInstance().UploadCharacterData(charData).then(() => {
            this.setState({
                charData: charData,
                showMoneyAdjustModalProcessing: false
            });
        });
    }
}
