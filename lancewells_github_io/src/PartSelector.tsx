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
            className='part-selector-button'
            variant='dark'
            style={{
                borderColor: 'rgba(255, 255, 255, 0.05)',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
            }}
            onClick={() => props.onClick(props.layerIndex, props.imageSource)}>
            <Image
                className='partSelector'
                src={props.imageSource}
                roundedCircle />
        </Button>
    )
}