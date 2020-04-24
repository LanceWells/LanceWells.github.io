import React from 'react';
import { CharImageDownloadCallback } from '../Types/CharImageDownloadCallback';

export interface ICharacterImageCanvasProps {
    imagesToRender: string[];
    borderColor: string;
    downloadCallback: CharImageDownloadCallback;
};

export interface ICharacterImageCanvasState {
};

export class CharacterImageCanvas extends React.Component<ICharacterImageCanvasProps, ICharacterImageCanvasState> {
    private static canvasHeight: number = 256;
    private static canvasWidth:  number = 256;

    public constructor(props: ICharacterImageCanvasProps) {
        super(props);
        this.state = {
        };
    }

    public render() {
        this.LoadCharacterImages();
        
        return (
            <div className='character-canvas-container'>
                <canvas
                    height={CharacterImageCanvas.canvasHeight}
                    width={CharacterImageCanvas.canvasWidth}
                    id='character-canvas'
                    ref='characterCanvas'
                />
                <canvas
                    height={CharacterImageCanvas.canvasHeight}
                    width={CharacterImageCanvas.canvasWidth}
                    id='character-canvas-border'
                    ref='characterCanvasBorder'
                />
            </div>
        );
    }

    private async LoadCharacterImages() {
        let loadedImagesPromises: Promise<HTMLImageElement>[] = this.props.imagesToRender.map(i => {
            return new Promise<HTMLImageElement>(resolve => {
                let imageElement: HTMLImageElement = new Image();
                imageElement.onload = () => resolve(imageElement);
                imageElement.src = i;
            });
        });

        let imageElements: HTMLImageElement[] = await Promise.all(loadedImagesPromises);
        let charCanvas: HTMLCanvasElement = this.refs.characterCanvas as HTMLCanvasElement;
        let canvasContext: CanvasRenderingContext2D = charCanvas.getContext("2d") as CanvasRenderingContext2D;
        
        canvasContext.imageSmoothingEnabled = false;
        canvasContext.clearRect(0, 0, CharacterImageCanvas.canvasWidth, CharacterImageCanvas.canvasHeight);

        imageElements.forEach(ie => {
            canvasContext.drawImage(ie, 0, 0, CharacterImageCanvas.canvasWidth, CharacterImageCanvas.canvasHeight);
        });
    }
}
