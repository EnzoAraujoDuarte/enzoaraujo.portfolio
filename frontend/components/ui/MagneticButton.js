import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { EASE, prefersReducedMotion } from '../../lib/motion';

const PULL = 0.28;

/**
 * The button leans toward the pointer while it is nearby and springs back when
 * it leaves. Positions go straight into the transform via quickTo — a spring
 * per pointer event through React state costs far more than the effect is worth.
 */
export default function MagneticButton({ children, className = '' }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion() || window.matchMedia('(hover: none)').matches) {
        return undefined;
      }

      const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: EASE.follow });
      const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: EASE.follow });

      const onMove = (event) => {
        const rect = el.getBoundingClientRect();
        x((event.clientX - (rect.left + rect.width / 2)) * PULL);
        y((event.clientY - (rect.top + rect.height / 2)) * PULL);
      };

      const onLeave = () => {
        x(0);
        y(0);
      };

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);

      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      };
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </div>
  );
}
