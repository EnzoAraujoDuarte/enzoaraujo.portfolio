import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { useRouter } from 'next/router';
import { fontVariables } from '../lib/fonts';

const pageVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <MotionConfig reducedMotion='user'>
      <div className={`${fontVariables} font-sans`}>
        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={router.asPath}
            variants={pageVariants}
            initial='initial'
            animate='animate'
            exit='exit'
          >
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
        <Analytics />
      </div>
    </MotionConfig>
  );
}

export default MyApp;
