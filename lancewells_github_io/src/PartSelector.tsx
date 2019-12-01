import React from 'react';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

interface IPartSelector {
    onClick: Function;
    layerName: string;
    imageSource: string;
}

export default function PartSelector(props: IPartSelector) {
    return (
        <Button
            variant='outline-dark'
            onClick={() => props.onClick(props.layerName, props.imageSource)}>
            <Image
                className='partSelector'
                src={props.imageSource}
                roundedCircle />
        </Button>
    )
}