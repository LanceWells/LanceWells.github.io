import React from 'react';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import {BodyMap} from './BodyMap';

interface IBodySelector {
    onClick: Function;
    bodyMap: BodyMap;
}

export default function BodySelector(props: IBodySelector) {
    return (
        <Button
            variant='outline-dark'
            onClick={() => props.onClick(props.bodyMap)}>
            <Image
                className="bodySelector"
                src={props.bodyMap.imageSource}
                roundedCircle />
        </Button>
    )
}
