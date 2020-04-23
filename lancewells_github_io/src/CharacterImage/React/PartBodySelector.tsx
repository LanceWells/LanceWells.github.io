import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { BodyType } from '../Enums/BodyType';
import { BodyTypeSelectionCallback } from '../Types/BodyTypeSelectionCallback';

export interface IPartBodySelectorProps {
    SelectionCallback: BodyTypeSelectionCallback;
}

export interface IPartBodySelectorState {
}

export class PartBodySelector extends React.Component<IPartBodySelectorProps, IPartBodySelectorState> {
    constructor(props: IPartBodySelectorProps) {
        super(props);
        this.state = {
        };
    }

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
