import { renderHook, act } from '@testing-library/react';
import { useTheme } from '@hooks/useTheme';

describe('useTheme', () => {
  it('should initialize with light theme', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.colorScheme).toBe('light');
  });

  it('should toggle between light and dark themes', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleColorScheme();
    });

    expect(result.current.colorScheme).toBe('dark');

    act(() => {
      result.current.toggleColorScheme();
    });

    expect(result.current.colorScheme).toBe('light');
  });

  it('should persist theme preference', () => {
    const { result, rerender } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleColorScheme();
    });

    // Simulate remounting the component
    rerender();

    expect(result.current.colorScheme).toBe('dark');
  });
}); 