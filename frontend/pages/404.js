import Link from 'next/link';
import Layout from '../components/layout/Layout';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../locales/translations';
import { FiArrowLeft } from 'react-icons/fi';

export default function Custom404() {
  const { language } = useLanguage();

  return (
    <Layout>
      <div className="container min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-16">
        <div data-reveal
          className="text-center max-w-xl">
          <h1 className="text-9xl font-bold text-ember mb-4">404</h1>
          <h2 className="text-2xl tablet:text-3xl font-bold text-bone mb-6">
            {t('404.title', language)}
          </h2>
          <p className="text-bone/70 mb-8">
            {t('404.description', language)}
          </p>
          <Link href="/" className="btn btn-ember inline-flex items-center">
            <FiArrowLeft className="mr-2" /> {t('404.back', language)}
          </Link>
        </div>
      </div>
    </Layout>
  );
} 