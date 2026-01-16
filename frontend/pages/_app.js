import '../styles/globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
      <Analytics />
    </LanguageProvider>
  );
}

export default MyApp; 