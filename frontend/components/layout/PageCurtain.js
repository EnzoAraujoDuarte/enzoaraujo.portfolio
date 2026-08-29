import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { gsap } from '../../lib/gsap';
import { DURATION, EASE, prefersReducedMotion } from '../../lib/motion';

const HIDDEN = 'inset(0% 0% 100% 0%)';
const COVERED = 'inset(0% 0% 0% 0%)';
const LEAVING = 'inset(100% 0% 0% 0%)';

/**
 * One continuous upward wipe across a route change: the panel closes down over
 * the outgoing page, then keeps travelling off the top to reveal the new one.
 *
 * Driven by router events rather than AnimatePresence, which does not
 * orchestrate exit for nested children of a plain presence element. Animating
 * clip-path instead of a translate keeps the panel itself static, so a route
 * that resolves mid-wipe continues the same motion instead of fighting it.
 */
export default function PageCurtain() {
  const router = useRouter();
  const panelRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const panel = panelRef.current;
    if (!panel) return undefined;

    gsap.set(panel, { clipPath: HIDDEN });

    const cover = () => {
      gsap.set(panel, { clipPath: LEAVING });
      gsap.to(panel, { clipPath: COVERED, duration: DURATION.curtain, ease: EASE.inOut });
    };

    const reveal = () => {
      gsap.to(panel, { clipPath: HIDDEN, duration: DURATION.curtain, ease: EASE.inOut });
      window.lenis?.scrollTo(0, { immediate: true });
    };

    router.events.on('routeChangeStart', cover);
    router.events.on('routeChangeComplete', reveal);
    router.events.on('routeChangeError', reveal);

    return () => {
      router.events.off('routeChangeStart', cover);
      router.events.off('routeChangeComplete', reveal);
      router.events.off('routeChangeError', reveal);
    };
  }, [router.events]);

  // Safety net: whatever happened to the events, a settled route is never covered
  useEffect(() => {
    if (prefersReducedMotion() || !panelRef.current) return;
    gsap.to(panelRef.current, { clipPath: HIDDEN, duration: DURATION.curtain, ease: EASE.inOut });
  }, [router.asPath]);

  return (
    <div
      ref={panelRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[110] bg-graphite"
      style={{ clipPath: HIDDEN }}
    />
  );
}
