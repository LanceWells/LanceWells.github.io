import React from 'react';
import { PartTypeSelectionCallback } from "../Types/PartTypeSelectionCallback";
import { PartType } from "../Enums/PartType";

export interface IPartTypeSelectorTabProps {
    partType: PartType;
    partTypeCallback: PartTypeSelectionCallback;
};

export function PartTypeSelectorTab(props: IPartTypeSelectorTabProps) {
    return (
        <button
            className="part-type-selector-tab"
            onClick={() => props.partTypeCallback(props.partType)}>
            {props.partType.toString()}
        </button>
    )
}
