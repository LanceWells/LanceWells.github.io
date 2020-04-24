import React from 'react';
import { PartSelectionCallback } from '../Types/PartSelectionCallback';
import { PartType } from '../Enums/PartType';

export interface IPartButtonProps {
    partType: PartType;
    imageSource: string;
    partSelectionCallback: PartSelectionCallback;
};

const imgSize: string = "128px";

export function PartButton(props: IPartButtonProps) {
    return (
        <button
            className="part-button"
            onClick={() => props.partSelectionCallback(props.partType, props.imageSource)}>
            <img src={props.imageSource}
                width={imgSize}/>
        </button>
    )
}
