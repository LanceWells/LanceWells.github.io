// https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76
import React from 'react';
import Button from 'react-bootstrap/Button';
import { Color, ColorResult, CirclePicker } from 'react-color';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';

/**
 * @description An interface used to describe the elements provided to this class at creation.
 */
interface ICanvasProps {
    /**
     * @description A list of images to render. This may be updated at-will by the parent, and this element
     * will render those new images.
     */
    imagesToRender: string[];

    /**
     * @description A callback to this class' "DOWNLOAD" button. Owned by the parent.
     */
    onClickDownload: Function;
}

/**
 * @description An interface used to describe the elements maintained by this class' internal state.
 */
interface ICanvasState {
    /**
     * @description The color of the outline border for the character's profile. This will be included when
     * saving the image.
     */
    outlineColor: Color;
}

/**
 * @description A class used to display a character's profile on a canvas element. Also provides a border,
 * tools to change the color of the border, and a means to download the image itself.
 */
export class CharacterCanvas extends React.Component<ICanvasProps, ICanvasState> {
    /**
     * @description The height of the canvas' used by this object.
     */
    canvasHeight: number = 256;

    /**
     * @description The width of the canvas' used by this object.
     */
    canvasWidth: number = 256;

    /**
     * @description A list of all possible outline color that may be used by the canvas.
     */
    outlineColors: string[] = ["#131313", "#ffffff", "#571c27" ];

    /**
     * @description The constructor for this object.
     * @param props A list of properties provided by the parent object.
     */
    constructor(props: Readonly<ICanvasProps>) {
        super(props);
        this.state = {
            outlineColor: "#ffffff"
        };
    }

    /**
     * A handler for when this component has been fully loaded. Establishes some basic settings about how to
     * handle the image.
     */
    componentDidMount() {
        const canvas = this.refs.canvas as HTMLCanvasElement;
        const borderCanvas = this.refs.borderCanvas as HTMLCanvasElement;

        canvas.style.display = "none";
        
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.imageSmoothingEnabled = false;

        const borderCtx = borderCanvas.getContext("2d") as CanvasRenderingContext2D;
        borderCtx.imageSmoothingEnabled = false;
    }

    /**
     * @description A handler for a change on an outline color.
     */
    handleOutlineColorChange = (color: ColorResult) => {
        this.setState({
            outlineColor: color.hex
        });
    }

