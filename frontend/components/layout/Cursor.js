import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { EASE, prefersReducedMotion } from '../../lib/motion';

const INTERACTIVE = 'a, button, [data-cursor="target"]';

/**
 * Bone dot that trails the pointer, opening into an ember ring over anything
 * interactive. Positions are written straight to the transform via quickTo —
 * routing 120 pointer events a second through React state costs more than the
 * whole effect is worth.
 *
 * Hidden entirely on coarse pointers by the CSS below.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useGSAP(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring || window.matchMedia('(hover: none)').matches) return undefined;

    const reduced = prefersReducedMotion();
    const lag = reduced ? 0 : 0.45;

    // Centering has to live in the same transform GSAP writes — a Tailwind
    // `-translate-x-1/2` would simply be overwritten on the first tick.
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.15, ease: EASE.follow });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.15, ease: EASE.follow });
    const ringX = gsap.quickTo(ring, 'x', { duration: lag, ease: EASE.follow });
    const ringY = gsap.quickTo(ring, 'y', { duration: lag, ease: EASE.follow });

    let visible = false;

    const onMove = (event) => {
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });
      }
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    };

    const onLeave = () => {
      visible = false;
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 });
    };

    const onOver = (event) => {
      if (!event.target.closest?.(INTERACTIVE)) return;
      gsap.to(ring, { scale: 1.9, borderColor: '#FF4D1C', duration: 0.35, ease: EASE.out });
      gsap.to(dot, { scale: 0, duration: 0.25, ease: EASE.out });
    };

    const onOut = (event) => {
      if (!event.target.closest?.(INTERACTIVE)) return;
      gsap.to(ring, { scale: 1, borderColor: 'rgba(237,234,227,0.35)', duration: 0.35, ease: EASE.out });
      gsap.to(dot, { scale: 1, duration: 0.25, ease: EASE.out });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerover', onOver, true);
    document.addEventListener('pointerout', onOut, true);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerover', onOver, true);
      document.removeEventListener('pointerout', onOut, true);
    };
  }, []);

  return (
    <div aria-hidden="true" className="cursor-layer">
      <span
        ref={ringRef}
        className="fixed left-0 top-0 z-[120] block h-10 w-10 rounded-full border border-bone/35 opacity-0 pointer-events-none will-change-transform"
      />
      <span
        ref={dotRef}
        className="fixed left-0 top-0 z-[120] block h-1.5 w-1.5 rounded-full bg-bone opacity-0 pointer-events-none will-change-transform"
      />
    </div>
  );
}
