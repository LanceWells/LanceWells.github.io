import React from 'react';
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
            <div className="char-image-type-selector-container">
                <h6>Body Type Selection</h6>
                <select className="char-image-type-selector-select">
                    {this.GetBodyTypes()}
                </select>
            </div>
        );
    }

    private GetBodyTypes(): JSX.Element[] {
        return Object.values(BodyType).map(bt => {
            let itemClickCallback = () => {this.props.SelectionCallback(bt)};

            return (
                <option
                    key={bt.toString()}
                    onClick={itemClickCallback.bind(this)}>
                    {bt.toString()}
                </option>
            )
        })
    }
}