    /**
     * @description A handler for when the component itself updates; either the props or the state of this
     * object. Updates the character display.
     * @param prevProps 
     */
    componentDidUpdate(prevProps: ICanvasProps)
    {
        const imagesWidth = this.canvasWidth;
        const imagesHeight = this.canvasHeight;

        // https://stackoverflow.com/questions/34534549/how-do-you-deal-with-html5s-canvas-image-load-asynchrony
        var loadedImages: Array<HTMLImageElement> = new Array<HTMLImageElement>();

        /**
         * Provides a function to be used when loading each of the images that will be drawn on the character.
         * @param loadedImages A list of loaded images to maintain outside of this function. This needs to be
         * accessible from where the promise list is being run.
         * @param index The index of the array @see loadedImages that the result of the promise will end up
         * in.
         * @param imgSrc The string/html source for the image to be rendered.
         * @param width The width of the image to be rendered.
         * @param height The height of the image to be rendered.
         */
        var renderImagesFn = function(
                loadedImages: Array<HTMLImageElement>,
                index: number,
                imgSrc: string,
                width: number,
                height: number) {
            return new Promise<void>(resolve => {
                var partImg = new Image(width, height);
                
                partImg.onload = function() {
                    loadedImages[index] = partImg;
                    resolve();
                };

                partImg.src = imgSrc;
            })
        };

        // Take the list of images that we should render, and ensure that each and every one of them is A:
        // rendered, and B: exists in a separate loadedImages array for us to draw next.
        var promiseArray = this.props.imagesToRender.map(
            (image, index) => renderImagesFn(loadedImages, index, image, this.canvasWidth, this.canvasHeight));

        // Ensure that all of the promises have been met, then call the giant handleImagesLoaded() function to
        // draw the images and their border.
        Promise.all(promiseArray).then(handleImagesLoaded);

        const borderColor= this.state.outlineColor as Color;
        const charCanvas = this.refs.canvas as HTMLCanvasElement;
        const borderCanvas = this.refs.borderCanvas as HTMLCanvasElement;

        /**
         * @description A function used to handle the final images loaded event. Draws each image in-order,
         * and renders a border around the final image.
         */
        function handleImagesLoaded()
        {
            const charCtx = charCanvas.getContext("2d") as CanvasRenderingContext2D;
            charCtx.clearRect(0, 0, charCanvas.width, charCanvas.height);

            // Draw the images in-order.
            loadedImages.forEach(img => {
                charCtx.drawImage(img, 0, 0, img.width, img.height);
            });

            /*
             * Get a copy of the first canvas element. The original canvas element is hidden, but we use it
             * to create a finalized version of the character image so that we have something to draw a border
             * around. Otherwise, we're drawing a border around a bunch of tiny elements, which causes a
             * bunch of tiny, overlapping borders.
             */
            var charImgSrc = charCanvas.toDataURL() as string;
            var borderImg = new Image(imagesWidth, imagesHeight);
            borderImg.src = charImgSrc;
            
            /**
             * Handles the border image's onload event. This causes the image in the final canvas element, the
             * canvas that draws the image and its border, to be rendered.
             */
            borderImg.onload = () => {
                const borderCtx = borderCanvas.getContext("2d") as CanvasRenderingContext2D;
                borderCtx.clearRect(0, 0, borderCanvas.width, borderCanvas.height);
                
                drawImageBorder(borderCanvas, borderImg, borderColor.toString());

                /**
                 * @description Draws a border around an image with the specified elements, using the
                 * specified image.
                 * @param borderCanvas The canvas that will contain the final border and the final image. This
                 * gets the border drawn to it.
                 * @param img The image to use as a framework for the border.
                 * @param borderStyle The styling to apply to the border image, when drawn.
                 * @remarks https://stackoverflow.com/questions/28207232/draw-border-around-nontransparent-part-of-image-on-canvas
                 * Something to note about this algorith; it can only draw borders of a thickness equal to the
                 * smallest outlying pixel. So, our resolution for pixels on this canvas is '4', which means
                 * that the thickness must be 4, or else we end up with weird stamping artifacts.
                 */
                function drawImageBorder(
                    borderCanvas: HTMLCanvasElement,
                    img: HTMLImageElement,
                    borderStyle: string
                    ) {
                    const borderCtx = borderCanvas.getContext("2d") as CanvasRenderingContext2D;

                    /*
                     * An array of integers used to offset and effectively "stamp" the image repeatedly. This
                     * entire algorithm just takes the original image, stamps it around the base image 9
                     * times, and then uses the source-in global composite operation to paint what's been
                     * drawn according to the style used.
                     * 
                     * Note that the numbers stored here are effectively pairs of coordinates to offset the
                     * image stamping by, scaled by the desired thickness of the border.
                     * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing
                     */
                    var dArr = [
                        -1, -1,
                         0, -1,
                         1, -1,
                        -1,  0,
                         1,  0,
                        -1,  1,
                         0,  1,
                         1,  1];

                        // Thickness scale
                        var s: number = 4;

                        // Iterator.
                        var i: number = 0;

                    // draw images at offsets from the array scaled by s
                    for (; i < dArr.length; i += 2)
                    {
                        borderCtx.drawImage(img, dArr[i] * s, dArr[i + 1] * s);
                    }

                    // Fill with color
                    borderCtx.globalCompositeOperation = "source-in";
                    borderCtx.fillStyle = borderStyle;
                    borderCtx.fillRect(0, 0, borderCanvas.width, borderCanvas.height);
                }

                borderCtx.globalCompositeOperation = "source-over";
                borderCtx.drawImage(borderImg, 0, 0, borderImg.width, borderImg.height);
            }
        }
    }

    /**
     * @description Renders this object.
     */
    render() {
        var outlineColor: string = this.state.outlineColor.toString();

        return (
            <div className="canvas-container">
                <canvas
                    className="character-canvas"
                    id="characterCanvas"
                    ref="canvas"
                    width={this.canvasWidth}
                    height={this.canvasHeight} />
                <canvas
                    style={{
                        backgroundImage: "linear-gradient(#131313, #ffffff)"
                    }}
                    id="borderCanvas"
                    ref="borderCanvas"
                    width={this.canvasWidth}
                    height={this.canvasHeight} />
                <Container fluid={true} className='d-flex justify-content-center'>
                    <Row>
                        <CirclePicker
                            onChangeComplete={this.handleOutlineColorChange}
                            color={outlineColor}
                            colors={this.outlineColors}
                        />
                    </Row>
                </Container>
                <Button
                    variant="primary"
                    className="downloadButton"
                    onClick={() => this.props.onClickDownload(document.getElementById('borderCanvas'))}>
                    <h4>&gt;&gt; DOWNLOAD &lt;&lt;</h4>
                </Button>
            </div>
        )
    }
}