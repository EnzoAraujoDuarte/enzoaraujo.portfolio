import { getArticleSummaries } from '../lib/articles';

const SITE_URL = 'https://enzoaraujo.site';
const DEFAULT_LOCALE = 'pt-BR';

function localeUrl(path, locale) {
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return `${SITE_URL}${prefix}${path}`;
}

function urlEntry(path, locales, lastmod, priority) {
  const alternates = locales
    .map(
      (locale) =>
        `    <xhtml:link rel="alternate" hreflang="${locale}" href="${localeUrl(path, locale)}"/>`
    )
    .join('\n');

  return `  <url>
    <loc>${localeUrl(path, DEFAULT_LOCALE)}</loc>
${alternates}
    <lastmod>${lastmod}</lastmod>
    <priority>${priority}</priority>
  </url>`;
}

export function getServerSideProps({ res, locales }) {
  const today = new Date().toISOString().slice(0, 10);

  const pages = [
    urlEntry('/', locales, today, '1.0'),
    urlEntry('/about', locales, today, '0.9'),
    urlEntry('/blog', locales, today, '0.8'),
    urlEntry('/contact', locales, today, '0.6'),
    ...getArticleSummaries(DEFAULT_LOCALE).map((article) =>
      urlEntry(`/blog/${article.slug}`, locales, article.date, '0.7')
    ),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate');
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
