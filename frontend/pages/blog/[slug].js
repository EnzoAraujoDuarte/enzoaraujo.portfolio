import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

import Layout from '../../components/layout/Layout';
import PageBackdrop from '../../components/layout/PageBackdrop';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../locales/translations';
import { getArticle, getArticleSlugs } from '../../lib/articles';
import { formatArticleDate } from '../../utils/dateUtils';

export default function Article({ article }) {
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
      <Head>
        <title>{`${article.title} | Enzo Araujo Duarte`}</title>
        <meta name="description" content={article.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta property="og:url" content={canonical} />
        <meta property="article:published_time" content={article.date} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.description} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className="relative min-h-screen">
        <PageBackdrop />

        <div className="relative z-10 container pt-28 tablet:pt-36 pb-24 tablet:pb-32">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 hover:text-primary transition-colors duration-200"
            >
              <FiArrowLeft className="w-3.5 h-3.5" />
              {t('blog.backToList', language)}
            </Link>

            <motion.header
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-10"
            >
              <div className="flex items-center gap-3 flex-wrap text-xs">
                <time
                  dateTime={article.date}
                  className="font-semibold uppercase tracking-[0.14em] text-primary tabular-nums"
                >
                  {formatArticleDate(article.date, isEnglish)}
                </time>
                <span className="text-gray-600">·</span>
                <span className="text-gray-500">
                  {article.readingMinutes} {t('blog.readingTime', language)}
                </span>
              </div>

              <h1 className="mt-5 font-display text-3xl tablet:text-4xl laptop:text-5xl font-bold text-white leading-[1.05] tracking-[-0.035em] text-balance">
                {article.title}
              </h1>

              <p className="mt-6 text-lg text-gray-400 leading-relaxed text-pretty">
                {article.description}
              </p>

              {article.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-dark-lighter text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-10 h-px bg-white/10" />
            </motion.header>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="prose-article mt-12"
              dangerouslySetInnerHTML={{ __html: article.html }}
            />

            <div className="mt-16 pt-10 border-t border-white/10 flex flex-wrap items-center justify-between gap-6">
              <p className="text-sm text-gray-500">
                {isEnglish ? 'Written by Enzo Araujo Duarte' : 'Escrito por Enzo Araujo Duarte'}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-white/15 text-gray-200 hover:border-primary hover:text-primary transition-colors duration-200"
              >
                {isEnglish ? 'Get in touch' : 'Falar comigo'}
              </Link>
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
