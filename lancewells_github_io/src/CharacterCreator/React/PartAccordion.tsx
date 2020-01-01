import React from 'react';
import { ImageLayer } from './BodyMap';
import PartSelector from './PartSelector';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs'

interface IPartAccordionProps {
    layers: ImageLayer[];
    onClick: Function;
}

export class PartAccordion extends React.Component<IPartAccordionProps> {
    renderPartsButtons(layer: ImageLayer) {
        return layer.images.map((src) => {
            return (
                <PartSelector
                    onClick={this.props.onClick}
                    layerIndex={layer.layerIndex}
                    imageSource={src.imageSource}
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

    renderPartTabs() {
        return this.props.layers.map((layer) => {
            return (
                <Tab eventKey={layer.layerIndex.toString()} title={layer.key}>
                    <div className='part-button-tab'>
                        {this.renderPartsButtons(layer)}
                    </div>
                </Tab>
            );
        });
    }

    render() {
        return (
            <div>
                <Tabs defaultActiveKey="Body" id="part-accordion-tabs">
                    {this.renderPartTabs()}
                </Tabs>
            </div>
        );
    }
}
