import { useRef } from 'react';
import { useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Maps an element's travel through the viewport onto a vertical offset.
 * Returns a static 0 when the visitor asked for reduced motion — MotionConfig
 * only covers `animate` props, not values driven straight into `style`.
 */
export function useParallax(distance = 60, offset = ['start end', 'end start']) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return { ref, y: prefersReducedMotion ? 0 : y };
}

/** Scroll progress across an element, for reveals driven by position. */
export function useScrollProgress(offset = ['start 0.85', 'end 0.35']) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });

  return { ref, progress: scrollYProgress };
}
