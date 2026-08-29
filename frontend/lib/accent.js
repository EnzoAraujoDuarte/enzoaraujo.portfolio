import { Fragment } from 'react';

const MARKER = /\*([^*]+)\*/g;

/**
 * The signature move: one italic serif word inside a grotesk line.
 *
 * Copy carries the mark, so translators decide which word gets the accent in
 * their own language instead of the layout guessing at a word index.
 *
 *   'focado em *e-commerce* e sistemas'  →  focado em <em>e-commerce</em> e sistemas
 */
export function withAccent(text) {
  if (!text || !text.includes('*')) return text;

  const parts = [];
  let cursor = 0;

  for (const match of text.matchAll(MARKER)) {
    if (match.index > cursor) parts.push(text.slice(cursor, match.index));
    parts.push(
      <em key={match.index} className="accent">
        {match[1]}
      </em>
    );
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) parts.push(text.slice(cursor));

  return parts.map((part, index) => <Fragment key={index}>{part}</Fragment>);
}

/** Same markers, but for places that need the plain string (meta tags, alt). */
export function stripAccent(text) {
  return typeof text === 'string' ? text.replace(MARKER, '$1') : text;
}
