import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import { EASE } from '../../lib/motion';

const SWEEP = { duration: 0.34, ease: EASE.expressive };

/**
 * One continuous upward wipe across a route change: the panel slides up from
 * below to cover the outgoing page, then keeps going off the top.
 *
 * Driven by router events rather than AnimatePresence, which does not
 * orchestrate exit for nested children of a plain presence element.
 *
 * Uses a single-axis translate on purpose: if the route resolves before the
 * cover finishes, the reveal simply continues the same upward motion instead of
 * fighting it — animating transform-origin here left the panel stuck mid-scale.
 */
export default function PageCurtain() {
  const router = useRouter();
  const controls = useAnimationControls();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const cover = () => {
      controls.set({ y: '100%' });
      controls.start({ y: '0%', transition: SWEEP });
    };

    const reveal = () => {
      controls.start({ y: '-100%', transition: SWEEP });
    };

    router.events.on('routeChangeStart', cover);
    router.events.on('routeChangeComplete', reveal);
    router.events.on('routeChangeError', reveal);

    return () => {
      router.events.off('routeChangeStart', cover);
      router.events.off('routeChangeComplete', reveal);
      router.events.off('routeChangeError', reveal);
    };
  }, [router.events, controls, prefersReducedMotion]);

  // Safety net: whatever happened to the events, a settled route is never covered
  useEffect(() => {
    if (prefersReducedMotion) return;
    controls.start({ y: '-100%', transition: SWEEP });
  }, [router.asPath, controls, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      initial={{ y: '-100%' }}
      animate={controls}
      className="pointer-events-none fixed inset-0 z-[90] bg-dark-secondary"
    />
  );
}
