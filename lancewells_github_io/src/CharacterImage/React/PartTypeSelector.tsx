import React from 'react';
import { PartType } from '../Enums/PartType';
import { PartTypeSelectorTab } from './PartTypeSelectorTab';
import { PartTypeSelectionCallback } from '../Types/PartTypeSelectionCallback';
import { Dropdown } from 'react-bootstrap';

export interface IPartTypeSelectorProps {
    SelectionCallback: PartTypeSelectionCallback;
};

export interface IPartTypeSelectorState {
};

export class PartTypeSelector extends React.Component<IPartTypeSelectorProps, IPartTypeSelectorState> {
    constructor(props: IPartTypeSelectorProps) {
        super(props);
        this.state = {
        };
    }

    public render() {
        return (
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Part Type Selection
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {this.GetPartTypes()}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

// <div className='part-type-selector'>
// {this.GetPartTypes()}
// </div>

    private GetPartTypes(): JSX.Element[] {
        return Object.values(PartType).map(pt => {
            let itemClickCallback = () => {this.props.SelectionCallback(pt)};

            return (
                <Dropdown.Item onClick={itemClickCallback.bind(this)}>
                    {pt.toString()}
                </Dropdown.Item>
            )
        });
    }

    // private GetPartTypes(): JSX.Element[] {
    //     return Object.values(PartType).map(pt => (
    //         <PartTypeSelectorTab
    //             partType={pt}
    //             partTypeCallback={this.props.SelectionCallback}
    //         />
    //     ))
    // }
}
