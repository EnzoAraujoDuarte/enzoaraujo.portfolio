import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap, useGSAP, SplitText } from '../../lib/gsap';
import { prefersReducedMotion } from '../../lib/motion';
import { withAccent } from '../../lib/accent';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const SignalField = dynamic(() => import('../effects/SignalField'), { ssr: false });

const DIM = 0.14;

/**
 * The page's one loud typographic moment.
 *
 * The words brighten in sequence as the section travels through the viewport,
 * and the field behind them fades out on the same scrub — so the noise is only
 * present while the sentence is still illegible. By the time it reads, the
 * frame is quiet. That is the whole argument of the site in one section.
 */
export default function ScrollRevealStatement({ text, eyebrow }) {
  const rootRef = useRef(null);
  // Gated on render, not on CSS: `hidden` still mounts the component and a
  // hidden canvas is a live WebGL context all the same.
  const showField = useMediaQuery('(min-width: 768px)');

  useGSAP(
    () => {
      const root = rootRef.current;
      const line = root.querySelector('[data-statement]');
      const field = root.querySelector('[data-statement-field]');
      const reduced = prefersReducedMotion();

      let split;

      const build = () => {
        split = SplitText.create(line, { type: 'words' });

        if (reduced) {
          // Same reveal, no scrub: the words simply arrive.
          gsap.set(split.words, { opacity: 1 });
          if (field) gsap.set(field, { opacity: 0.06 });
          return;
        }

        gsap.set(split.words, { opacity: DIM });

        gsap.to(split.words, {
          opacity: 1,
          ease: 'none',
          stagger: 0.4,
          scrollTrigger: {
            trigger: root,
            start: 'top 80%',
            end: 'bottom 65%',
            scrub: true,
          },
        });

        if (field) gsap.to(field, {
          opacity: 0.04,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top 80%',
            end: 'bottom 70%',
            scrub: true,
          },
        });
      };

      // Splitting before the webfont lands measures the fallback.
      document.fonts.ready.then(build);

      return () => split?.revert();
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="relative overflow-hidden py-28 tablet:py-40">
      {/* Second WebGL context on the page — worth it on a desktop GPU behind
          large type, not on a phone where it sits at 26% under 28px copy. */}
      <div
        data-statement-field
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{ opacity: 0.26 }}
      >
        {showField && <SignalField imageSrc="/Images/art/hero-poster.webp" />}
      </div>

      {/* The type has to win: the field only ever reads as texture behind it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-ink via-ink/75 to-ink"
      />

      <div className="container relative z-10">
        {eyebrow && <p className="meta mb-10 text-ember">{eyebrow}</p>}

        <p
          data-statement
          className="font-display text-[clamp(1.75rem,5.2vw,4.25rem)] font-semibold text-bone leading-[1.12] tracking-[-0.035em] max-w-5xl text-pretty"
        >
          {withAccent(text)}
        </p>
      </div>
    </section>
  );
}
