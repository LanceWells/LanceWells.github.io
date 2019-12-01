import React from 'react';
import Button from 'react-bootstrap/Button';
import { BodyMap } from './BodyMap';
import Card from 'react-bootstrap/Card';

interface IBodySelector {
    onClick: Function;
    bodyMap: BodyMap;
}

export function BodySelector(props: IBodySelector) {
    return (
        <Card
            bg='dark'
            style={{
                width: '18rem',
                borderColor: 'rgba(255, 255, 255, 0.05)',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
            }}>
            <Button
                className='bodySelector'
                variant='dark'
                style={{
                    borderColor: 'rgba(255, 255, 255, 0.05)',
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
                }}
                onClick={() => props.onClick(props.bodyMap)}>
                <Card.Img src={props.bodyMap.imageSource} />
                <Card.Body
                    className='body-selector-card'>
                    <Card.Title>{props.bodyMap.name}</Card.Title>
                    <Card.Text>{props.bodyMap.description}</Card.Text>
                </Card.Body>
            </Button>
        </Card>
    )
}
