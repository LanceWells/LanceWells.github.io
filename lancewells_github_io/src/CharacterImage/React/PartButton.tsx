import React from 'react';

const imgSize: string = "128px";

export interface IPartButtonProps {
    imageSource: string;
};

export interface IPartButtonState {
};

export class PartButton extends React.Component<IPartButtonProps, IPartButtonState> {
    constructor(props: IPartButtonProps) {
        super(props);
        this.state = {
        };
    }

    public render() {
        return (
            <button className="part-button">
                <img src={this.props.imageSource}
                    width={imgSize}/>
            </button>
        )
    }
}
