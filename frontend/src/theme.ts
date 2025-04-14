import { createTheme, MantineColorsTuple, MantineTheme } from '@mantine/core';

// Custom indigo shade
const indigo: MantineColorsTuple = [
  '#EDF2FF',
  '#DBE4FF',
  '#BAC8FF',
  '#91A7FF',
  '#748FFC',
  '#5C7CFA',
  '#4C6EF5',
  '#4263EB',
  '#3B5BDB',
  '#364FC7',
];

// Custom light blue shade
const lightBlue: MantineColorsTuple = [
  '#E7F5FF',
  '#D0EBFF',
  '#A5D8FF',
  '#74C0FC',
  '#4DABF7',
  '#339AF0',
  '#228BE6',
  '#1C7ED6',
  '#1971C2',
  '#1864AB',
];

// Custom teal shade
const teal: MantineColorsTuple = [
  '#E6FCF5',
  '#C3FAE8',
  '#96F2D7',
  '#63E6BE',
  '#38D9A9',
  '#20C997',
  '#12B886',
  '#0CA678',
  '#099268',
  '#087F5B',
];

// Export theme configuration
export const theme = createTheme({
  // Color scheme is set by ThemeProvider using colorScheme state
  primaryColor: 'indigo',
  colors: {
    indigo,
    lightBlue,
    teal,
  },
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  
  // Custom properties
  other: {
    blogCardHeight: 320,
    headerHeight: 70,
    navbarWidth: 250,
  },
  
  // Component overrides
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
        withBorder: true,
      },
    },
    Paper: {
      defaultProps: {
        shadow: 'sm',
        radius: 'md',
        p: 'md',
      },
    },
    Title: {
      styles: (theme: MantineTheme) => ({
        root: {
          '&:is(h1)': {
            marginBottom: theme.spacing.lg,
          },
          '&:is(h2)': {
            marginBottom: theme.spacing.md,
          },
          '&:is(h3)': {
            marginBottom: theme.spacing.sm,
          },
        },
      }),
    },
    Avatar: {
      defaultProps: {
        radius: 'xl',
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'md',
      },
    },
    Select: {
      defaultProps: {
        radius: 'md',
      },
    },
    Badge: {
      defaultProps: {
        radius: 'md',
      },
    },
    Notification: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
}); 