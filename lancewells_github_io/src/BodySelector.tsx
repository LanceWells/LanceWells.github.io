import React from 'react';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

interface BodySelectorProps {
    onClick: Function;
    src: string;
}

export default function BodySelector(props: BodySelectorProps) {
    return (
        <Button onClick={() => props.onClick()}>
            <Image src='images/BodyTypes/Blue' className="bodySelector" roundedCircle />
        </Button>
    )
}
