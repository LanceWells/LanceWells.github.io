import React from 'react';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

interface BodySelectorProps {
    onClick: Function;
    src: string;
}

export default function BodySelector(props: BodySelectorProps) {
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
