import { render, screen, fireEvent, waitFor } from '../../../../tests/setup';
import { LoginForm } from '../LoginForm';
import { useAuthStore } from '../../../store/auth';

// Mock the auth store
jest.mock('../../../store/auth', () => ({
    useAuthStore: jest.fn()
}));

describe('LoginForm', () => {
    beforeEach(() => {
        ((useAuthStore as unknown) as jest.Mock).mockImplementation(() => ({
            isLoading: false,
            setLoading: jest.fn(),
            setAuth: jest.fn(),
            clearAuth: jest.fn()
        }));
    });

    it('renders login form', () => {
        render(<LoginForm />);

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('shows validation errors for empty fields', async () => {
        render(<LoginForm />);

        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/email is required/i)).toBeInTheDocument();
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        });
    });

    it('shows validation error for invalid email', async () => {
        render(<LoginForm />);

        const emailInput = screen.getByLabelText(/email/i);
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
        });
    });

    it('shows loading state during form submission', async () => {
        const mockSetLoading = jest.fn();
        ((useAuthStore as unknown) as jest.Mock).mockImplementation(() => ({
            isLoading: true,
            setLoading: mockSetLoading,
            setAuth: jest.fn(),
            clearAuth: jest.fn()
        }));

        render(<LoginForm />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
}); 