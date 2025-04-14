import { useLocalStorage } from '@mantine/hooks';
import { MantineThemeOverride } from '@mantine/core';

type ColorScheme = 'light' | 'dark';

export const useTheme = () => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'color-scheme',
    defaultValue: 'light',
  });

  const toggleColorScheme = () => {
    setColorScheme((current: ColorScheme) => (current === 'dark' ? 'light' : 'dark'));
  };

  // Define the custom theme
  const theme: MantineThemeOverride = {
    primaryColor: 'indigo',
    colors: {
      // Custom color palette
      indigo: [
        '#EDF2FF', // 0
        '#DBE4FF', // 1
        '#BAC8FF', // 2
        '#91A7FF', // 3
        '#748FFC', // 4
        '#5C7CFA', // 5
        '#4C6EF5', // 6
        '#4263EB', // 7
        '#3B5BDB', // 8
        '#364FC7', // 9
      ],
    },
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    fontFamilyMonospace: 'Monaco, Courier, monospace',
    headings: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: '600',
    },
    defaultRadius: 'md',
    other: {
      blogCardHeight: 320,
      headerHeight: 70,
      navbarWidth: 250,
    },
    components: {
      Button: {
        defaultProps: {
          radius: 'md',
        },
        styles: {
          root: {
            fontWeight: 600,
          },
        },
      },
      Card: {
        defaultProps: {
          shadow: 'sm',
          radius: 'md',
          p: 'lg',
        },
      },
      Paper: {
        defaultProps: {
          shadow: 'sm',
          radius: 'md',
          p: 'md',
        },
      },
    },
  };

  return {
    colorScheme,
    toggleColorScheme,
    theme,
  };
}; 