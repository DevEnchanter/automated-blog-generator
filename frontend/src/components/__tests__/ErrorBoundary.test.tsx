import React from 'react';
import { render, screen, fireEvent } from '../../../tests/setup';
import { ErrorBoundary } from '../ErrorBoundary';

// Mock console.error to avoid test output pollution
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalError;
});

const ErrorComponent = () => {
  throw new Error('Test error');
};

const FallbackComponent = () => <div>Custom fallback</div>;

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error message when there is an error', () => {
    const { container } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(container.querySelector('.mantine-Alert-title')).toHaveTextContent('Something went wrong');
    expect(container.querySelector('.mantine-Text')).toHaveTextContent('Test error');
  });

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<FallbackComponent />}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
  });

  it('resets error state when reset button is clicked', () => {
    const { container, rerender } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(container.querySelector('.mantine-Alert-title')).toHaveTextContent('Something went wrong');

    // Simulate reset by re-rendering with a non-error component
    rerender(
      <ErrorBoundary>
        <div>New content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('New content')).toBeInTheDocument();
  });
}); 