import React from 'react';
import { Spinner } from 'react-bootstrap';

interface ILoadingPlaceholderProps {
    showSpinner: boolean;
    role: string;
}

interface ILoadingPlaceholderState {
}

export class LoadingPlaceholder extends React.Component<ILoadingPlaceholderProps, ILoadingPlaceholderState> {
    public constructor(props: ILoadingPlaceholderProps) {
        super(props);
        this.state = {
        }
    }

    public render() {
        let placeholderSpinner: JSX.Element = (
            <Spinner
                className="placeholder-spinner"
                animation="border"
                role={this.props.role}
            />
        );

        if (this.props.showSpinner) {
            return placeholderSpinner;
        }
        else {
            return(
                this.props.children
            )
        }
    }
}
