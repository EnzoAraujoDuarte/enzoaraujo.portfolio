import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';

import Layout from '../../components/layout/Layout';
import PageBackdrop from '../../components/layout/PageBackdrop';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../locales/translations';
import { getArticleSummaries } from '../../lib/articles';
import { formatArticleDate } from '../../utils/dateUtils';

export default function Blog({ articles }) {
  const { language } = useLanguage();
  const isEnglish = language === 'en-US';

  const pageTitle = isEnglish
    ? 'Writing | Enzo Araujo Duarte'
    : 'Escrita | Enzo Araujo Duarte';

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={t('blog.meta.description', language)} />
        <link rel="canonical" href="https://enzoaraujo.site/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={t('blog.meta.description', language)} />
        <meta property="og:url" content="https://enzoaraujo.site/blog" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={t('blog.meta.description', language)} />
      </Head>

      <div className="relative min-h-screen">
        <PageBackdrop />

        <div className="relative z-10 container pt-28 tablet:pt-36 pb-24 tablet:pb-32">
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-3xl"
          >
            <p className="font-display text-xs font-medium uppercase tracking-[0.28em] text-primary mb-6">
              {isEnglish ? 'Notes' : 'Notas'}
            </p>
            <h1 className="font-display text-4xl tablet:text-5xl laptop:text-6xl font-bold text-white leading-[0.98] tracking-[-0.04em] text-balance">
              {t('blog.title', language)}
            </h1>
            <p className="mt-7 text-base tablet:text-lg text-gray-400 leading-relaxed text-pretty">
              {t('blog.lead', language)}
            </p>
          </motion.header>

          <div className="mt-16 tablet:mt-20 h-px bg-white/10" />

          {articles.length === 0 ? (
            <p className="mt-16 text-gray-500">{t('blog.empty', language)}</p>
          ) : (
            <ul className="mt-4">
              {articles.map((article, index) => (
                <motion.li
                  key={article.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <Link
                    href={`/blog/${article.slug}`}
                    className="group grid grid-cols-1 laptop:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-3 laptop:gap-10 py-10 border-b border-white/[0.07] hover:border-primary/30 transition-colors duration-500"
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
                      <h2 className="font-display text-xl tablet:text-2xl laptop:text-3xl font-bold text-white leading-tight tracking-[-0.03em] group-hover:text-primary transition-colors duration-300 text-balance">
                        {article.title}
                      </h2>

                      <p className="mt-3 max-w-2xl text-sm tablet:text-base text-gray-400 leading-relaxed text-pretty">
                        {article.description}
                      </p>

                      <div className="mt-5 flex items-center gap-4 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                          {isEnglish ? 'Read' : 'Ler'}
                          <FiArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>

                        <div className="flex flex-wrap gap-1.5">
                          {article.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded text-[11px] font-medium bg-dark-lighter text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}

export function getStaticProps({ locale }) {
  return { props: { articles: getArticleSummaries(locale) } };
}
