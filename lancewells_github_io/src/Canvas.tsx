// https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76
import React from 'react';
import Button from 'react-bootstrap/Button';
import { Color, ColorResult, CirclePicker } from 'react-color';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';

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
            backgroundColor: 'whitesmoke'
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
        if (this.props.imagesToRender !== prevProps.imagesToRender)
        {
            // this.setState(this.state, this.props);

            const canvas = this.refs.canvas as HTMLCanvasElement;
            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

            // Always empty the canvas before we decide to muss with it again.
            ctx.clearRect(0, 0, this.canvasHeight, this.canvasWidth);
            
            // Muss with it again! This draws each of the images in our props field one-after-another.
            this.props.imagesToRender.forEach((imgSrc: string) => {
                var htmlImg = new Image(this.canvasWidth, this.canvasHeight);
                htmlImg.src = imgSrc;
                
                htmlImg.onload = () => {
                    ctx.drawImage(htmlImg, 0, 0, htmlImg.width, htmlImg.height);
                };
            });
        }
    }

    render() {
        var bgColor: string = this.state.backgroundColor.toString();

        return (
            <div>
                <canvas style={{ backgroundColor: bgColor }} id="characterCanvas" ref="canvas" width={this.canvasWidth} height={this.canvasHeight} />
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
                    onClick={() => this.props.onClickDownload(document.getElementById('characterCanvas'))}>
                    <h4>&gt;&gt; DOWNLOAD &lt;&lt;</h4>
                </Button>
            </div>
        )
    }
}