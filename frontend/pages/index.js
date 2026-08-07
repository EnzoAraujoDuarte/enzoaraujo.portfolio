import { useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowUpRight, FiDownload } from 'react-icons/fi';

import Layout from '../components/layout/Layout';
import RevealLine from '../components/home/RevealLine';
import ScrollRevealStatement from '../components/home/ScrollRevealStatement';
import MagneticButton from '../components/ui/MagneticButton';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../locales/translations';
import { getArticleSummaries } from '../lib/articles';
import { formatArticleDate } from '../utils/dateUtils';
import { EASE, DURATION, viewportOnce } from '../lib/motion';
import { useParallax } from '../hooks/useParallax';

// Lazy load effects and the chat widget to keep the hero bundle small
const GridDistortion = dynamic(
  () => import('../components/effects/GridDistortion'),
  { ssr: false }
);

const EnzoIAChat = dynamic(
  () => import('../components/chat/EnzoIAChat'),
  { ssr: false }
);

const stagger = { visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE.expressive } },
};

function Hero({ language, cvFile }) {
  const { ref: heroRef, y: contentY } = useParallax(-70, ['start start', 'end start']);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100svh] w-full flex items-center overflow-hidden bg-black"
    >
      <div className="absolute inset-0 z-0">
        <GridDistortion
          imageSrc="/Images/griddistortion.webp"
          grid={10}
          mouse={0.15}
          strength={0.2}
          relaxation={0.9}
        />
      </div>

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-transparent to-dark pointer-events-none" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        style={{ y: contentY }}
        className="relative z-20 container py-32 tablet:py-40"
      >
        <RevealLine className="font-display text-xs tablet:text-sm font-medium uppercase tracking-[0.3em] text-primary mb-6 tablet:mb-8">
          {t('home.greeting', language)}
        </RevealLine>

        <RevealLine
          as="h1"
          className="font-display text-[clamp(2.5rem,9vw,7.5rem)] ultrawide:text-[8.5rem] font-bold text-white leading-[0.92] tracking-[-0.045em]"
        >
          {t('home.title', language)}
        </RevealLine>

        <motion.p
          variants={fadeUp}
          className="mt-8 tablet:mt-10 max-w-xl laptop:max-w-2xl text-base tablet:text-lg laptop:text-xl text-gray-300/85 leading-relaxed text-pretty"
        >
          {t('home.subtitle', language)}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 tablet:mt-12 flex flex-col largemobile:flex-row largemobile:items-center gap-4"
        >
          <MagneticButton>
            <Link
              href="/about"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-primary text-white text-sm tablet:text-base font-semibold hover:bg-primary-dark transition-colors duration-200"
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
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/[0.06] backdrop-blur-sm border border-white/15 text-white text-sm tablet:text-base font-semibold hover:bg-white/[0.12] transition-colors duration-200"
          >
            <FiDownload className="w-4 h-4" />
            {t('home.cta.cv', language)}
          </a>
        </motion.div>
      </motion.div>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden tablet:flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40"
      >
        {t('home.scroll', language)}
        <span className="block w-10 h-px bg-white/25" />
      </motion.span>
    </section>
  );
}

