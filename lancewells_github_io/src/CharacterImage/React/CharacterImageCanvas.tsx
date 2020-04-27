import React from 'react';
import { CharacterImageMap } from '../Classes/CharacterImageMap';

/**
 * @description The properties for this class.
 * @param imagesToRender A list of images that will be rendered in-order, in the drawing area. Note that the
 * order of this array determines how images will be drawn.
 * @param borderColor A css-tyle-string to be used to color the border for this character.
 */
export interface ICharacterImageCanvasProps {
    imagesToRender: string[];
    borderColor: string;
};

/**
 * @description The state maintained by this component.
 */
export interface ICharacterImageCanvasState {
};

/**
 * @description Used to display a character image and its associated border, specified by the properties.
 */
export class CharacterImageCanvas extends React.Component<ICharacterImageCanvasProps, ICharacterImageCanvasState> {
    private static canvasHeight: number = 512;
    private static canvasWidth:  number = 256;

    private static charScaleFactor: number = 4;
    private static charPartOffset: number = 32;
    private static shadowOffset: number = 90;

    /**
     * Note that the numbers stored here are effectively pairs of coordinates to offset the
     * image stamping by, scaled by the desired thickness of the border.
     * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing
     */
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
                <canvas
                    height={CharacterImageCanvas.canvasHeight}
                    width={CharacterImageCanvas.canvasWidth}
                    id='character-effects-canvas'
                    ref='characterEffectsCanvas'
                />
            </div>
        );
    }

    /**
     * @description Gets the download url for this image. This can be used to get the image via a data url.
     */
    public GetDownloadUrl(): string {
        let effectsCanvas: HTMLCanvasElement = this.refs.characterEffectsCanvas as HTMLCanvasElement;
        let downloadUrl: string = effectsCanvas.toDataURL('image/png');

        return downloadUrl;
    }

    /**
     * @description Handles events when the component has mounted.
     */
    public componentDidMount() {
        let charStagingCanvas: HTMLCanvasElement = this.refs.characterStagingCanvas as HTMLCanvasElement;
        let stagingCanvasContext: CanvasRenderingContext2D = charStagingCanvas.getContext("2d") as CanvasRenderingContext2D;

        let charCanvas: HTMLCanvasElement = this.refs.characterCanvas as HTMLCanvasElement;
        let charCanvasContext: CanvasRenderingContext2D = charCanvas.getContext("2d") as CanvasRenderingContext2D;

        let effectsCanvas: HTMLCanvasElement = this.refs.characterEffectsCanvas as HTMLCanvasElement;
        let effectsCanvasContext: CanvasRenderingContext2D = effectsCanvas.getContext("2d") as CanvasRenderingContext2D;

        // This is going around the css, but ideally we don't ever want this disply context to change. The
        // sole point of this canvas element is to get a stapled-together version of our final character
        // drawing.
        charStagingCanvas.style.display = 'none';
        charCanvas.style.display = 'none';

        // This is all done with upsacled pixels, so absolutely no anti-aliasing.
        stagingCanvasContext.imageSmoothingEnabled = false;
        charCanvasContext.imageSmoothingEnabled = false;
        effectsCanvasContext.imageSmoothingEnabled = false;

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
        await this.DrawCharacterBorder();
        await this.DrawCharacterWithEffects();
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
        stagingCanvasContext.clearRect(0, 0, charStagingCanvas.width, charStagingCanvas.height);

        // Now draw all of the individual character components layer-by-layer, from front to back.
        imagesToDraw.forEach(itd => {
            stagingCanvasContext.drawImage(
                itd,
                0,
                CharacterImageCanvas.charPartOffset * CharacterImageCanvas.charScaleFactor,
                itd.width * CharacterImageCanvas.charScaleFactor,
                itd.height * CharacterImageCanvas.charScaleFactor);
        });
    }

    /**
     * @description Draws the character image, along with a 1px border using the specified color.
     * @remarks https://stackoverflow.com/questions/28207232/draw-border-around-nontransparent-part-of-image-on-canvas
     * Something to note about this algorith; it can only draw borders of a thickness equal to the smallest
     * outlying pixel. So, our resolution for pixels on this canvas is '4', which means that the thickness
     * must be 4, or else we end up with weird stamping artifacts.
     */
    private async DrawCharacterBorder() {
        let charStagingCanvas: HTMLCanvasElement = this.refs.characterStagingCanvas as HTMLCanvasElement;
        let charCanvas: HTMLCanvasElement = this.refs.characterCanvas as HTMLCanvasElement;
        let canvasContext: CanvasRenderingContext2D = charCanvas.getContext("2d") as CanvasRenderingContext2D;

        // Get the character staging image. This is our character image that is drawn layer-by-layer. We
        // 'stamp' this image 8 times in a circle to populate each pixel that we plan to use as a border.
        let charImg: HTMLImageElement = await new Promise<HTMLImageElement>(resolve => {
            let charImgSrc: string = charStagingCanvas.toDataURL('image/png');
            let char: HTMLImageElement = new Image();
            char.onload = () => resolve(char)
            char.src = charImgSrc;
        });

        // First, wipe the canvas. This needs to be cleared every time we re-render and re-draw.
        canvasContext.clearRect(0, 0, charCanvas.width, charCanvas.height);

        for (let i: number = 0; i < CharacterImageCanvas.borderCoordinates.length; i += 2) {
            let thicknessScale: number = CharacterImageCanvas.charScaleFactor;
            let xCoord: number = CharacterImageCanvas.borderCoordinates[i];
            let yCoord: number = CharacterImageCanvas.borderCoordinates[i + 1];

            canvasContext.drawImage(charImg, xCoord * thicknessScale, yCoord * thicknessScale);
        }

        canvasContext.globalCompositeOperation = "source-in";
        canvasContext.fillStyle = this.props.borderColor;
        canvasContext.fillRect(0, 0, charCanvas.width, charCanvas.height);
        canvasContext.globalCompositeOperation = "source-over";
    }

    /**
     * @description Draws the character image, along with a 1px border using the specified color.
     * @remarks https://stackoverflow.com/questions/28207232/draw-border-around-nontransparent-part-of-image-on-canvas
     * Something to note about this algorith; it can only draw borders of a thickness equal to the smallest
     * outlying pixel. So, our resolution for pixels on this canvas is '4', which means that the thickness
     * must be 4, or else we end up with weird stamping artifacts.
     */
    private async DrawCharacterWithEffects() {
        let charStagingCanvas: HTMLCanvasElement = this.refs.characterStagingCanvas as HTMLCanvasElement;
        let borderCanvas: HTMLCanvasElement = this.refs.characterCanvas as HTMLCanvasElement;
        let effectsCanvas: HTMLCanvasElement = this.refs.characterEffectsCanvas as HTMLCanvasElement;
        let effectsCanvasContext: CanvasRenderingContext2D = effectsCanvas.getContext("2d") as CanvasRenderingContext2D;

        let shadowImg: HTMLImageElement = await new Promise<HTMLImageElement>(resolve => {
            let shadowImgSrc: string = CharacterImageMap.CharacterShadowSource;
            let shadow: HTMLImageElement = new Image();
            shadow.onload = () => resolve(shadow);
            shadow.src = shadowImgSrc;
        });

        let charBorderImg: HTMLImageElement = await new Promise<HTMLImageElement>(resolve => {
            let charBorderImgSrc: string = borderCanvas.toDataURL('image/png');
            let border: HTMLImageElement = new Image();
            border.onload = () => resolve(border);
            border.src = charBorderImgSrc;
        });

        let charImg: HTMLImageElement = await new Promise<HTMLImageElement>(resolve => {
            let charImgSrc: string = charStagingCanvas.toDataURL('image/png');
            let char: HTMLImageElement = new Image();
            char.onload = () => resolve(char);
            char.src = charImgSrc;
        });

        // First, wipe the canvas. This needs to be cleared every time we re-render and re-draw.
        effectsCanvasContext.clearRect(0, 0, effectsCanvas.width, effectsCanvas.height);

        // Draw the shadow underneath a character's feet first. This puts it as far in the background as
        // possible.
        effectsCanvasContext.drawImage(
            shadowImg,
            0,
            CharacterImageCanvas.shadowOffset * CharacterImageCanvas.charScaleFactor,
            shadowImg.width * CharacterImageCanvas.charScaleFactor,
            shadowImg.height * CharacterImageCanvas.charScaleFactor
            );

        effectsCanvasContext.drawImage(charBorderImg, 0, 0);
        effectsCanvasContext.drawImage(charImg, 0, 0);
    }
}
