import React from 'react';

export interface IInventoryProps {
}

export interface IInventoryState {
}

export class Inventory extends React.Component<IInventoryProps, IInventoryState> {
    public constructor(props: IInventoryProps) {
        super(props);
        this.state = {
        };
    }

    public render() {
        return (
            <div>
            </div>
        )
    }
}
