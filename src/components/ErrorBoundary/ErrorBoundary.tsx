import React from 'react';
import type {ChartKitError} from '../../libs';
import type {ChartKitOnError, ChartKitRenderError} from '../../types';
import {getErrorMessage} from '../../utils/getErrorMessage';

type Props = {
    onError?: ChartKitOnError;
    renderError?: ChartKitRenderError;
};

type State = {
    error?: ChartKitError | Error;
};

export class ErrorBoundary extends React.Component<Props, State> {
    static getDerivedStateFromError(error: Error) {
        return {error};
    }

    state: State = {
        error: undefined,
    };

    componentDidCatch() {
        const {error} = this.state;

        if (error) {
            this.props.onError?.({error});
        }
    }

    render() {
        const {error} = this.state;
        const {renderError} = this.props;

        if (error) {
            const message = getErrorMessage(error);

            if (renderError) {
                return renderError({
                    error,
                    message,
                    resetError: () => {
                        this.setState({error: undefined});
                    },
                });
            }

            return <div>{message}</div>;
        }

        return this.props.children;
    }
}
