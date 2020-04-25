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
    bodyType: BodyType;
    partType: PartType;
    charImageLayout: CharImageLayout;
};

/**
 * The main entry point for this application. Provides all of the buttons and fun stuff needed to create a
 * character image on a canvas element.
 */
export class CharacterImage extends React.Component<ICharacterImageProps, ICharacterImageState> {
    constructor(props: ICharacterImageProps) {
        super(props);
        this.state = {
            charSize: CharacterSize.Average,
            bodyType: BodyType.AverageSizedFeminine,
            partType: PartType.Body,
            charImageLayout: CharacterImageMap.DefaultBodyParts.get(BodyType.AverageSizedFeminine) as CharImageLayout
        }
    }

    /**
     * @description
     * Used to download the main character image from the canvas. This is a callback that is passed down to
     * the canvas element.
     * @param canvas The canvas html element from the Canvas character creator class.
     */
    downloadImage(canvas: HTMLCanvasElement)
    {
        const downloadUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');

        link.download = 'characterImage.png';
        link.href = downloadUrl;
        link.click();
    }

    private handlePartTypeChange(partType: PartType) {
        this.setState({
            partType: partType
        });
    }

    private handleBodyTypeChange(bodyType: BodyType) {
        let charImageLayout: CharImageLayout = new CharImageLayout(new Map<PartType, string>())

        if (CharacterImageMap.DefaultBodyParts.has(bodyType)) {
            charImageLayout = CharacterImageMap.DefaultBodyParts.get(bodyType) as CharImageLayout;
        }

        this.setState({
            bodyType: bodyType,
            charImageLayout: charImageLayout
        });
    }

    private handlePartSelection(partType: PartType, imgSource: string): void {
        let charImgLayout = this.state.charImageLayout;
        charImgLayout.SetPartImage(partType, imgSource);

        this.setState({
            charImageLayout: charImgLayout
        });
    }

    private handleCanvasDownload(downloadSource: string): void {
    }

    /**
     * @description
     * Renders a series of body selectors for the user to pick from. These body selectors will modify the list
     * of available accessories (since a tiny hat looks silly on a giant person . . . or does it?). Needs to
     * look at the BodyMap.tsx file to understand what will be populated.
     */
    renderBodySelection() {
        return (<div></div>);
    }

    /**
     * Renders this object.
     */
    render() {
        let imagePaths = CharacterImageMap.GetCharacterImagePaths(this.state.charSize, this.state.bodyType, this.state.partType);
        
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

        return (
            <div className="character-image">
                <CharacterDrawingArea
                    imagesToRender={charImages}
                    downloadCallback={canvasDownload.bind(this)}
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
