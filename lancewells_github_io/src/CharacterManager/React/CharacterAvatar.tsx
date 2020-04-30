import React from 'react';

export interface ICharacterAvatarProps {
}

export interface ICharacterAvatarState {
}

export class CharacterAvatar extends React.Component<ICharacterAvatarProps, ICharacterAvatarState> {
    public constructor(props: ICharacterAvatarProps) {
        super(props);
        this.state = {
        };
    }

    public render() {
        return (
            <div className="character-avatar">
            </div>
        )
    }
}
