import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { BodyType } from '../Enums/BodyType';
import { BodyTypeSelectionCallback } from '../Types/BodyTypeSelectionCallback';

/**
 * @description The properties provided to this component.
 * @param SelectionCallback The function to be called when a body type is selected from the dropdown.
 */
export interface IPartBodySelectorProps {
    SelectionCallback: BodyTypeSelectionCallback;
}

/**
 * @description The state maintained by this component.
 */
export interface IPartBodySelectorState {
}

/**
 * @description The body-type selector. This lets the character creator switch between body types.
 */
export class PartBodySelector extends React.Component<IPartBodySelectorProps, IPartBodySelectorState> {
    /**
     * @description Creates a new isntance of this component.
     * @param props The provided properties for this class.
     */
    constructor(props: IPartBodySelectorProps) {
        super(props);
        this.state = {
        };
    }

    /**
     * @description Renders this component.
     */
    public render() {
        return (
            <Dropdown>
                <Dropdown.Toggle id="body-dropdown">
                    Body Type Selection
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {this.GetBodyTypes()}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    private GetBodyTypes(): JSX.Element[] {
        return Object.values(BodyType).map(bt => {
            let itemClickCallback = () => {this.props.SelectionCallback(bt)};

            return (
                <Dropdown.Item
                    onClick={itemClickCallback.bind(this)}>
                    {bt.toString()}
                </Dropdown.Item>
            )
        })
    }
}
