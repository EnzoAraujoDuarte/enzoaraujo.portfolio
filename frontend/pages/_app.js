import { useEffect } from 'react';
import 'lenis/dist/lenis.css';
import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { MotionConfig } from 'framer-motion';
import { fontVariables } from '../lib/fonts';
import { applyMotionDefaults } from '../lib/motion';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import PageCurtain from '../components/layout/PageCurtain';
import Cursor from '../components/layout/Cursor';

function MyApp({ Component, pageProps }) {
  useSmoothScroll();

  useEffect(() => {
    applyMotionDefaults();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className={`${fontVariables} font-sans`}>
        <PageCurtain />
        <Component {...pageProps} />
        <Cursor />
        <Analytics />
      </div>
    </MotionConfig>
  );
}

export default MyApp;
