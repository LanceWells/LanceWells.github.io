import React from 'react';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

interface IPartSelector {
    onClick: Function;
    layerIndex: number;
    imageSource: string;
}

export default function PartSelector(props: IPartSelector) {
    return (
        <Button
            variant='outline-dark'
            onClick={() => props.onClick(props.layerIndex, props.imageSource)}>
            <Image
                className='partSelector'
                src={props.imageSource}
                roundedCircle />
        </Button>
    )
}