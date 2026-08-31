import { useRef } from 'react';
import { gsap, useGSAP, SplitText } from '../../lib/gsap';
import { prefersReducedMotion } from '../../lib/motion';
import { withAccent } from '../../lib/accent';

const DIM = 0.14;

/**
 * The page's one loud typographic moment, and the quietest frame on the page.
 *
 * The words brighten in sequence as the section travels through the viewport.
 * Nothing else moves here: the corridor above already made the argument about
 * fragments resolving, so this section only has to be still and be read.
 */
export default function ScrollRevealStatement({ text, eyebrow }) {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const line = root.querySelector('[data-statement]');
      const reduced = prefersReducedMotion();

      let split;
      let cancelled = false;
      const tweens = [];

      // The build is async because splitting before the webfont lands measures
      // the fallback. StrictMode fires this callback twice, so without the
      // guard the element gets split on top of itself and picks up a second
      // set of scrub triggers.
      const build = () => {
        if (cancelled || !line) return;

        split = SplitText.create(line, { type: 'words' });

        if (reduced) {
          // Same reveal, no scrub: the words simply arrive.
          gsap.set(split.words, { opacity: 1 });
          return;
        }

        gsap.set(split.words, { opacity: DIM });

        tweens.push(
          gsap.to(split.words, {
            opacity: 1,
            ease: 'none',
            stagger: 0.4,
            scrollTrigger: { trigger: root, start: 'top 80%', end: 'bottom 65%', scrub: true },
          })
        );
      };

      // Splitting before the webfont lands measures the fallback.
      document.fonts.ready.then(build);

      return () => {
        cancelled = true;
        tweens.forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
        split?.revert();
      };
    },
    // Same reason as the hero: the paragraph's children belong to SplitText,
    // so a change of copy has to tear the split down first.
    { scope: rootRef, dependencies: [text] }
  );

  return (
    <section ref={rootRef} className="relative overflow-hidden py-28 tablet:py-40">
      <div className="container relative z-10">
        {eyebrow && <p className="meta mb-10 text-ember">{eyebrow}</p>}

        <p
          key={text}
          data-statement
          className="font-display text-[clamp(1.75rem,5.2vw,4.25rem)] font-semibold text-bone leading-[1.12] tracking-[-0.035em] max-w-5xl text-pretty"
        >
          {withAccent(text)}
        </p>
      </div>
    </section>
  );
}
