import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Marked } from 'marked';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');
const WORDS_READ_PER_MINUTE = 200;

const markdown = new Marked({ gfm: true });

function articlePath(slug, locale) {
  return path.join(ARTICLES_DIR, `${slug}.${locale}.md`);
}

function readArticleFile(slug, locale) {
  const file = articlePath(slug, locale);
  if (!fs.existsSync(file)) return null;

  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  const wordCount = content.trim().split(/\s+/).length;

  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? '',
    date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? ''),
    tags: data.tags ?? [],
    readingMinutes: Math.max(1, Math.round(wordCount / WORDS_READ_PER_MINUTE)),
    content,
  };
}

export function getArticleSlugs() {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const slugs = fs
    .readdirSync(ARTICLES_DIR)
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.[^.]+\.md$/, ''));

  return [...new Set(slugs)];
}

/** Listing entries for a locale, newest first. Content is stripped — the list never renders it. */
export function getArticleSummaries(locale) {
  return getArticleSlugs()
    .map((slug) => readArticleFile(slug, locale))
    .filter(Boolean)
    .map(({ content, ...summary }) => summary)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticle(slug, locale) {
  const article = readArticleFile(slug, locale);
  if (!article) return null;

  const { content, ...meta } = article;
  return { ...meta, html: markdown.parse(content) };
}
