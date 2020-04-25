import React from 'react';
import { CharImageDownloadCallback } from '../Types/CharImageDownloadCallback';

export interface ICharacterImageCanvasProps {
    imagesToRender: string[];
    borderColor: string;
    downloadCallback: CharImageDownloadCallback;
};

export interface ICharacterImageCanvasState {
};

/**
 * @description Used to display a character image and its associated border, specified by the properties.
 */
export class CharacterImageCanvas extends React.Component<ICharacterImageCanvasProps, ICharacterImageCanvasState> {
    private static canvasHeight: number = 256;
    private static canvasWidth:  number = 256;
    private static borderCoordinates: number[] =
    [
        -1, -1,
         0, -1,
         1, -1,
        -1,  0,
         1,  0,
        -1,  1,
         0,  1,
         1,  1
    ];

    /**
     * @description Creates a new isntance of this object.
     * @param props The properties for this object.
     */
    public constructor(props: ICharacterImageCanvasProps) {
        super(props);
        this.state = {
        };
    }

    /**
     * @description Renders this object.
     */
    public render() {
        return (
            <div className='character-canvas-container'>
                <canvas
                    height={CharacterImageCanvas.canvasHeight}
                    width={CharacterImageCanvas.canvasWidth}
                    id='character-staging-canvas'
                    ref='characterStagingCanvas'
                />
                <canvas
                    height={CharacterImageCanvas.canvasHeight}
                    width={CharacterImageCanvas.canvasWidth}
                    id='character-canvas'
                    ref='characterCanvas'
                />
            </div>
        );
    }

    /**
     * @description Handles events when the component has mounted.
     */
    public componentDidMount() {
        let charStagingCanvas: HTMLCanvasElement = this.refs.characterStagingCanvas as HTMLCanvasElement;
        let stagingCanvasContext: CanvasRenderingContext2D = charStagingCanvas.getContext("2d") as CanvasRenderingContext2D;

        // This is going around the css, but ideally we don't ever want this disply context to change. The
        // sole point of this canvas element is to get a stapled-together version of our final character
        // drawing.
        charStagingCanvas.style.display = 'none';

        let charCanvas: HTMLCanvasElement = this.refs.characterCanvas as HTMLCanvasElement;
        let charCanvasContext: CanvasRenderingContext2D = charCanvas.getContext("2d") as CanvasRenderingContext2D;

        // This is all done with upsacled pixels, so absolutely no anti-aliasing.
        stagingCanvasContext.imageSmoothingEnabled = false;
        charCanvasContext.imageSmoothingEnabled = false;

        // Draw the character and the border after the component has mounted. This is so that we have at least
        // some default character when we load the page.
        this.DrawCharacterAndBorder();
    }

    /**
     * @description Handles events when the component has updated.
     */
    public componentDidUpdate() {
        this.DrawCharacterAndBorder();

    }

    /**
     * @description Draws the character image along with a border for the character. Will clean the canvas on
     * when called.
     */
    private async DrawCharacterAndBorder(): Promise<void> {
        await this.LoadCharacterImages();
        await this.DrawCharacterWithBorder();
    }

    /**
     * @description Loads all of the images used to draw a character.
     */
    private async LoadCharacterImages(): Promise<void> {
        // Create an array of html image elements. This will be populated as images are loaded.
        let imagesToDraw: HTMLImageElement[] = new Array(this.props.imagesToRender.length);

        let loadedImagesPromises: Promise<void>[] = this.props.imagesToRender.map((img, index) => {
            return new Promise<void>(resolve => {
                let imageElement: HTMLImageElement = new Image();
                imageElement.onload = () => resolve();
                imageElement.src = img;
                imagesToDraw[index] = imageElement;
            });
        });

        await Promise.all(loadedImagesPromises);

        let charStagingCanvas: HTMLCanvasElement = this.refs.characterStagingCanvas as HTMLCanvasElement;
        let stagingCanvasContext: CanvasRenderingContext2D = charStagingCanvas.getContext("2d") as CanvasRenderingContext2D;

        // First, wipe the canvas. This needs to be cleared every time we re-render and re-draw.
        stagingCanvasContext.clearRect(0, 0, CharacterImageCanvas.canvasWidth, CharacterImageCanvas.canvasHeight);

        imagesToDraw.forEach(itd => {
            stagingCanvasContext.drawImage(itd, 0, 0, CharacterImageCanvas.canvasWidth, CharacterImageCanvas.canvasHeight);
        });
    }

    /**
     * @description Draws the character image, along with a 1px border using the specified color.
     */
    private async DrawCharacterWithBorder() {
        let charStagingCanvas: HTMLCanvasElement = this.refs.characterStagingCanvas as HTMLCanvasElement;
        let charCanvas: HTMLCanvasElement = this.refs.characterCanvas as HTMLCanvasElement;
        let canvasContext: CanvasRenderingContext2D = charCanvas.getContext("2d") as CanvasRenderingContext2D;

        // Get the character staging image. This is our character image that is drawn layer-by-layer. We
        // 'stamp' this image 8 times in a circle to populate each pixel that we plan to use as a border.
        let charImgSrc: string = charStagingCanvas.toDataURL('image/png');
        let charImg: HTMLImageElement = new Image(CharacterImageCanvas.canvasWidth, CharacterImageCanvas.canvasHeight);
        charImg.src = charImgSrc;

        await new Promise<void>(resolve => {
            charImg.onload = () => resolve()
        });

        // First, wipe the canvas. This needs to be cleared every time we re-render and re-draw.
        canvasContext.clearRect(0, 0, CharacterImageCanvas.canvasWidth, CharacterImageCanvas.canvasHeight);

        for (let i: number = 0; i < CharacterImageCanvas.borderCoordinates.length; i += 2) {
            let thicknessScale: number = 4;
            let xCoord: number = CharacterImageCanvas.borderCoordinates[i];
            let yCoord: number = CharacterImageCanvas.borderCoordinates[i + 1];

            canvasContext.drawImage(charImg, xCoord * thicknessScale, yCoord * thicknessScale);
        }

        canvasContext.globalCompositeOperation = "source-in";
        canvasContext.fillStyle = "rgb(0, 0, 0)";
        canvasContext.fillRect(0, 0, charCanvas.width, charCanvas.height);

        canvasContext.globalCompositeOperation = "source-over";
        canvasContext.drawImage(charImg, 0, 0);
    }
}
