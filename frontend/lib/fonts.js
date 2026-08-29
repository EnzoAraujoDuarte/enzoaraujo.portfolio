import localFont from 'next/font/local';
import { Instrument_Serif, JetBrains_Mono } from 'next/font/google';

/** Display — Clash Display, self-hosted (Fontshare, ITF Free Font License). */
export const displayFont = localFont({
  src: [
    { path: '../fonts/ClashDisplay-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/ClashDisplay-Semibold.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-display',
  fallback: ['system-ui', 'sans-serif'],
});

/** Body — Satoshi, self-hosted (Fontshare, ITF Free Font License). */
export const bodyFont = localFont({
  src: [
    { path: '../fonts/Satoshi-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Satoshi-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/Satoshi-Bold.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-body',
  fallback: ['system-ui', 'sans-serif'],
});

/** The signature move: one italic serif word inside a grotesk headline. */
export const serifFont = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
  // Next has no metric overrides for this family; declare the fallback
  // explicitly instead of letting it warn and guess.
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  adjustFontFallback: false,
});

/** Meta, labels, counters. */
export const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
});

export const fontVariables = [
  displayFont.variable,
  bodyFont.variable,
  serifFont.variable,
  monoFont.variable,
].join(' ');
