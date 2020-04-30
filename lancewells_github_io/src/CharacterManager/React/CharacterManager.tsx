import React from 'react';

export interface ICharacterManagerProps {
}

export interface ICharacterManagerState {
}

export class CharacterManager extends React.Component<ICharacterManagerProps, ICharacterManagerState> {
    public constructor(props: ICharacterManagerProps) {
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
