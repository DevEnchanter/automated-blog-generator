import React, { Component, ErrorInfo, ReactNode, useState, useCallback } from 'react';
import { Alert, Button, Box, Text, Title } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Class-based Error Boundary
export class ErrorBoundaryClass extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box p="md">
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Something went wrong"
            color="red"
            variant="filled"
            withCloseButton
            onClose={this.handleReset}
          >
            <Title order={4} mb="sm">
              {this.state.error?.name || 'Error'}
            </Title>
            <Text mb="md">{this.state.error?.message || 'An unexpected error occurred'}</Text>
            <Button
              variant="light"
              color="red"
              onClick={this.handleReset}
              size="sm"
            >
              Try Again
            </Button>
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Hook-based Error Boundary
export const ErrorBoundary: React.FC<Props> = ({ children, fallback, onError }) => {
  const [state, setState] = useState<State>({
    hasError: false,
    error: null,
  });

  const handleReset = useCallback(() => {
    setState({ hasError: false, error: null });
  }, []);

  if (state.hasError) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Box p="md">
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Something went wrong"
          color="red"
          variant="filled"
          withCloseButton
          onClose={handleReset}
        >
          <Title order={4} mb="sm">
            {state.error?.name || 'Error'}
          </Title>
          <Text mb="md">{state.error?.message || 'An unexpected error occurred'}</Text>
          <Button
            variant="light"
            color="red"
            onClick={handleReset}
            size="sm"
          >
            Try Again
          </Button>
        </Alert>
      </Box>
    );
  }

  return <>{children}</>;
};

// Custom hook for error boundary
export const useErrorBoundary = () => {
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((error: Error) => {
    setError(error);
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    resetError,
  };
}; 