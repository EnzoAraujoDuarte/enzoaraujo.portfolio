/** Single source of truth for motion, so every surface eases the same way. */
export const EASE = {
  /** Default for entrances — decelerates into place. */
  out: [0.25, 0.46, 0.45, 0.94],
  /** Long, expressive reveals (hero lines, masked entrances). */
  expressive: [0.16, 1, 0.3, 1],
};

export const DURATION = {
  fast: 0.3,
  base: 0.55,
  slow: 0.9,
};

export const viewportOnce = { once: true, margin: '-70px' };

export const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE.out } },
};

export const staggerChildren = (stagger = 0.08, delayChildren = 0) => ({
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

/** Wipes the image in from the bottom instead of fading it. */
export const clipReveal = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.06 },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASE.expressive },
  },
};
