import React from 'react';
import { PartSelectionCallback } from '../Types/PartSelectionCallback';
import { PartType } from '../Enums/PartType';

/**
 * @description The properties for this component.
 * @param partType The type of part that is represented by this button.
 * @param imageSource The source for the iamge that is represented by this button.
 * @param partSelectionCallback The callback when this button is clicked.
 */
export interface IPartButtonProps {
    partType: PartType;
    imageSource: string;
    partSelectionCallback: PartSelectionCallback;
};

/**
 * A constant that represents the size of the button/image that is represented here.
 */
const imgSize: string = "128px";

/**
 * A component used to represent an individual option for a character part.
 * @param props 
 */
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
