import { gsap } from './gsap';

/**
 * Motion personality: precise, decisive, settling.
 *
 * Everything in this site travels from noise toward order, so every curve
 * decelerates into place. Nothing overshoots and nothing bounces — a bounce
 * reads as playful, which is the opposite of the argument the page is making.
 */
export const EASE = {
  /** Default entrance. */
  out: 'power3.out',
  /** Long, expressive reveals — hero lines, masked entrances, the rail. */
  expressive: 'expo.out',
  /** Two-way moves: wipes, curtains, drawer states. */
  inOut: 'power2.inOut',
  /** Cursor and other pointer-following values. */
  follow: 'power2.out',
};

export const DURATION = {
  fast: 0.3,
  base: 0.6,
  slow: 1.0,
  /** One continuous route wipe, cover + reveal. */
  curtain: 0.5,
};

/** Choreography: how long a sibling waits before it follows the one before it. */
export const STAGGER = {
  tight: 0.04,
  base: 0.08,
  loose: 0.14,
};

/** Where an element starts animating relative to the viewport. */
export const START = {
  default: 'top 85%',
  late: 'top 70%',
};

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Reduced motion is a parallel design, not an off switch: the same intent
 * arrives, it just arrives without travel. Each effect decides that at call
 * time rather than at registration, so a visitor who changes the setting
 * mid-session gets the right treatment on the next reveal.
 *
 * Registration happens on import, not in an effect: `useGSAP` runs as a layout
 * effect, so any component would otherwise reach for `gsap.effects.*` before an
 * ancestor's `useEffect` had a chance to define them.
 */
function register(name, { travel, base }) {
  gsap.registerEffect({
    name,
    defaults: base,
    extendTimeline: true,
    effect: (targets, config) =>
      prefersReducedMotion()
        ? gsap.from(targets, { ...config, ...travel, opacity: 0, duration: DURATION.fast, stagger: 0 })
        : gsap.from(targets, { ...config }),
  });
}

if (typeof window !== 'undefined') {
  /** Masked entrance — the line slides up from behind its own bounds. */
  register('riseIn', {
    base: { y: '110%', duration: DURATION.slow, ease: EASE.expressive, stagger: STAGGER.base },
    travel: { y: 0 },
  });

  /** The quieter sibling of riseIn, for body copy and meta rows. */
  register('fadeUp', {
    base: { y: 22, opacity: 0, duration: DURATION.base, ease: EASE.out, stagger: STAGGER.base },
    travel: { y: 0 },
  });

  /** Wipes an image in instead of fading it. */
  register('clipReveal', {
    base: {
      clipPath: 'inset(100% 0% 0% 0%)',
      scale: 1.06,
      duration: DURATION.slow,
      ease: EASE.expressive,
    },
    travel: { clipPath: 'none', scale: 1 },
  });
}

export function applyMotionDefaults() {
  gsap.defaults({
    ease: EASE.out,
    duration: prefersReducedMotion() ? DURATION.fast : DURATION.base,
  });
}
