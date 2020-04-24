import React from 'react';
import './CharacterImage.css';

import { CharacterSize } from '../Enums/CharacterSize';
// import { BodyDescription } from '../Enums/BodyDescription';
import { PartType } from '../Enums/PartType';
import { PartTypeSelectionCallback } from '../Types/PartTypeSelectionCallback';

import { CharacterImageMap } from '../Classes/CharacterImageMap';

// import { ImageLayer } from '../Types/ImageLayer';
// import { BodyMap } from '../Types/BodyMap';

import 'bootstrap/dist/css/bootstrap.min.css';
import { CharacterCanvas } from './CharacterCanvas';
import { PartSelector } from './PartSelector';
import { BodyType } from '../Enums/BodyType';
import { BodyTypeSelectionCallback } from '../Types/BodyTypeSelectionCallback';
import { CharImageLayout } from '../Classes/CharImageLayout';
import { PartSelectionCallback } from '../Types/PartSelectionCallback';

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
    // canvasImages: Array<string>,
    // partLayers: ImageLayer[],
    // carouselIndex: number,
    // carouselDirection: "prev" | "next",
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
            // canvasImages: [],
            // partLayers: [],
            // carouselIndex: 0,
            // carouselDirection: "next",
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

    // /**
    //  * A handler for a part selector. Replaces the image at the specified index with a new image.
    //  * @param layerIndex The index of the layer. This is the z-layer, effectively. The higher the number, the
    //  * more layers that it draws over.
    //  * @param imageSource The image source. This is what gets drawn.
    //  */
    // handlePartSelection(layerIndex: number, imageSource: string) {
    //     const newCanvasImages: Array<string> = this.state.canvasImages;

    //     // Javascript doesn't have arrays of fixed length, so this is safe? Still getting used to this.
    //     newCanvasImages[layerIndex] = imageSource;

    //     this.setState({
    //         canvasImages: newCanvasImages
    //     })
    // }

    // /**
    //  * Handles the prop-pass from the body-type selector.
    //  * @param bodyType The type of body that this character creator should acknowledge.
    //  */
    // handleBodySelection(bodyMap: BodyMap) {
    //     const newImagesToRender: Array<string> = new Array<string>(0);

    //     bodyMap.layers.forEach(layer => {
    //         layer.images.forEach(image => {
    //             if (image.imageSource.includes('default.png'))
    //             {
    //                 newImagesToRender[layer.layerIndex] = image.imageSource;
    //             }
    //         });
    //     });

    //     this.setState({
    //         canvasImages: newImagesToRender,
    //         partLayers: bodyMap.layers
    //     });
    // }

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

    /**
     * @description
     * Renders a series of body selectors for the user to pick from. These body selectors will modify the list
     * of available accessories (since a tiny hat looks silly on a giant person . . . or does it?). Needs to
     * look at the BodyMap.tsx file to understand what will be populated.
     */
    renderBodySelection() {
        return (<div></div>);
    }

            // return bodyMaps.map((bodyMap) => {
            //     return (
            //         <Carousel.Item>
            //             <BodySelector
            //                 onClick={(body: BodyMap) => this.handleBodySelection(body)}
            //                 bodyMap={bodyMap}
            //             />
            //         </Carousel.Item>
            //     );
            // });

    // /**
    //  * @description
    //  * Handles a carousel selection event. Is used to ensure that the carousel cycles left when the left
    //  * button is pressed; and the same for the right button.
    //  * @param eventKey The event key. This is the index that the carousel is being cycled to.
    //  * @param direction The direction that the carousel is being cycled in.
    //  */
    // handleCarouselSelect(eventKey: any, direction: "prev" | "next") {
    //     this.setState({
    //         carouselIndex: eventKey,
    //         carouselDirection: direction
    //     });
    // }

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

        let charImages: string[] = this.state.charImageLayout.GetImages();

        return (
            <div className="character-image">
                <CharacterCanvas
                    imagesToRender={charImages}
                    onClickDownload={this.downloadImage.bind(this)}
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

// <Container fluid={true}>
//     <Row>
//         <Col lg={1} />
//         <Col lg={4}>
//             <div className='body-creation'>
//                 <div className='body-selector'>
//                     <h2>Body Selection</h2>
//                     <p className="italics">(Each body type uses different accessories and will reset your character design)</p>
//                     <Carousel
//                         interval={null}
//                         indicators={false}
//                         onSelect={this.handleCarouselSelect.bind(this)}>
//                         {this.renderBodySelection()}
//                     </Carousel>
//                 </div>
//                 <div className='body-canvas'>
//                     <CharacterCanvas
//                         imagesToRender={canvasImagesToRender}
//                         onClickDownload={(canvas: HTMLCanvasElement) => this.downloadImage(canvas)}
//                     />
//                 </div>
//             </div>
//         </Col>
//         <Col lg={6}>
//             <div className='acc-selector'>
//                 <h2>Accessory Selection</h2>
//                 <p className="italics">(You need to select a body first if this is empty)</p>
//                 <PartAccordion
//                     layers={currentBodyMap}
//                     onClick={(layerName: number, imageSource: string) => this.handlePartSelection(layerName, imageSource)}
//                 />
//             </div>
//         </Col>
//         <Col lg={1} />
//     </Row>
// </Container>

// export default CharacterImage;
