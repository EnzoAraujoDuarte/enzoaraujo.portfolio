import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';

/**
 * Lenis driven by the GSAP ticker, so scroll position and every scrubbed
 * timeline advance on the same frame. Native scroll drifts a frame behind
 * ScrollTrigger, which shows up as jitter on anything pinned.
 *
 * Returns nothing: the instance is exposed on `window.lenis` for the few
 * places that need to command scroll (anchor links, route changes).
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis({
      duration: 1.05,
      // Long tail that settles rather than stops — matches the motion personality.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch keeps native momentum; hijacking it feels broken on mobile.
      smoothTouch: false,
    });

    window.lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    // GSAP's lag smoothing pauses the ticker after a stall, which strands Lenis.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      delete window.lenis;
    };
  }, []);
}
