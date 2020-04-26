import React from 'react';

import { PartButton } from './PartButton';
import { PartTypeSelector } from './PartTypeSelector';
import { PartBodySelector } from './PartBodySelector';

import { PartType } from '../Enums/PartType';
import { PartTypeSelectionCallback } from '../Types/PartTypeSelectionCallback';
import { BodyTypeSelectionCallback } from '../Types/BodyTypeSelectionCallback';
import { PartSelectionCallback } from '../Types/PartSelectionCallback';

export interface IPartSelectorProps {
    partType: PartType;
    partOptions: string[];
    partTypeSelectionCallback: PartTypeSelectionCallback;
    bodyTypeSelectionCallback: BodyTypeSelectionCallback;
    partSelectionCallback: PartSelectionCallback;
};

export interface IPartSelectorState {
};

export class PartSelector extends React.Component<IPartSelectorProps, IPartSelectorState> {
    constructor(props: IPartSelectorProps) {
        super(props);
        this.state = {
        };
    }

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
                partType={this.props.partType}
                imageSource={po}
                partSelectionCallback={this.props.partSelectionCallback}
            />
        );
    }
}
