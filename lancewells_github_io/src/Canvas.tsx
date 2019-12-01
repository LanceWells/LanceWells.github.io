// https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76
import React from 'react';

interface ICanvasProps {
    imagesToRender: Array<string>;
}

class Canvas extends React.Component<ICanvasProps> {
    canvasHeight: number = 256;
    canvasWidth: number = 256;

    componentDidMount() {
        const canvas = this.refs.canvas as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.imageSmoothingEnabled = false;
    }

    componentDidUpdate(prevProps: ICanvasProps)
    {
        if (this.props.imagesToRender !== prevProps.imagesToRender)
        {
            this.setState(this.props);

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
        return (
            <div>
                <canvas ref="canvas" width={this.canvasWidth} height={this.canvasHeight} />
            </div>
        )
    }
}
export default Canvas;