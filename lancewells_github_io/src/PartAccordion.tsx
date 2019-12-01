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
                    layerName={layer.key}
                    imageSource={src}
                />
            );
        });
    }

    renderPartCards() {
        return this.props.layers.map((layer) => {
            return (
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0"
                        style={{ cursor: "pointer" }}>
                        {layer.key}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
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
