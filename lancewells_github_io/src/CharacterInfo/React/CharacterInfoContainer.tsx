import '../CharacterInfo.css';

import React from 'react';
import { MoneyDisplay } from './MoneyDisplay';
import { MoneyAdjustModal } from './MoneyAdjustModal';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { CharImageLayout } from '../../CharacterImage/Classes/CharImageLayout';
import { BodyType } from '../../CharacterImage/Enums/BodyType';
import { CharacterStateManager } from '../../FirebaseAuth/Classes/CharacterStateManager';
import { UserDataAuth } from '../../FirebaseAuth/Classes/UserDataAuth';
import { LoginState } from '../../LoginPage/Enums/LoginState';
import { LoadingPlaceholder } from '../../Utilities/React/LoadingPlaceholder';

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
        this.UpdateCharDisplay();
    }

    public characterStateManager_NotifyObservers(charData: PlayerCharacterData | undefined): void {
        if (charData !== undefined) {
            this.setState({
                charData: charData
            });
        }
    }

    public componentDidUpdate(prevProps: ICharacterInfoContainerProps): void {
        if (this.props.loginState !== prevProps.loginState) {
            // basically, use this to handle login or logout events. otherwise, just load what we have. the auto-login is messing with using only this.
            this.UpdateCharDisplay();
        }
    }

    public render() {
        return (
            <div className="character-info-container">
                {this.GetContextualContent()}
            </div>
        );
    }

    private GetContextualContent(): JSX.Element {
        switch(this.state.loadingState) {
            case LoadingState.Loading:      
            case LoadingState.Loaded:       return this.GetLoadedContent();
            case LoadingState.NoCharacters: return this.GetNoCharsContent();
            case LoadingState.Anonymous:    
            default:                        return this.GetAnonContent();
        }
    }

    private GetLoadedContent(): JSX.Element {
        return (
            <div className="character-info-content">
                <LoadingPlaceholder
                    showSpinner={this.state.loadingState === LoadingState.Loading}
                    role="Character info status">
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
                </LoadingPlaceholder>
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
                showMoneyAdjustModalProcessing: false,
                showMoneyAdjustModal: false
            });
        });
    }
}
