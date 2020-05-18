import React from 'react';

import { PartButton } from './PartButton';
import { PartTypeSelector } from './PartTypeSelector';
import { PartBodySelector } from './PartBodySelector';

import { PartType } from '../Enums/PartType';
import { PartTypeSelectionCallback } from '../Types/PartTypeSelectionCallback';
import { BodyTypeSelectionCallback } from '../Types/BodyTypeSelectionCallback';
import { PartSelectionCallback } from '../Types/PartSelectionCallback';

/**
 * @description The properties provided to this component.
 * @param partType The part type whose buttons are displayed in in this component at present.
 * @param partOptions The list of image sources that are displayed as options.
 * @param partTypeSelectionCallback A callback when a part type has been selected.
 * @param bodyTypeSelectionCallback A callback when a body type has been selected.
 * @param partSelectionCallback A callback when the type of part represented as an option changes.
 */
export interface IPartSelectorProps {
    partType: PartType;
    partOptions: string[];
    partTypeSelectionCallback: PartTypeSelectionCallback;
    bodyTypeSelectionCallback: BodyTypeSelectionCallback;
    partSelectionCallback: PartSelectionCallback;
};

/**
 * @description The state maintained by this component.
 */
export interface IPartSelectorState {
};

/**
 * @description The part selector for the character creator. This provides compnonents to switch body types,
 * part types, and parts.
 */
export class PartSelector extends React.Component<IPartSelectorProps, IPartSelectorState> {
    /**
     * @description Creates a new isntance of this component.
     * @param props The provided properties for this class.
     */
    constructor(props: IPartSelectorProps) {
        super(props);
        this.state = {
        };
    }
    /**
     * @description Renders this component.
     */
    public render() {
        return (
            <div className="part-selector">
                <div className="part-character-selectors">
                    <PartBodySelector
                        SelectionCallback={this.props.bodyTypeSelectionCallback}
                    />
                    <PartTypeSelector
                        SelectionCallback={this.props.partTypeSelectionCallback}
                    />
                </div>
                <div className="part-selector-buttons">
                    {this.GetPartButtons()}
                </div>
            </div>
        )
    }

    private GetPartButtons(): JSX.Element[] {
        return this.props.partOptions.map(po => 
            <PartButton
                key={po}
                partType={this.props.partType}
                imageSource={po}
                partSelectionCallback={this.props.partSelectionCallback}
            />
        );
    }
}
