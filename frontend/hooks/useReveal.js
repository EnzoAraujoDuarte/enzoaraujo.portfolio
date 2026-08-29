import { gsap, useGSAP } from '../lib/gsap';
import { STAGGER, START } from '../lib/motion';

/**
 * The one reveal every ordinary section uses.
 *
 * Mark an element `data-reveal` and it rises on its own trigger. Wrap siblings
 * in `data-reveal-group` and they stagger together off the group's trigger,
 * which is what you want for a grid or a list — seven separate triggers firing
 * a few pixels apart reads as noise, not choreography.
 */
export function useReveal(scopeRef, dependencies = []) {
  useGSAP(
    () => {
      const root = scopeRef.current;
      if (!root) return;

      const grouped = new Set();

      root.querySelectorAll('[data-reveal-group]').forEach((group) => {
        const items = group.querySelectorAll('[data-reveal]');
        if (!items.length) return;
        items.forEach((item) => grouped.add(item));
        gsap.effects.fadeUp(items, {
          stagger: STAGGER.base,
          scrollTrigger: { trigger: group, start: START.default },
        });
      });

      root.querySelectorAll('[data-reveal]').forEach((node) => {
        if (grouped.has(node)) return;
        gsap.effects.fadeUp(node, {
          scrollTrigger: { trigger: node, start: START.default },
        });
      });
    },
    { scope: scopeRef, dependencies }
  );
}
