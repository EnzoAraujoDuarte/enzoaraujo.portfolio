import { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

import Layout from '../../components/layout/Layout';
import { useReveal } from '../../hooks/useReveal';
import PageBackdrop from '../../components/layout/PageBackdrop';
import ReadingProgress from '../../components/blog/ReadingProgress';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../locales/translations';
import { getArticle, getArticleSlugs } from '../../lib/articles';
import { formatArticleDate } from '../../utils/dateUtils';

export default function Article({ article }) {
  const rootRef = useRef(null);
  useReveal(rootRef);
  const { language } = useLanguage();
  const isEnglish = language === 'en-US';

  const canonical = `https://enzoaraujo.site/blog/${article.slug}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    inLanguage: language,
    author: { '@type': 'Person', name: 'Enzo Araujo Duarte', url: 'https://enzoaraujo.site' },
    mainEntityOfPage: canonical,
  };

  return (
    <Layout>
      <div ref={rootRef}>
      <Head>
        <title>{`${article.title} | Enzo Araujo Duarte`}</title>
        <meta name="description" content={article.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content="https://enzoaraujo.site/Images/art/og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="https://enzoaraujo.site/Images/art/og.jpg" />
        <meta property="article:published_time" content={article.date} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.description} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <ReadingProgress />

      <div className="relative min-h-screen">
        <PageBackdrop />

        <div className="relative z-10 container pt-28 tablet:pt-36 pb-24 tablet:pb-32">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ash hover:text-ember transition-colors duration-200"
            >
              <FiArrowLeft className="w-3.5 h-3.5" />
              {t('blog.backToList', language)}
            </Link>

            <header data-reveal
              className="mt-10">
              <div className="flex items-center gap-3 flex-wrap text-xs">
                <time
                  dateTime={article.date}
                  className="font-semibold uppercase tracking-[0.14em] text-ember tabular-nums"
                >
                  {formatArticleDate(article.date, isEnglish)}
                </time>
                <span className="text-ash/70">·</span>
                <span className="text-ash">
                  {article.readingMinutes} {t('blog.readingTime', language)}
                </span>
              </div>

              <h1 className="mt-5 font-display text-3xl tablet:text-4xl laptop:text-5xl font-bold text-bone leading-[1.05] tracking-[-0.035em] text-balance">
                {article.title}
              </h1>

              <p className="mt-6 text-lg text-bone/55 leading-relaxed text-pretty">
                {article.description}
              </p>

              {article.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-graphite text-bone/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-10 h-px bg-bone/10" />
            </header>

            <div data-reveal
              className="prose-article mt-12"
              dangerouslySetInnerHTML={{ __html: article.html }}
            />

            <div className="mt-16 pt-10 border-t border-bone/10 flex flex-wrap items-center justify-between gap-6">
              <p className="text-sm text-ash">
                {isEnglish ? 'Written by Enzo Araujo Duarte' : 'Escrito por Enzo Araujo Duarte'}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-bone/15 text-bone/80 hover:border-ember hover:text-ember transition-colors duration-200"
              >
                {isEnglish ? 'Get in touch' : 'Falar comigo'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}

export function getStaticPaths({ locales }) {
  const slugs = getArticleSlugs();

  return {
    paths: locales.flatMap((locale) => slugs.map((slug) => ({ params: { slug }, locale }))),
    fallback: false,
  };
}

export function getStaticProps({ params, locale }) {
  const article = getArticle(params.slug, locale);
  if (!article) return { notFound: true };

  return { props: { article } };
}
