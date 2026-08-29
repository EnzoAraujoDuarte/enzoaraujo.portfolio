import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { prefersReducedMotion } from '../../lib/motion';

/** Drifts slower than the page, so the backdrop reads as a layer behind it. */
export default function PageBackdrop() {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.to(ref.current, {
        yPercent: 12,
        scale: 1.1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: true },
      });
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 z-0 opacity-[0.13] bg-cover bg-center bg-no-repeat will-change-transform"
      style={{ backgroundImage: 'url(/Images/art/hero-poster.webp)' }}
    />
  );
}
