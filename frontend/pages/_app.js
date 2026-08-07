import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { MotionConfig } from 'framer-motion';
import { fontVariables } from '../lib/fonts';
import PageCurtain from '../components/layout/PageCurtain';

function MyApp({ Component, pageProps }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className={`${fontVariables} font-sans`}>
        <PageCurtain />
        <Component {...pageProps} />
        <Analytics />
      </div>
    </MotionConfig>
  );
}

export default MyApp;
