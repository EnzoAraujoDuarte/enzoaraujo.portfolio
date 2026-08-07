import { useRouter } from 'next/router';

export const LANGUAGES = {
  ENGLISH: 'en-US',
  PORTUGUESE: 'pt-BR',
};

/**
 * Language is owned by Next's i18n routing, so the server renders the same
 * locale the visitor sees and every page stays crawlable per locale.
 */
export function useLanguage() {
  const router = useRouter();
  const language = router.locale ?? router.defaultLocale ?? LANGUAGES.PORTUGUESE;

  const toggleLanguage = () => {
    const nextLanguage =
      language === LANGUAGES.PORTUGUESE ? LANGUAGES.ENGLISH : LANGUAGES.PORTUGUESE;
    const { pathname, query, asPath } = router;

    router.push({ pathname, query }, asPath, { locale: nextLanguage, scroll: false });
  };

  return { language, toggleLanguage };
}
