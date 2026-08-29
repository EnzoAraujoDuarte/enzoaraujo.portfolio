import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { gsap, useGSAP } from '../../lib/gsap';
import { EASE, STAGGER, START, prefersReducedMotion } from '../../lib/motion';
import { getPractice } from './practice';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const PracticeCorridor = dynamic(() => import('../effects/PracticeCorridor'), { ssr: false });

const pad = (n) => String(n).padStart(2, '0');

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/** The plates as an ordinary swipeable list — phones, reduced motion, no GPU. */
function PracticeList({ items, isEnglish }) {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      gsap.effects.fadeUp(rootRef.current.querySelectorAll('[data-list-head]'), {
        stagger: STAGGER.base,
        scrollTrigger: { trigger: rootRef.current, start: START.default },
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="py-20 tablet:py-28">
      <div className="container">
        <p data-list-head className="meta mb-5">
          {isEnglish ? 'The practice' : 'A prática'}
        </p>
        <h2
          data-list-head
          className="mb-10 font-display text-3xl tablet:text-4xl font-semibold tracking-[-0.03em] leading-[1.05] text-bone text-balance"
        >
          {isEnglish ? 'What I actually ' : 'O que eu de fato '}
          <em className="accent">{isEnglish ? 'build' : 'construo'}</em>
        </h2>
      </div>

      <div
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto hide-scrollbar"
        style={{ paddingLeft: 'max(1rem, calc((100vw - 80rem) / 2 + 2rem))', paddingRight: '12vw' }}
      >
        {items.map((item, index) => (
          <article
            key={item.id}
            className="w-[78vw] max-w-[420px] flex-shrink-0 snap-center largemobile:w-[52vw]"
          >
            <div className="relative aspect-square overflow-hidden rounded-sm bg-graphite">
              <picture>
                <source srcSet={`/Images/art/${item.image}.avif`} type="image/avif" />
                <source srcSet={`/Images/art/${item.image}.webp`} type="image/webp" />
                <img
                  src={`/Images/art/${item.image}.webp`}
                  alt=""
                  width={1000}
                  height={1000}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </picture>
            </div>

            <span className="mt-5 block font-mono text-[10px] tabular-nums text-ash">
              {pad(index + 1)}
              <span className="text-ash/50"> / {pad(items.length)}</span>
            </span>
            <h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.025em] text-bone">
              {item.title}
            </h3>
            <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-bone/55 text-pretty">
              {item.line}
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
              {item.stack.map((tool) => (
                <li key={tool} className="font-mono text-[11px] text-ash">
                  {tool}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

/** The corridor: one scene, seven stations, a camera that walks them. */
function PracticeWalk({ items, isEnglish }) {
  const rootRef = useRef(null);
  const [beat, setBeat] = useState(0);
  const images = useRef(items.map((item) => `/Images/art/${item.image}.webp`)).current;

  const onBeat = useCallback((next) => setBeat(next), []);

  useGSAP(
    () => {
      const root = rootRef.current;
      const blocks = root.querySelectorAll('[data-station]');
      const active = blocks[beat];
      if (!active) return;

      // Only the two blocks that change get touched.
      blocks.forEach((block, index) => {
        if (index === beat) return;
        gsap.to(block, { autoAlpha: 0, y: -12, duration: 0.35, ease: EASE.out, overwrite: true });
      });
      gsap.fromTo(
        active,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.out, overwrite: true }
      );
    },
    { scope: rootRef, dependencies: [beat] }
  );

  const item = items[beat] ?? items[0];

  return (
    <section ref={rootRef} data-corridor-root className="relative">
      <div data-corridor-viewport className="relative h-[100svh] overflow-hidden">
        <PracticeCorridor images={images} onBeat={onBeat} />

        {/* Copy stays in the DOM: selectable, translatable, and legible even if
            the GPU gives up. */}
        <div className="container pointer-events-none relative z-10 flex h-full flex-col justify-between py-20 tablet:py-24">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="meta mb-4">{isEnglish ? 'The practice' : 'A prática'}</p>
              <h2 className="max-w-[16ch] font-display text-3xl laptop:text-4xl font-semibold tracking-[-0.03em] leading-[1.05] text-bone text-balance">
                {isEnglish ? 'What I actually ' : 'O que eu de fato '}
                <em className="accent">{isEnglish ? 'build' : 'construo'}</em>
              </h2>
            </div>

            <span className="font-mono text-[11px] tabular-nums text-ash">
              <span className="text-bone">{pad(beat + 1)}</span>
              {` / ${pad(items.length)}`}
            </span>
          </div>

          <div className="relative h-[13rem] max-w-[34rem]">
            {items.map((station, index) => (
              <div
                key={station.id}
                data-station
                aria-hidden={index !== beat}
                className="absolute inset-x-0 bottom-0"
                style={{ opacity: index === 0 ? 1 : 0 }}
              >
                <span className="font-mono text-[11px] tabular-nums text-ember">
                  {pad(index + 1)}
                </span>
                <h3 className="mt-3 font-display text-2xl laptop:text-3xl font-semibold tracking-[-0.03em] text-bone">
                  {station.title}
                </h3>
                <p className="mt-4 text-sm laptop:text-base leading-relaxed text-bone/65 text-pretty">
                  {station.line}
                </p>
                <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1">
                  {station.stack.map((tool) => (
                    <li key={tool} className="font-mono text-[11px] text-ash">
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* One heading for the whole section, for anything that does not run JS. */}
      <h2 className="sr-only">{item.title}</h2>
    </section>
  );
}

/**
 * Seven disciplines, told twice.
 *
 * With a pointer, a GPU and no reduced-motion request, they are stations in a
 * corridor the scroll walks through. Everywhere else they are a swipeable list
 * of the same plates — the content and its order never change, only how much
 * machinery is asked of the device.
 */
export default function PracticeSection({ isEnglish }) {
  const items = getPractice(isEnglish);
  // Live, so dragging a window across the breakpoint swaps the treatment
  // instead of stranding whichever one happened to load.
  const wide = useMediaQuery('(min-width: 1024px)');
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    setCapable(!prefersReducedMotion() && supportsWebGL());
  }, []);

  return wide && capable ? (
    <PracticeWalk items={items} isEnglish={isEnglish} />
  ) : (
    <PracticeList items={items} isEnglish={isEnglish} />
  );
}
