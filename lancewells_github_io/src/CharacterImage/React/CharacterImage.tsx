import React from 'react';
import '../CharacterImage.css';

import { PartSelector } from './PartSelector';
import { CharacterDrawingArea } from './CharacterDrawingArea';

import { CharacterImageMap } from '../Classes/CharacterImageMap';
import { CharImageLayout } from '../Classes/CharImageLayout';

import { CharacterSize } from '../Enums/CharacterSize';
import { PartType } from '../Enums/PartType';
import { BodyType } from '../Enums/BodyType';

import { BodyTypeSelectionCallback } from '../Types/BodyTypeSelectionCallback';
import { PartTypeSelectionCallback } from '../Types/PartTypeSelectionCallback';
import { PartSelectionCallback } from '../Types/PartSelectionCallback';
import { CharImageDownloadCallback } from '../Types/CharImageDownloadCallback';
import { CharacterStateManager } from '../../FirebaseAuth/Classes/CharacterStateManager';
import { UserDataAuth } from '../../FirebaseAuth/Classes/UserDataAuth';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';

/**
 * @description
 * The interface for props passed to this object. This class in particular takes no props; it is effectively
 * the app itself.
 */
export interface ICharacterImageProps {
};

/**
 * @description
 * The interface for the internal state maintained by this object.
 * @param canvasImages The list of image sources, represented as strings, that will be rendered using the
 * Canvas class.
 * @param partLayers A list of image layers. This contains information about all of the possible layers that
 * can be drawn to the currently-selected body type. This contains information about what each layer is, how
 * that layer is drawn, and what the possible images are in that layer.
 */
export interface ICharacterImageState {
    charSize: CharacterSize;
    partType: PartType;
    charImageLayout: CharImageLayout;
    checkingForCharacterImage: boolean;
    borderStyle: string;
};

/**
 * @description The main entry point for the character drawing application. Provides all of the buttons and
 * fun stuff needed to create a character image on a canvas element.
 */
export class CharacterImage extends React.Component<ICharacterImageProps, ICharacterImageState> {
    private handlePartTypeChange(partType: PartType) {
        this.setState({
            partType: partType
        });
    }

    private handleBodyTypeChange(bodyType: BodyType) {
        let charImageLayout: CharImageLayout = new CharImageLayout(new Map<PartType, string>(), bodyType);

        if (CharacterImageMap.DefaultBodyParts.has(bodyType)) {
            charImageLayout = CharacterImageMap.DefaultBodyParts.get(bodyType) as CharImageLayout;
        }

        this.setState({
            charImageLayout: charImageLayout
        });
    }

    private handlePartSelection(partType: PartType, imgSource: string): void {
        let charImgLayout = this.state.charImageLayout;
        charImgLayout.SetPartImage(partType, imgSource);

        this.setState({
            charImageLayout: charImgLayout
        });
        
        CharacterStateManager.GetInstance().GetCharacter()
            .then(charData => {
                if (charData !== undefined) {
                    charData.CharLayout = this.state.charImageLayout;
                    
                    CharacterStateManager.GetInstance().UploadCharacterData(charData);
                }
            });
    }

    private handleBorderSelection(borderStyle: string): void {
        this.setState({
            borderStyle: borderStyle
        });

        CharacterStateManager.GetInstance().GetCharacter()
            .then(charData => {
                if (charData !== undefined) {
                    charData.BorderColor = borderStyle;

                    CharacterStateManager.GetInstance().UploadCharacterData(charData);
                }
            });
    }

    private handleCanvasDownload(downloadSource: string): void {
        if (downloadSource === undefined || downloadSource === "") {
            console.error("Character image was attempted to be downloaded with an empty, unset string.");
        }
        else {
            let link = document.createElement('a');

            link.download = 'characterImage.png';
            link.href = downloadSource;
            link.click();
        }
    }

    /**
     * @description Creates a new instance of this component.
     * @param props Higher-order properties passed in to this component.
     */
    public constructor(props: ICharacterImageProps) {
        super(props);
        this.state = {
            charSize: CharacterSize.Average,
            partType: PartType.Body,
            charImageLayout: new CharImageLayout(new Map(), BodyType.AverageSizedFeminine),
            checkingForCharacterImage: true,
            borderStyle: "#131313"
        }
        this.CheckForCharacterImage();

    }

    private async CheckForCharacterImage() {
        let charData: PlayerCharacterData | undefined = undefined;

        // Check to see if we have some character data we can load for this person. If so, update the current
        // layers so someone can modify their character!
        let userHasAccount: boolean = await UserDataAuth.GetInstance().CheckForAccess();
        if (userHasAccount) {
            charData = await CharacterStateManager.GetInstance().GetCharacter();
        }

        if (charData !== undefined) {
            console.log(charData);
            this.setState({
                charImageLayout: charData.CharLayout,
                checkingForCharacterImage: false,
                borderStyle: charData.BorderColor
            });
        }
        else {
            console.log("Could not load char data");
            this.setState({
                charImageLayout: CharacterImageMap.DefaultBodyParts.get(BodyType.AverageSizedFeminine) as CharImageLayout,
                checkingForCharacterImage: false
            })
        }
    }

    /**
     * @description
     * Renders a series of body selectors for the user to pick from. These body selectors will modify the list
     * of available accessories (since a tiny hat looks silly on a giant person . . . or does it?). Needs to
     * look at the BodyMap.tsx file to understand what will be populated.
     */
    public renderBodySelection() {
        return (<div></div>);
    }

    /**
     * @description Renders this component.
     */
    public render() {
        let imagePaths = CharacterImageMap.GetCharacterImagePaths(
            this.state.charSize,
            this.state.charImageLayout.BodyType,
            this.state.partType);
        
        let partTypeTabSelection: PartTypeSelectionCallback = (partType: PartType) => {
            this.handlePartTypeChange(partType);
        };

        let bodyTypeTabSelection: BodyTypeSelectionCallback = (bodyType: BodyType) => {
            this.handleBodyTypeChange(bodyType);
        };

        let partSelection: PartSelectionCallback = (partType: PartType, imgSource: string) => {
            this.handlePartSelection(partType, imgSource);
        };

        let canvasDownload: CharImageDownloadCallback = (downloadSource: string) => {
            this.handleCanvasDownload(downloadSource);
        };

        let charImages: string[] = this.state.charImageLayout.GetImages();
        console.log(`Render called with images: ${charImages}`);

        return (
            <div className="character-image">
                <CharacterDrawingArea
                    borderColor={this.state.borderStyle}
                    showLoadingSpinner={this.state.checkingForCharacterImage}
                    imagesToRender={charImages}
                    downloadCallback={canvasDownload.bind(this)}
                    borderCallback={this.handleBorderSelection.bind(this)}
                />
                <PartSelector
                    partSelectionCallback={partSelection.bind(this)}
                    bodyTypeSelectionCallback={bodyTypeTabSelection.bind(this)}
                    partTypeSelectionCallback={partTypeTabSelection.bind(this)}
                    partType={this.state.partType}
                    partOptions={imagePaths}
                />
            </div>
        );
    }
}
