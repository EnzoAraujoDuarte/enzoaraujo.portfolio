import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../locales/translations';
import { FiArrowLeft } from 'react-icons/fi';

export default function Custom404() {
  const { language } = useLanguage();

  return (
    <Layout>
      <div className="container min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-xl"
        >
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {t('404.title', language)}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8">
            {t('404.description', language)}
          </p>
          <Link href="/" className="btn btn-primary inline-flex items-center">
            <FiArrowLeft className="mr-2" /> {t('404.back', language)}
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
} 