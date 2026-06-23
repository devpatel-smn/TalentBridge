import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from '@/components/common/EmptyState';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('ErrorBoundary:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center p-6">
                    <ErrorState
                        title="Something went wrong"
                        description="An unexpected error occurred. Please refresh the page."
                        onRetry={() => window.location.reload()}
                    />
                </div>
            );
        }
        return this.props.children;
    }
}
