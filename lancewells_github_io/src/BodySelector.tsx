import React from 'react';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

interface IBodySelector {
    onClick: Function;
    src: string;
}

export default function BodySelector(props: IBodySelector) {
    return (
        <Button
            variant='outline-dark'
            onClick={() => props.onClick(props.src)}>
            <Image
                className="bodySelector"
                src={props.src}
                roundedCircle />
        </Button>
    )
}