function NowSection({ language }) {
  const focusAreas = [1, 2, 3].map((index) => ({
    index,
    title: t(`home.now.focus${index}.title`, language),
    text: t(`home.now.focus${index}.text`, language),
  }));

  return (
    <section className="container py-24 tablet:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: DURATION.base, ease: EASE.out }}
      >
        <div className="flex items-center gap-4 mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400 whitespace-nowrap">
            {t('home.now.eyebrow', language)}
          </p>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <h2 className="font-display text-3xl tablet:text-4xl laptop:text-5xl font-bold text-white tracking-[-0.03em] leading-[1.05] text-balance">
          {t('home.now.title', language)}
        </h2>

        <p className="mt-5 inline-flex items-center gap-2 text-sm text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {t('about.currentRole', language)}
        </p>
      </motion.div>

      <div className="mt-14 grid grid-cols-1 tablet:grid-cols-3 gap-x-10 gap-y-10 laptop:gap-x-14">
        {focusAreas.map((area, index) => (
          <motion.div
            key={area.index}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.base, delay: index * 0.08, ease: EASE.out }}
            className="border-t border-white/10 pt-6"
          >
            <span className="font-display text-xs font-bold text-primary tabular-nums">
              0{area.index}
            </span>
            <h3 className="mt-3 font-display text-lg laptop:text-xl font-bold text-white leading-snug tracking-[-0.02em]">
              {area.title}
            </h3>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed text-pretty">{area.text}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: DURATION.base, delay: 0.2 }}
        className="mt-12"
      >
        <Link
          href="/about"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          {t('home.now.cta', language)}
          <FiArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </motion.div>
    </section>
  );
}

function LatestWriting({ article, language, isEnglish }) {
  return (
    <section className="container pb-24 tablet:pb-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: DURATION.base, ease: EASE.out }}
      >
        <div className="flex items-center gap-4 mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400 whitespace-nowrap">
            {t('home.writing.eyebrow', language)}
          </p>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <Link
          href={`/blog/${article.slug}`}
          className="group grid grid-cols-1 laptop:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-4 laptop:gap-10"
        >
          <div className="flex laptop:flex-col items-baseline laptop:items-start gap-3 laptop:gap-2">
            <time
              dateTime={article.date}
              className="text-xs font-semibold uppercase tracking-[0.14em] text-primary tabular-nums"
            >
              {formatArticleDate(article.date, isEnglish)}
            </time>
            <span className="text-xs text-gray-600">
              {article.readingMinutes} {t('blog.readingTime', language)}
            </span>
          </div>

          <div>
            <h2 className="font-display text-2xl tablet:text-3xl laptop:text-4xl font-bold text-white leading-[1.1] tracking-[-0.03em] group-hover:text-primary transition-colors duration-300 text-balance">
              {article.title}
            </h2>

            <p className="mt-4 max-w-2xl text-sm tablet:text-base text-gray-400 leading-relaxed text-pretty">
              {article.description}
            </p>

            <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
              {isEnglish ? 'Read' : 'Ler'}
              <FiArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </Link>

        <div className="mt-10 pt-8 border-t border-white/[0.07]">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-primary transition-colors duration-200"
          >
            {t('home.writing.all', language)}
            <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

function ClosingCallToAction({ language }) {
  return (
    <section className="container pb-28 tablet:pb-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: DURATION.base, ease: EASE.out }}
        className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-dark-secondary px-8 py-14 tablet:px-14 tablet:py-20"
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl">
          <h2 className="font-display text-3xl tablet:text-4xl laptop:text-5xl font-bold text-white tracking-[-0.035em] leading-[1.05] text-balance">
            {t('home.cta.title', language)}
          </h2>

          <p className="mt-5 text-base tablet:text-lg text-gray-400 leading-relaxed text-pretty">
            {t('home.cta.text', language)}
          </p>

          <MagneticButton className="mt-9">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-primary text-white text-sm tablet:text-base font-semibold hover:bg-primary-dark transition-colors duration-200"
            >
              {t('home.cta.button', language)}
              <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </MagneticButton>
        </div>
      </motion.div>
    </section>
  );
}

export default function Home({ latestArticle }) {
  const { language } = useLanguage();
  const isEnglish = language === 'en-US';

  const cvFile = isEnglish ? '/Images/Curriculo EN-US.pdf' : '/Images/Curriculo PT-BR.pdf';

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
        <meta name="description" content={t('home.meta.description', language)} />
        <meta name="author" content="Enzo Araujo Duarte" />
        <link rel="canonical" href="https://enzoaraujo.site" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={t('home.meta.description', language)} />
        <meta property="og:url" content="https://enzoaraujo.site" />
        <meta property="og:site_name" content="Enzo Araujo Duarte" />
        <meta property="og:locale" content={isEnglish ? 'en_US' : 'pt_BR'} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={t('home.meta.description', language)} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <Hero language={language} cvFile={cvFile} />

      <div className="relative bg-dark">
        <NowSection language={language} />

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
