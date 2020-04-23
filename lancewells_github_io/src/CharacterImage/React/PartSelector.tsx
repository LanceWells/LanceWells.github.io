import React from 'react';
import { PartType } from '../Enums/PartType';
import { PartButton } from './PartButton';
import { PartTypeSelectionCallback } from '../Types/PartTypeSelectionCallback';
import { BodyTypeSelectionCallback } from '../Types/BodyTypeSelectionCallback';
import { PartTypeSelector } from './PartTypeSelector';
import { PartBodySelector } from './PartBodySelector';

export interface IPartSelectorProps {
    partType: PartType;
    partOptions: string[];
    partTypeSelectionCallback: PartTypeSelectionCallback;
    bodyTypeSelectionCallback: BodyTypeSelectionCallback;
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
                {this.GetPartButtons()}
            </div>
        )
    }

    private GetPartButtons(): JSX.Element[] {
        return this.props.partOptions.map(po => 
            <PartButton
                imageSource={po}
            />
        );
    }
}
