import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { ReactNode, useEffect, useState } from 'react';
import { theme } from '../theme';

type AppColorScheme = 'light' | 'dark' | 'auto';
type MantineColorScheme = 'light' | 'dark';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Get system color scheme
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<AppColorScheme>('auto');

  // Initialize color scheme from localStorage or system preference
  useEffect(() => {
    const savedColorScheme = localStorage.getItem('app-color-scheme') as AppColorScheme | null;
    setColorScheme(savedColorScheme || 'auto');
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('app-color-scheme', colorScheme);
  }, [colorScheme]);

  // Compute actual color scheme for Mantine
  const resolvedColorScheme: MantineColorScheme = 
    colorScheme === 'auto' ? systemColorScheme : colorScheme as MantineColorScheme;

  const toggleColorScheme = () => {
    setColorScheme((current) => {
      if (current === 'dark') return 'light';
      if (current === 'light') return 'auto';
      return 'dark';
    });
  };

  return (
    <>
      <ColorSchemeScript />
      <MantineProvider
        theme={theme}
        defaultColorScheme={resolvedColorScheme}
      >
        {children}
      </MantineProvider>
    </>
  );
} 