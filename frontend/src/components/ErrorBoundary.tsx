import React from 'react';
import { Alert, AlertTitle, Button, Box } from '@mui/material';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box sx={{ p: 3 }}>
                    <Alert 
                        severity="error"
                        action={
                            <Button color="inherit" size="small" onClick={this.handleReset}>
                                Try Again
                            </Button>
                        }
                    >
                        <AlertTitle>Something went wrong</AlertTitle>
                        {this.state.error?.message || 'An unexpected error occurred'}
                    </Alert>
                </Box>
            );
        }

        return this.props.children;
    }
} 