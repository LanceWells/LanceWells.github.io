import React from 'react';
import Button from 'react-bootstrap/Button';
import { BodyMap } from './BodyMap';
import { Carousel } from 'react-bootstrap';

interface IBodySelector {
    onClick: Function;
    bodyMap: BodyMap;
}

export function BodySelector(props: IBodySelector) {
    return (
        <Button
            className='bodySelector'
            variant='dark'
            style={{
                borderColor: 'rgba(255, 255, 255, 0.05)',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                width: '100%'
            }}
            onClick={() => props.onClick(props.bodyMap)}>
            <img src={props.bodyMap.imageSource} alt='body selection'/>
            <Carousel.Caption>
                <h3 className='body-option-title'>{props.bodyMap.name}</h3>
                <p className='body-option-caption'>{props.bodyMap.description}</p>
            </Carousel.Caption>
        </Button>
    )
}
