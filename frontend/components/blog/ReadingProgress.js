import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';

export default function ReadingProgress() {
  const ref = useRef(null);

  useGSAP(
    () => {
      // scrub carries the easing, so the bar lags the scroll slightly instead
      // of snapping — the same job the spring was doing.
      gsap.fromTo(
        ref.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left scale-x-0 bg-ember"
    />
  );
}
