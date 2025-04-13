import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { BlogGenerationForm } from '../BlogGenerationForm';
import { generateBlog } from '../../../services/blog';

// Mock the blog service
jest.mock('../../../services/blog', () => ({
  generateBlog: jest.fn(),
}));

// Mock notifications
jest.mock('@mantine/notifications', () => ({
  notifications: {
    show: jest.fn(),
    hide: jest.fn(),
  },
}));

describe('BlogGenerationForm', () => {
  const queryClient = new QueryClient();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BlogGenerationForm onSuccess={mockOnSuccess} />
      </QueryClientProvider>
    );
  };

  it('renders form fields correctly', () => {
    renderComponent();

    expect(screen.getByLabelText(/topic/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/length/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/target audience/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/keywords/i)).toBeInTheDocument();
  });

  it('validates required topic field', async () => {
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /generate blog post/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/topic is required/i)).toBeInTheDocument();
    });
  });

  it('validates topic length', async () => {
    renderComponent();

    const topicInput = screen.getByLabelText(/topic/i);
    fireEvent.change(topicInput, { target: { value: 'ab' } });

    const submitButton = screen.getByRole('button', { name: /generate blog post/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/topic must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('handles keywords correctly', () => {
    renderComponent();

    const keywordInput = screen.getByPlaceholderText(/type a keyword/i);
    
    // Add keywords
    fireEvent.change(keywordInput, { target: { value: 'test1' } });
    fireEvent.keyDown(keywordInput, { key: 'Enter' });
    
    fireEvent.change(keywordInput, { target: { value: 'test2' } });
    fireEvent.keyDown(keywordInput, { key: 'Enter' });

    expect(screen.getByText('test1')).toBeInTheDocument();
    expect(screen.getByText('test2')).toBeInTheDocument();

    // Remove keyword
    fireEvent.click(screen.getByText('test1 ×'));
    expect(screen.queryByText('test1')).not.toBeInTheDocument();
    expect(screen.getByText('test2')).toBeInTheDocument();
  });

  it('prevents adding more than 10 keywords', async () => {
    renderComponent();

    const keywordInput = screen.getByPlaceholderText(/type a keyword/i);
    
    // Add 10 keywords
    for (let i = 1; i <= 10; i++) {
      fireEvent.change(keywordInput, { target: { value: `test${i}` } });
      fireEvent.keyDown(keywordInput, { key: 'Enter' });
    }

    // Try to add 11th keyword
    fireEvent.change(keywordInput, { target: { value: 'test11' } });
    fireEvent.keyDown(keywordInput, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText(/maximum 10 keywords allowed/i)).toBeInTheDocument();
    });
  });

  it('handles successful blog generation', async () => {
    const mockContent = 'Generated blog content';
    (generateBlog as jest.Mock).mockResolvedValueOnce({ content: mockContent });

    renderComponent();

    // Fill form
    fireEvent.change(screen.getByLabelText(/topic/i), { target: { value: 'Test Topic' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /generate blog post/i }));

    await waitFor(() => {
      expect(generateBlog).toHaveBeenCalledWith({
        topic: 'Test Topic',
        tone: 'professional',
        length: 'medium',
        target_audience: 'general',
        keywords: [],
      });
      expect(mockOnSuccess).toHaveBeenCalledWith(mockContent);
      expect(notifications.show).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Success',
      }));
    });
  });

  it('handles network error', async () => {
    const networkError = new Error('Network error');
    (generateBlog as jest.Mock).mockRejectedValueOnce(networkError);

    renderComponent();

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/topic/i), { target: { value: 'Test Topic' } });
    fireEvent.click(screen.getByRole('button', { name: /generate blog post/i }));

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('handles rate limit error', async () => {
    const rateLimitError = {
      response: {
        status: 429,
        data: { detail: 'Rate limit exceeded' },
      },
    };
    (generateBlog as jest.Mock).mockRejectedValueOnce(rateLimitError);

    renderComponent();

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/topic/i), { target: { value: 'Test Topic' } });
    fireEvent.click(screen.getByRole('button', { name: /generate blog post/i }));

    await waitFor(() => {
      expect(screen.getByText(/rate limit exceeded/i)).toBeInTheDocument();
    });
  });
}); 