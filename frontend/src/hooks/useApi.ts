import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { api } from '@services/api';
import { AxiosError } from 'axios';

export const useApiQuery = <T>(
  key: string[],
  endpoint: string,
  options?: Omit<UseQueryOptions<T, AxiosError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<T, AxiosError>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await api.get<T>(endpoint);
      return data;
    },
    ...options,
  });
};

export const useApiMutation = <T, V>(
  endpoint: string,
  options?: Omit<UseMutationOptions<T, AxiosError, V>, 'mutationFn'>
) => {
  return useMutation<T, AxiosError, V>({
    mutationFn: async (variables) => {
      const { data } = await api.post<T>(endpoint, variables);
      return data;
    },
    ...options,
  });
}; 