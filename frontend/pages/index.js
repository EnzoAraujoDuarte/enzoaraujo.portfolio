import { useMemo, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FiArrowRight, FiArrowUpRight, FiDownload } from 'react-icons/fi';

import Layout from '../components/layout/Layout';
import ScrollRevealStatement from '../components/home/ScrollRevealStatement';
import PracticeSection from '../components/home/PracticeSection';
import MagneticButton from '../components/ui/MagneticButton';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../locales/translations';
import { getArticleSummaries } from '../lib/articles';
import { formatArticleDate } from '../utils/dateUtils';
import * as M from '../lib/motion';
import { gsap, useGSAP, SplitText } from '../lib/gsap';
import { withAccent, stripAccent } from '../lib/accent';
import { useReveal } from '../hooks/useReveal';

// Lazy load effects and the chat widget to keep the hero bundle small
const GridDistortion = dynamic(() => import('../components/effects/GridDistortion'), { ssr: false });

const EnzoIAChat = dynamic(
  () => import('../components/chat/EnzoIAChat'),
  { ssr: false }
);

function Hero({ language, cvFile }) {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const heading = root.querySelector('[data-hero-heading]');
      const eyebrow = root.querySelector('[data-hero-eyebrow]');
      const copy = root.querySelectorAll('[data-hero-copy]');
      const scrollCue = root.querySelector('[data-hero-scroll]');

      let split;
      let intro;
      let cancelled = false;

      // Splitting before the webfont lands measures the fallback and breaks
      // the lines in the wrong places — so the build is async, and async work
      // inside an effect has to survive being torn down mid-flight. Under
      // StrictMode this callback fires twice; without the guard the second
      // pass reads the first one's in-progress values.
      const build = () => {
        if (cancelled || !heading) return;

        split = SplitText.create(heading, { type: 'lines', mask: 'lines' });

        // set + to, never from: a `from` that runs twice records whatever the
        // element happens to be showing as its destination, which is how the
        // eyebrow, copy and buttons ended up stranded at opacity 0.
        gsap.set(split.lines, { yPercent: 115 });
        gsap.set(eyebrow, { yPercent: 110 });
        gsap.set(copy, { opacity: 0, y: 22 });
        gsap.set(scrollCue, { opacity: 0 });

        intro = gsap
          .timeline({ defaults: { ease: M.EASE.expressive } })
          .to(split.lines, { yPercent: 0, duration: M.DURATION.slow, stagger: M.STAGGER.base })
          .to(eyebrow, { yPercent: 0, duration: M.DURATION.base }, 0.1)
          .to(
            copy,
            { opacity: 1, y: 0, duration: M.DURATION.base, stagger: M.STAGGER.loose, ease: M.EASE.out },
            '-=0.55'
          )
          .to(scrollCue, { opacity: 1, duration: M.DURATION.base }, '-=0.2');
      };

      document.fonts.ready.then(build);

      // The content drifts slower than the plate behind it.
      if (!M.prefersReducedMotion()) {
        gsap.to('[data-hero-content]', {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
        });
      }

      return () => {
        cancelled = true;
        intro?.kill();
        split?.revert();
      };
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative min-h-[100svh] w-full flex items-center overflow-hidden bg-ink"
    >
      <div className="absolute inset-0 z-0">
        <GridDistortion
          imageSrc="/Images/art/hero-poster.webp"
          grid={10}
          mouse={0.15}
          strength={0.2}
          relaxation={0.9}
        />
      </div>

      {/* Two scrims, not one. The vertical pass seats the header and hands off
          to the section below; the horizontal pass keeps the copy column on
          solid ink and lets the field breathe on the right — which is also
          what makes the composition asymmetric rather than centred. */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-ink/70 via-transparent to-ink pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-ink via-ink/70 to-ink/35 tablet:to-transparent pointer-events-none" />

      <div data-hero-content className="relative z-20 container py-32 tablet:py-40">
        <p className="overflow-hidden mb-6 tablet:mb-8">
          <span data-hero-eyebrow className="meta block text-ember">
            {t('home.greeting', language)}
          </span>
        </p>

        <h1
          data-hero-heading
          className="font-display text-[clamp(2.5rem,9vw,7.5rem)] ultrawide:text-[8.5rem] font-semibold text-bone leading-[0.92] tracking-[-0.045em]"
        >
          {t('home.title', language)}
        </h1>

        <p
          data-hero-copy
          className="mt-8 tablet:mt-10 max-w-xl laptop:max-w-2xl text-base tablet:text-lg laptop:text-xl text-bone/70 leading-relaxed text-pretty"
        >
          {withAccent(t('home.subtitle', language))}
        </p>

        <div
          data-hero-copy
          className="mt-10 tablet:mt-12 flex flex-col largemobile:flex-row largemobile:items-center gap-4"
        >
          <MagneticButton>
            <Link
              href="/about"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-ember text-ink text-sm tablet:text-base font-medium hover:bg-ember-dim transition-colors duration-200"
            >
              {t('home.cta.about', language)}
              <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </MagneticButton>

          <a
            href={cvFile}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-bone/[0.06] backdrop-blur-sm border border-bone/15 text-bone text-sm tablet:text-base font-medium hover:bg-bone/[0.12] transition-colors duration-200"
          >
            <FiDownload className="w-4 h-4" />
            {t('home.cta.cv', language)}
          </a>
        </div>
      </div>

      <span
        data-hero-scroll
        className="meta absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden tablet:flex items-center gap-3"
      >
        {t('home.scroll', language)}
        <span className="block w-10 h-px bg-bone/25" />
      </span>
    </section>
  );
}

