import '@testing-library/jest-dom/vitest';
import { cleanup, render } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import React from 'react';

// Extend Vitest's expect method with methods from react-testing-library
expect.extend({
  toBeInTheDocument: (received) => {
    const pass = received !== null;
    return {
      pass,
      message: () => `expected ${received} to be in the document`,
    };
  },
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock the Mantine notifications module
jest.mock('@mantine/notifications', () => ({
  notifications: {
    show: jest.fn(),
    hide: jest.fn(),
  },
}));

// Mock the Mantine hooks
jest.mock('@mantine/hooks', () => ({
  useCombobox: () => ({
    resetSelectedOption: jest.fn(),
  }),
}));

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Custom render function with MantineProvider
export const customRender = (ui: React.ReactElement) => {
  return render(
    <MantineProvider>
      {ui}
    </MantineProvider>
  );
};

// Add any global setup needed for your tests here 