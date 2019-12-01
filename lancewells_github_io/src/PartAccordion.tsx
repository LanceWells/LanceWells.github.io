import React from 'react';
import { ImageLayer } from './BodyMap';
import PartSelector from './PartSelector';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';

interface IPartAccordion {
    layers: ImageLayer[];
    onClick: Function;
}

export class PartAccordion extends React.Component<IPartAccordion> {
    renderPartsButtons(layer: ImageLayer) {
        return layer.images.map((src) => {
            return (
                <PartSelector
                    onClick={this.props.onClick}
                    layerIndex={layer.layerIndex}
                    imageSource={src}
                />
            );
        });
    }

    renderPartCards() {
        return this.props.layers.map((layer) => {
            return (
                <Card style={{ background: 'rgba(255, 255, 255, 0.07)' }} text="white">
                    <Accordion.Toggle as={Card.Header} eventKey={layer.layerIndex.toString()}
                        style={{ cursor: "pointer" }}>
                        {layer.key}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={layer.layerIndex.toString()}>
                        <Card.Body>
                            {this.renderPartsButtons(layer)}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            );
        });
    }

    // renderPartCards() {
    //     const layers = this.props.layers;
    //     return layers.map((layer) => {
    //         return (
    //             <h1>{layer.key}</h1>
    //         );
    //     });
    // }

    render() {
        return (
            <div>
                {this.renderPartCards()}
            </div>
        );
    }
}
