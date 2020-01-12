import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface ICardIconProps {
    iconSource: string;
    tooltipText: string;
    width: number;
    height: number;
}

export function CardIcon(props: ICardIconProps) {
    return (
        <OverlayTrigger
            placement='top'
            delay={{ show: 0, hide: 400 }}
            overlay={
                <Tooltip id="card-tooltip">
                    {props.tooltipText}
                </Tooltip>
            }>
            <img
                src={props.iconSource}
                style={{
                    width: `${props.width}px`,
                    height: `${props.height}px`,
                }} />
        </OverlayTrigger>
    )
}