import React from 'react';
import { CharImageDownloadCallback } from '../Types/CharImageDownloadCallback';
import { CharacterImageCanvas } from './CharacterImageCanvas';
import { ColorResult, CirclePicker } from 'react-color';

/**
 * @description The properties for this class.
 * @param imagesToRender A list of images that will be rendered in-order, in the drawing area. Note that the
 * order of this array determines how images will be drawn.
 * @param downloadCallback A callback when the download button is clicked in this component.
 */
export interface ICharacterDrawingAreaProps {
    showLoadingSpinner: boolean;
    imagesToRender: string[];
    downloadCallback: CharImageDownloadCallback;
}

/**
 * @description The state for this class.
 * @param borderColor A css-style-string used to color the border for the character. This will come from the
 * circle color picker.
 * @param downloadUrl A data url that will be used when providing the callback for the download button.
 */
export interface ICharacterDrawingAreaState {
    borderColor: string;
    downloadUrl: string;
}

/**
 * A high-level container for the character drawing area. Contains the border color controls, the download
 * button and the character canvas.
 */
export class CharacterDrawingArea extends React.Component<ICharacterDrawingAreaProps, ICharacterDrawingAreaState> {
    private static outlineColorOptions =
    [
        '#131313',
        '#ffffff',
        '#c42430',
        '#ffeb57',
        '#5ac54f',
        '#0cf1ff'
    ];

    /**
     * @description Creates a new instance of this class.
     * @param props The provided properties for this class.
     */
    public constructor(props: ICharacterDrawingAreaProps) {
        super(props);
        this.state = {
            borderColor: "rgb(10, 10, 10)",
            downloadUrl: ""
        };
    }

    /**
     * @description Renders this component.
     */
    public render() {
        return (
            <div className="character-drawing-area">
                <CharacterImageCanvas
                    showLoadingSpinner={this.props.showLoadingSpinner}
                    ref="charImageCanvas"
                    imagesToRender={this.props.imagesToRender}
                    borderColor={this.state.borderColor}
                />
                <span className="character-drawing-label">
                    Border Color
                </span>
                <CirclePicker
                    onChangeComplete={this.handleColorChange.bind(this)}
                    color={this.state.borderColor}
                    colors={CharacterDrawingArea.outlineColorOptions}
                />
                <button className="character-image-download"
                    onClick={() => this.props.downloadCallback(this.fetchDownloadUrl())}>
                    &gt;&gt;Download&lt;&lt;
                </button>
            </div>
        );
    }


    private handleColorChange(color: ColorResult): void {
        this.setState({
            borderColor: color.hex
        });
    }

    private fetchDownloadUrl(): string {
        let charImgCanvas: CharacterImageCanvas = this.refs.charImageCanvas as CharacterImageCanvas;
        let downloadUrl = charImgCanvas.GetDownloadUrl();

        return downloadUrl;
    }
}
