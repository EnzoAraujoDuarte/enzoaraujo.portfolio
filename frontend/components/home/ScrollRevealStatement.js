import { motion, useTransform, useReducedMotion } from 'framer-motion';
import { useScrollProgress } from '../../hooks/useParallax';

function Word({ children, progress, range, prefersReducedMotion }) {
  const opacity = useTransform(progress, range, [0.15, 1]);

  return (
    <span className="relative inline-block mr-[0.28em]">
      <span aria-hidden="true" className="absolute inset-0 text-white/[0.12]">
        {children}
      </span>
      <motion.span style={{ opacity: prefersReducedMotion ? 1 : opacity }}>
        {children}
      </motion.span>
    </span>
  );
}

/**
 * The page's one loud typographic moment: the statement brightens word by word
 * as it travels through the viewport.
 */
export default function ScrollRevealStatement({ text, eyebrow }) {
  const { ref, progress } = useScrollProgress(['start 0.9', 'end 0.55']);
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(' ');

  return (
    <section ref={ref} className="container py-28 tablet:py-40">
      {eyebrow && (
        <p className="font-display text-[10px] font-bold uppercase tracking-[0.28em] text-primary mb-10">
          {eyebrow}
        </p>
      )}

      <p className="font-display text-[clamp(1.75rem,5.2vw,4.25rem)] font-bold text-white leading-[1.12] tracking-[-0.035em] max-w-5xl">
        {words.map((word, index) => {
          const start = index / words.length;
          const end = start + 1 / words.length;

          return (
            <Word
              key={`${word}-${index}`}
              progress={progress}
              range={[start, end]}
              prefersReducedMotion={prefersReducedMotion}
            >
              {word}
            </Word>
          );
        })}
      </p>
    </section>
  );
}
