// https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76
import React from 'react';
import Button from 'react-bootstrap/Button';
import { Color, ColorResult, CirclePicker } from 'react-color';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { render } from 'react-dom';

interface ICanvasProps {
    imagesToRender: Array<string>;
    onClickDownload: Function;
}

interface ICanvasState {
    backgroundColor: Color;
}

export class Canvas extends React.Component<ICanvasProps, ICanvasState> {
    canvasHeight: number = 256;
    canvasWidth: number = 256;
    backgroundColors: string[] = ["#131313", "#ffffff", ];

    constructor(props: Readonly<ICanvasProps>) {
        super(props);
        this.state = {
            backgroundColor: '#ffffff'
        };
    }

    componentDidMount() {
        const canvas = this.refs.canvas as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.imageSmoothingEnabled = false;
    }

    handleBackgroundColorChange = (color: ColorResult) => {
        this.setState({
            backgroundColor: color.hex
        });
    }

    componentDidUpdate(prevProps: ICanvasProps)
    {
        const imagesWidth = this.canvasWidth;
        const imagesHeight = this.canvasHeight;

        // https://stackoverflow.com/questions/34534549/how-do-you-deal-with-html5s-canvas-image-load-asynchrony
        var loadedImages: Array<HTMLImageElement> = new Array<HTMLImageElement>();

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

        var promiseArray = this.props.imagesToRender.map(
            (image, index) => renderImagesFn(loadedImages, index, image, this.canvasWidth, this.canvasHeight));

        Promise.all(promiseArray).then(handleImagesLoaded);

        const charCanvas = this.refs.canvas as HTMLCanvasElement;
        const borderCanvas = this.refs.borderCanvas as HTMLCanvasElement;

        function handleImagesLoaded()
        {
            const charCtx = charCanvas.getContext("2d") as CanvasRenderingContext2D;
            charCtx.clearRect(0, 0, charCanvas.width, charCanvas.height);

            loadedImages.forEach(img => {
                charCtx.drawImage(img, 0, 0, img.width, img.height);
            });

            var charImgSrc = charCanvas.toDataURL() as string;
            var borderImg = new Image(imagesWidth, imagesHeight);
            borderImg.src = charImgSrc;
            
            borderImg.onload = () => {
                const borderCtx = borderCanvas.getContext("2d") as CanvasRenderingContext2D;
                borderCtx.clearRect(0, 0, borderCanvas.width, borderCanvas.height);

                drawCharacterBorder(borderCanvas, borderImg, "red");
                // drawCharacterBorder(borderCanvas, borderImg, "red");

                borderCtx.globalCompositeOperation = "source-over";
                borderCtx.drawImage(borderImg, 0, 0, borderImg.width, borderImg.height);

                function drawCharacterBorder(borderCanvas: HTMLCanvasElement, borderImg: HTMLImageElement, fillStyle: string) {
                    const borderCtx = borderCanvas.getContext("2d") as CanvasRenderingContext2D;

                    // Now that we have used the original canvas to render the character image, now we use another
                    // canvas to draw the result of the first image, plus a colored border.
                    // https://stackoverflow.com/questions/28207232/draw-border-around-nontransparent-part-of-image-on-canvas

                    // Get a list of offsets, provided as a list of paired x-y coordinates.
                    var dArr = [
                        -1, -1,
                        0, -1,
                        1, -1,
                        -1, 0,
                        1, 0,
                        -1, 1,
                        0, 1,
                        1, 1
                    ];
                    var s = 4;  // Thickness scale.
                    var i = 0;  // Iterator.
                    var x = 0;  // X-Offset.
                    var y = 0;  // Y-Offset.

                    for (; i < dArr.length; i += 2) {
                        borderCtx.drawImage(borderImg, x + dArr[i] * s, y + dArr[i + 1] * s, borderImg.width, borderImg.height);
                    }

                    borderCtx.globalCompositeOperation = "source-in";
                    borderCtx.fillStyle = fillStyle;
                    borderCtx.fillRect(0, 0, borderCanvas.width, borderCanvas.height);

                    // borderCtx.globalCompositeOperation = "source-over";
                    // borderCtx.drawImage(borderImg, 0, 0, borderImg.width, borderImg.height);
                }
            }
        }
    }

    drawCharacterBorder(borderCanvas: HTMLCanvasElement, borderImg: HTMLImageElement, fillStyle: string)
    {
        const borderCtx = borderCanvas.getContext("2d") as CanvasRenderingContext2D;

        // Now that we have used the original canvas to render the character image, now we use another
        // canvas to draw the result of the first image, plus a colored border.
        // https://stackoverflow.com/questions/28207232/draw-border-around-nontransparent-part-of-image-on-canvas

        // Get a list of offsets, provided as a list of paired x-y coordinates.
        var dArr = [
            -1, -1,
            0, -1,
            1, -1,
            -1, 0,
            1, 0,
            -1, 1,
            0, 1,
            1, 1
        ];
        var s = 4;  // Thickness scale.
        var i = 0;  // Iterator.
        var x = 0;  // X-Offset.
        var y = 0;  // Y-Offset.

        for (; i < dArr.length; i += 2) {
            borderCtx.drawImage(borderImg, x + dArr[i] * s, y + dArr[i + 1] * s, borderImg.width, borderImg.height);
        }

        borderCtx.globalCompositeOperation = "source-in";
        borderCtx.fillStyle = fillStyle;
        borderCtx.fillRect(0, 0, borderCanvas.width, borderCanvas.height);

        // borderCtx.globalCompositeOperation = "source-over";
        // borderCtx.drawImage(borderImg, 0, 0, borderImg.width, borderImg.height);
    }

    render() {
        var bgColor: string = this.state.backgroundColor.toString();

        return (
            <div>
                <canvas style={{ backgroundColor: bgColor }} id="characterCanvas" ref="canvas" width={this.canvasWidth} height={this.canvasHeight} />
                <canvas style={{ backgroundColor: bgColor }} id="borderCanvas" ref="borderCanvas" width={this.canvasWidth} height={this.canvasHeight} />
                <Container fluid={true} className='d-flex justify-content-center'>
                    <Row>
                        <CirclePicker
                            onChangeComplete={this.handleBackgroundColorChange}
                            color={bgColor}
                            colors={this.backgroundColors}
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