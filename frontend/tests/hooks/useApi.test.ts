import { renderHook, act } from '@testing-library/react';
import axios from 'axios';
import { useApiQuery, useApiMutation } from '../../src/hooks/useApi';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useApi', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );

  describe('useApiQuery', () => {
    it('should fetch data successfully', async () => {
      const mockData = { id: 1, title: 'Test Post' };
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(
        () => useApiQuery('/posts/1'),
        { wrapper }
      );

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });

    it('should handle errors', async () => {
      const mockError = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(mockError);

      const { result } = renderHook(
        () => useApiQuery('/posts/1'),
        { wrapper }
      );

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toEqual(mockError);
    });
  });

  describe('useApiMutation', () => {
    it('should mutate data successfully', async () => {
      const mockData = { id: 1, title: 'New Post' };
      mockedAxios.post.mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(
        () => useApiMutation('/posts', 'post'),
        { wrapper }
      );

      expect(result.current.isLoading).toBe(false);

      await act(async () => {
        const response = await result.current.mutateAsync({ title: 'New Post' });
        expect(response).toEqual(mockData);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle mutation errors', async () => {
      const mockError = new Error('Network error');
      mockedAxios.post.mockRejectedValueOnce(mockError);

      const { result } = renderHook(
        () => useApiMutation('/posts', 'post'),
        { wrapper }
      );

      expect(result.current.isLoading).toBe(false);

      await act(async () => {
        try {
          await result.current.mutateAsync({ title: 'New Post' });
        } catch (error) {
          expect(error).toEqual(mockError);
        }
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toEqual(mockError);
    });
  });
}); 