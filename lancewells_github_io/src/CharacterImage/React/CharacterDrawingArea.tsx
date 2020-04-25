import React from 'react';
import { CharImageDownloadCallback } from '../Types/CharImageDownloadCallback';
import { CharacterImageCanvas } from './CharacterImageCanvas';
import { ColorResult, CirclePicker } from 'react-color';

export interface ICharacterDrawingAreaProps {
    imagesToRender: string[];
    downloadCallback: CharImageDownloadCallback;
}

export interface ICharacterDrawingAreaState {
    borderColor: string;
}

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

    public constructor(props: ICharacterDrawingAreaProps) {
        super(props);
        this.state = {
            borderColor: "rgb(10, 10, 10)"
        };
    }

    private handleColorChange(color: ColorResult): void {
        this.setState({
            borderColor: color.hex
        });
    }

    public render() {
        return (
            <div>
                <CharacterImageCanvas
                    imagesToRender={this.props.imagesToRender}
                    borderColor={this.state.borderColor}
                />
                <CirclePicker
                    onChangeComplete={this.handleColorChange.bind(this)}
                    color={this.state.borderColor}
                    colors={CharacterDrawingArea.outlineColorOptions}
                />
            </div>
        )
    }
}
