import React from 'react';
import type {ChartKitError} from '../../libs';
import type {ChartKitOnError} from '../../types';
import {getErrorMessage} from '../../utils/getErrorMessage';
import {ChartKitType, ChartKitWidget} from '../../types';
import {CHARTKIT_ERROR_CODE} from '../../libs';

type Props = {
    onError?: ChartKitOnError;
    resetError?(resetError: () => void): void;
    renderErrorView?: ErrorBoundaryRenderErrorView;
    data: ChartKitWidget[ChartKitType]['data'];
};

type State = {
    error?: ChartKitError | Error;
};

export type ErrorBoundaryRenderErrorViewOpts = {
    message: string;
    error: ChartKitError | Error;
    resetError: () => void;
};

export type ErrorBoundaryRenderErrorView = (
    opts: ErrorBoundaryRenderErrorViewOpts,
) => React.ReactNode;

export class ErrorBoundary extends React.Component<Props, State> {
    static getDerivedStateFromError(error: Error) {
        return {error};
    }

    state: State = {
        error: undefined,
    };

    componentDidUpdate(prevProps: Readonly<Props>) {
        if (prevProps.data !== this.props.data) {
            const {error} = this.state;
            if (error && 'code' in error && error.code === CHARTKIT_ERROR_CODE.NO_DATA) {
                this.resetError();
            }
        }
    }

    componentDidCatch() {
        const {error} = this.state;

        if (error) {
            this.props.onError?.({error});
        }
    }

    render() {
        const {error} = this.state;

        if (error) {
            const message = getErrorMessage(error);

            if (this.props.renderErrorView) {
                return this.props.renderErrorView({
                    error,
                    message,
                    resetError: this.resetError,
                });
            }

            return <div>{message}</div>;
        }

        return this.props.children;
    }

    resetError = () => {
        if (this.state.error) {
            this.setState({error: undefined});
        }
    };
}
