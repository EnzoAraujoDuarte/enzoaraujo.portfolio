import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '../../lib/gsap';
import { EASE, STAGGER, START, prefersReducedMotion } from '../../lib/motion';
import { getPractice } from './practice';

const pad = (n) => String(n).padStart(2, '0');

function Plate({ item, index, total }) {
  return (
    <article
      data-plate
      className="relative w-[78vw] largemobile:w-[52vw] tablet:w-[38vw] laptop:w-[26vw] desktop:w-[22vw] max-w-[420px] flex-shrink-0 snap-center"
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
            data-plate-image
            className="h-full w-full object-cover opacity-[0.45]"
          />
        </picture>

        <span
          data-plate-rule
          className="absolute bottom-0 left-0 block h-px w-full origin-left scale-x-0 bg-ember"
        />
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <span className="font-mono text-[10px] tabular-nums text-ash">
          {pad(index + 1)}
          <span className="text-ash/50"> / {pad(total)}</span>
        </span>
        {item.note && <span className="font-mono text-[10px] text-ash/60">{item.note}</span>}
      </div>

      <h3 className="mt-2 font-display text-xl laptop:text-2xl font-semibold tracking-[-0.025em] text-bone">
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
  );
}

/**
 * The practice rail: seven plates travelling sideways while the section holds
 * the viewport.
 *
 * Scroll is the only driver. A Draggable on the same track would give the
 * transform a second owner, and the two fight the moment a drag ends mid-scroll;
 * touch already works, because a vertical swipe is what moves the rail.
 *
 * The active plate is resolved inside `onUpdate` and written straight to the
 * two elements that change. Routing it through React state re-renders all seven
 * plates on every step and, in practice, the tweens never landed at all.
 *
 * Under reduced motion the section stops pinning and becomes an ordinary
 * horizontally scrollable list — same content, same order, no hijack.
 */
export default function PracticeRail({ isEnglish }) {
  const items = getPractice(isEnglish);
  const rootRef = useRef(null);
  const [reduced, setReduced] = useState(false);

  // Read on the client only: the server has no media queries, and rendering the
  // pinned markup then swapping it would flash.
  useEffect(() => setReduced(prefersReducedMotion()), []);

  useGSAP(
    () => {
      const root = rootRef.current;
      const track = root.querySelector('[data-rail-track]');
      const viewport = root.querySelector('[data-rail-viewport]');
      const counter = root.querySelector('[data-rail-counter]');
      const plates = Array.from(root.querySelectorAll('[data-plate]'));
      if (!track || !viewport) return undefined;

      const images = plates.map((plate) => plate.querySelector('[data-plate-image]'));
      const rules = plates.map((plate) => plate.querySelector('[data-plate-rule]'));

      gsap.effects.fadeUp(root.querySelectorAll('[data-rail-head]'), {
        stagger: STAGGER.base,
        scrollTrigger: { trigger: root, start: START.default },
      });

      let current = -1;
      const setActive = (next, immediate = false) => {
        if (next === current) return;
        [current, next].forEach((index) => {
          if (index < 0 || !images[index]) return;
          const on = index === next;
          const opacity = on ? 1 : 0.45;
          const scaleX = on ? 1 : 0;
          if (immediate) {
            gsap.set(images[index], { opacity });
            gsap.set(rules[index], { scaleX });
            return;
          }
          gsap.to(images[index], { opacity, duration: 0.5, ease: EASE.out });
          gsap.to(rules[index], { scaleX, duration: 0.6, ease: EASE.out });
        });
        current = next;
        if (counter) counter.textContent = pad(next + 1);
      };

      // Settled state on arrival — a tween here would depend on a frame
      // that a background tab never gets.
      setActive(0, true);

      // Pinning seven plates on a phone costs roughly five viewports of
      // hijacked scroll for content that swipes perfectly well on its own.
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: viewport,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => setActive(Math.round(self.progress * (plates.length - 1))),
          },
        });
      });

      // The plates are lazy-loaded, so the track keeps growing after the first
      // measurement — refresh once everything has settled.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      document.fonts.ready.then(refresh);

      return () => {
        window.removeEventListener('load', refresh);
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [isEnglish] }
  );

  return (
    <section ref={rootRef} className="relative">
      <div
        data-rail-viewport
        className="flex flex-col justify-center overflow-hidden py-20 tablet:min-h-[100svh] tablet:py-24"
      >
        <div className="container">
          <div className="mb-10 flex items-end justify-between gap-6 tablet:mb-14">
            <div>
              <p data-rail-head className="meta mb-5">
                {isEnglish ? 'The practice' : 'A prática'}
              </p>
              <h2
                data-rail-head
                className="font-display text-3xl tablet:text-4xl laptop:text-5xl font-semibold tracking-[-0.03em] leading-[1.05] text-bone text-balance"
              >
                {isEnglish ? 'What I actually ' : 'O que eu de fato '}
                <em className="accent">{isEnglish ? 'build' : 'construo'}</em>
              </h2>
            </div>

            <span
              data-rail-head
              className="hidden font-mono text-[11px] tabular-nums text-ash tablet:block"
            >
              <span data-rail-counter className="text-bone">
                {pad(1)}
              </span>
              {` / ${pad(items.length)}`}
            </span>
          </div>
        </div>

        {/* Aligned to the container on the left, bleeding off the right edge —
            the rail should read as continuing past the frame. */}
        <div
          data-rail-track
          className={`flex gap-6 tablet:gap-10 hide-scrollbar max-tablet:overflow-x-auto max-tablet:snap-x max-tablet:snap-mandatory ${
            reduced ? 'overflow-x-auto snap-x snap-mandatory' : ''
          }`}
          style={{
            paddingLeft: 'max(1rem, calc((100vw - 80rem) / 2 + 2rem))',
            paddingRight: '12vw',
          }}
        >
          {items.map((item, index) => (
            <Plate key={item.id} item={item} index={index} total={items.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
