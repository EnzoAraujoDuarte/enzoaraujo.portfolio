import { Inter, Space_Grotesk } from 'next/font/google';

export const bodyFont = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

export const displayFont = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

export const fontVariables = `${bodyFont.variable} ${displayFont.variable}`;
