import React from 'react';
import { PartType } from '../Enums/PartType';
import { PartButton } from './PartButton';
import { PartTypeSelectionCallback } from '../Types/PartTypeSelectionCallback';
import { PartTypeSelector } from './PartTypeSelector';

export interface IPartSelectorProps {
    partType: PartType;
    partOptions: string[];
    partTypeSelectionCallback: PartTypeSelectionCallback;
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
                <PartTypeSelector
                    SelectionCallback={this.props.partTypeSelectionCallback}
                />
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
