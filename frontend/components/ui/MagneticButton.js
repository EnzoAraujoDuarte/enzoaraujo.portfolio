import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

const SPRING = { stiffness: 260, damping: 22, mass: 0.4 };

/**
 * Pulls its child a little toward the pointer. Skipped for coarse pointers and
 * for visitors who asked for reduced motion, so it never affects tap targets.
 */
export default function MagneticButton({ children, strength = 0.28, className = '' }) {
  const ref = useRef(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);

  const handleEnter = () => {
    setIsEnabled(
      !prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches
    );
  };

  const handleMove = (event) => {
    if (!isEnabled || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
