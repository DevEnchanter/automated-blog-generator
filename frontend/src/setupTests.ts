import '@testing-library/jest-dom';

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

// Add any global setup needed for your tests here 