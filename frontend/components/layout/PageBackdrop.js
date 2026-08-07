import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/** Drifts slower than the page, so the backdrop reads as a layer behind it. */
export default function PageBackdrop() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <motion.div
      aria-hidden="true"
      style={prefersReducedMotion ? undefined : { y, scale }}
      className="fixed inset-0 z-0 opacity-20 bg-cover bg-center bg-no-repeat"
      // eslint-disable-next-line react/forbid-dom-props
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/Images/griddistortion.webp)' }}
      />
    </motion.div>
  );
}
