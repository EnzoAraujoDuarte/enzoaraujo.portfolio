import { gsap, useGSAP } from '../lib/gsap';
import { EASE, prefersReducedMotion } from '../lib/motion';

/**
 * Writes the pointer position into `--x` / `--y` as lengths, for an element
 * that follows the cursor through a CSS mask.
 *
 * The mask gradient itself never changes — only `mask-position` moves — so the
 * browser reuses the same mask image every frame instead of regenerating it.
 */
export function usePointerMask(ref) {
  useGSAP(
    () => {
      const el = ref.current;
      const layer = el?.querySelector('[data-pointer-mask]');
      if (!el || !layer) return undefined;
      if (prefersReducedMotion() || !window.matchMedia('(hover: hover)').matches) return undefined;

      const x = gsap.quickTo(layer, '--x', { duration: 0.45, ease: EASE.follow });
      const y = gsap.quickTo(layer, '--y', { duration: 0.45, ease: EASE.follow });

      const onMove = (event) => {
        const rect = el.getBoundingClientRect();
        x(event.clientX - rect.left);
        y(event.clientY - rect.top);
      };

      const onEnter = (event) => {
        const rect = el.getBoundingClientRect();
        // Jump to the entry point, so the mask does not sweep in from the
        // last place the pointer left.
        gsap.set(layer, { '--x': event.clientX - rect.left, '--y': event.clientY - rect.top });
        layer.style.opacity = '1';
      };

      const onLeave = () => {
        layer.style.opacity = '0';
      };

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerenter', onEnter);
      el.addEventListener('pointerleave', onLeave);

      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerenter', onEnter);
        el.removeEventListener('pointerleave', onLeave);
      };
    },
    { scope: ref }
  );
}
