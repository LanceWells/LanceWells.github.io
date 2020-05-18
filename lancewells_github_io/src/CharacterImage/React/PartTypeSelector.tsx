import React from 'react';
import { PartType } from '../Enums/PartType';
import { PartTypeSelectionCallback } from '../Types/PartTypeSelectionCallback';
import { Dropdown } from 'react-bootstrap';

/**
 * @description The properties provided to this component.
 * @param SelectionCallback The function to be called when a part type is selected from the dropdown.
 */
export interface IPartTypeSelectorProps {
    SelectionCallback: PartTypeSelectionCallback;
};

/**
 * @description The state maintained by this component.
 */
export interface IPartTypeSelectorState {
};

/**
 * @description The part-type selector. This lets the character creator switch between part types.
 */
export class PartTypeSelector extends React.Component<IPartTypeSelectorProps, IPartTypeSelectorState> {
    /**
     * @description Creates a new isntance of this component.
     * @param props The provided properties for this class.
     */
    constructor(props: IPartTypeSelectorProps) {
        super(props);
        this.state = {
        };
    }
    /**
     * @description Renders this component.
     */
    public render() {
        return (
            <Dropdown
                className="part-type-selector">
                <Dropdown.Toggle id="part-dropdown">
                    Part Type Selection
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {this.GetPartTypes()}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    private GetPartTypes(): JSX.Element[] {
        return Object.values(PartType).map(pt => {
            let itemClickCallback = () => {this.props.SelectionCallback(pt)};

            return (
                <Dropdown.Item
                    key={pt.toString()}
                    onClick={itemClickCallback.bind(this)}>
                    {pt.toString()}
                </Dropdown.Item>
            )
        });
    }
}
