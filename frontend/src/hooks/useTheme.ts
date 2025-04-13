import { useLocalStorage } from '@mantine/hooks';

type ColorScheme = 'light' | 'dark';

export const useTheme = () => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'color-scheme',
    defaultValue: 'light',
  });

  const toggleColorScheme = () => {
    setColorScheme((current: ColorScheme) => (current === 'dark' ? 'light' : 'dark'));
  };

  return {
    colorScheme,
    toggleColorScheme,
  };
}; 