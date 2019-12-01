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
            variant='outline-light'
            style={{
                borderColor: 'rgba(255, 255, 255, 0.05)',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
            }}
            onClick={() => props.onClick(props.bodyMap)}>
            <Image
                className="bodySelector"
                src={props.bodyMap.imageSource}
                roundedCircle />
        </Button>
    )
}