function NowSection({ language }) {
  const rootRef = useRef(null);
  const focusAreas = [1, 2, 3].map((index) => ({
    index,
    title: t(`home.now.focus${index}.title`, language),
    text: t(`home.now.focus${index}.text`, language),
  }));

  useGSAP(
    () => {
      const root = rootRef.current;
      gsap.effects.fadeUp(root.querySelectorAll('[data-now-head]'), {
        stagger: M.STAGGER.base,
        scrollTrigger: { trigger: root, start: M.START.default },
      });
      gsap.effects.fadeUp(root.querySelectorAll('[data-now-item]'), {
        stagger: M.STAGGER.loose,
        scrollTrigger: { trigger: root.querySelector('[data-now-grid]'), start: M.START.default },
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="container py-24 tablet:py-32">
      <div data-now-head className="flex items-center gap-4 mb-6">
        <p className="meta whitespace-nowrap">{t('home.now.eyebrow', language)}</p>
        <div className="flex-1 h-px bg-bone/10" />
      </div>

      <h2
        data-now-head
        className="font-display text-3xl tablet:text-4xl laptop:text-5xl font-semibold text-bone tracking-[-0.03em] leading-[1.05] text-balance"
      >
        {t('home.now.title', language)}
      </h2>

      <p data-now-head className="mt-5 inline-flex items-center gap-2 text-sm text-bone/55">
        <span className="w-1.5 h-1.5 rounded-full bg-ember" />
        {t('about.currentRole', language)}
      </p>

      <div
        data-now-grid
        className="mt-14 grid grid-cols-1 tablet:grid-cols-3 gap-x-10 gap-y-10 laptop:gap-x-14"
      >
        {focusAreas.map((area) => (
          <div key={area.index} data-now-item className="border-t border-bone/10 pt-6">
            <span className="font-mono text-[11px] text-ember tabular-nums">
              {`0${area.index}`}
            </span>
            <h3 className="mt-3 font-display text-lg laptop:text-xl font-semibold text-bone leading-snug tracking-[-0.02em]">
              {area.title}
            </h3>
            <p className="mt-3 text-sm text-bone/55 leading-relaxed text-pretty">{area.text}</p>
          </div>
        ))}
      </div>

      <div data-now-item className="mt-12">
        <Link
          href="/about"
          className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-ember"
        >
          {t('home.now.cta', language)}
          <FiArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </section>
  );
}

function LatestWriting({ article, language, isEnglish }) {
  return (
    <section className="container pb-24 tablet:pb-32">
      <div data-reveal>
        <div className="flex items-center gap-4 mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-bone/55 whitespace-nowrap">
            {t('home.writing.eyebrow', language)}
          </p>
          <div className="flex-1 h-px bg-bone/10" />
        </div>

        <Link
          href={`/blog/${article.slug}`}
          className="group grid grid-cols-1 laptop:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-4 laptop:gap-10"
        >
          <div className="flex laptop:flex-col items-baseline laptop:items-start gap-3 laptop:gap-2">
            <time
              dateTime={article.date}
              className="text-xs font-semibold uppercase tracking-[0.14em] text-ember tabular-nums"
            >
              {formatArticleDate(article.date, isEnglish)}
            </time>
            <span className="text-xs text-ash/70">
              {article.readingMinutes} {t('blog.readingTime', language)}
            </span>
          </div>

          <div>
            <h2 className="font-display text-2xl tablet:text-3xl laptop:text-4xl font-bold text-bone leading-[1.1] tracking-[-0.03em] group-hover:text-ember transition-colors duration-300 text-balance">
              {article.title}
            </h2>

            <p className="mt-4 max-w-2xl text-sm tablet:text-base text-bone/55 leading-relaxed text-pretty">
              {article.description}
            </p>

            <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-ember">
              {isEnglish ? 'Read' : 'Ler'}
              <FiArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </Link>

        <div className="mt-10 pt-8 border-t border-bone/[0.07]">
          <Link
            href="/blog"
            className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-bone/55 hover:text-ember transition-colors duration-200"
          >
            {t('home.writing.all', language)}
            <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ClosingCallToAction({ language }) {
  return (
    <section className="container pb-28 tablet:pb-36">
      <div data-reveal
        className="relative overflow-hidden rounded-3xl border border-bone/[0.08] bg-graphite px-8 py-14 tablet:px-14 tablet:py-20">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-ember/15 blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl">
          <h2 className="font-display text-3xl tablet:text-4xl laptop:text-5xl font-bold text-bone tracking-[-0.035em] leading-[1.05] text-balance">
            {t('home.cta.title', language)}
          </h2>

          <p className="mt-5 text-base tablet:text-lg text-bone/55 leading-relaxed text-pretty">
            {t('home.cta.text', language)}
          </p>

          <MagneticButton className="mt-9">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-ember text-ink text-sm tablet:text-base font-semibold hover:bg-ember-dim transition-colors duration-200"
            >
              {t('home.cta.button', language)}
              <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

export default function Home({ latestArticle }) {
  const rootRef = useRef(null);
  const { language } = useLanguage();
  const isEnglish = language === 'en-US';

  const cvFile = isEnglish ? '/Images/Curriculo EN-US.pdf' : '/Images/Curriculo PT-BR.pdf';

  useReveal(rootRef, [isEnglish]);

  const metaTitle = isEnglish
    ? 'Enzo Araujo Duarte | Software Developer, Shopify & Web'
    : 'Enzo Araujo Duarte | Desenvolvedor de Software, Shopify e Web';

  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Enzo Araujo Duarte',
      jobTitle: 'Software Developer',
      url: 'https://enzoaraujo.site',
      sameAs: [
        'https://github.com/EnzoAraujoDuarte',
        'https://linkedin.com/in/enzo-araujo-duarte',
      ],
      knowsAbout: [
        'Shopify',
        'Liquid',
        'GraphQL',
        'PHP',
        'Laravel',
        'JavaScript',
        'React',
        'Next.js',
        'SQL Server',
        'ABAP',
        'SAP ERP',
      ],
      worksFor: { '@type': 'Organization', name: '260 Sample Sale' },
      alumniOf: { '@type': 'EducationalOrganization', name: 'UNESC' },
    }),
    []
  );

  return (
    <Layout>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={stripAccent(t('home.meta.description', language))} />
        <meta name="author" content="Enzo Araujo Duarte" />
        <link rel="canonical" href="https://enzoaraujo.site" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={stripAccent(t('home.meta.description', language))} />
        <meta property="og:url" content="https://enzoaraujo.site" />
        <meta property="og:site_name" content="Enzo Araujo Duarte" />
        <meta property="og:locale" content={isEnglish ? 'en_US' : 'pt_BR'} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:image" content="https://enzoaraujo.site/Images/art/og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="https://enzoaraujo.site/Images/art/og.jpg" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={stripAccent(t('home.meta.description', language))} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <Hero language={language} cvFile={cvFile} />

      <div ref={rootRef} className="relative bg-ink">
        <NowSection language={language} />

        <PracticeSection isEnglish={isEnglish} />

        <ScrollRevealStatement
          eyebrow={t('home.statement.eyebrow', language)}
          text={t('home.statement', language)}
        />
        {latestArticle && (
          <LatestWriting article={latestArticle} language={language} isEnglish={isEnglish} />
        )}
        <ClosingCallToAction language={language} />
      </div>

      <EnzoIAChat />
    </Layout>
  );
}

export function getStaticProps({ locale }) {
  const [latestArticle = null] = getArticleSummaries(locale);
  return { props: { latestArticle } };
}
