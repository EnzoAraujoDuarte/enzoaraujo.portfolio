import { useMemo } from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../locales/translations';
import Head from 'next/head';
import Image from 'next/image';
import { FiExternalLink, FiCode } from 'react-icons/fi';

export default function Projects() {
  const { language } = useLanguage();
  const isEnglish = language === 'en-US';

  const pageTitle = isEnglish
    ? 'Projects | Enzo Araujo Duarte'
    : 'Projetos | Enzo Araujo Duarte';

  const pageDescription = isEnglish
    ? 'Explore my projects and portfolio works.'
    : 'Explore meus projetos e trabalhos do portfólio.';

  const projects = useMemo(() => [
    {
      id: 1,
      title: isEnglish ? 'Project 1' : 'Projeto 1',
      status: isEnglish ? 'In Development' : 'Em Desenvolvimento',
      image: '/Images/placeholder-project.png',
    },
    {
      id: 2,
      title: isEnglish ? 'Project 2' : 'Projeto 2',
      status: isEnglish ? 'In Development' : 'Em Desenvolvimento',
      image: '/Images/placeholder-project.png',
    },
    {
      id: 3,
      title: isEnglish ? 'Project 3' : 'Projeto 3',
      status: isEnglish ? 'In Development' : 'Em Desenvolvimento',
      image: '/Images/placeholder-project.png',
    },
  ], [isEnglish]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href="https://enzoaraujo.site/projects" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content="https://enzoaraujo.site/projects" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Head>

      <div className="relative min-h-screen">
        {/* Background */}
        <div
          className="fixed inset-0 z-0 opacity-30 dark:opacity-20"
          style={{
            backgroundImage: 'url(/Images/griddistortion.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        />

        {/* Content */}
        <div className="relative z-10 container py-24 tablet:py-32">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 tablet:mb-16"
          >
            <h1 className="text-4xl tablet:text-5xl laptop:text-6xl font-bold text-gray-900 dark:text-white">
              {t('projects.title', language)}
            </h1>
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-6 laptop:gap-8"
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                className="group"
              >
                <div className="relative bg-white dark:bg-dark-secondary rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-dark-lighter">
                    {/* Placeholder with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />

                    {/* Placeholder Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <FiCode className="w-16 h-16 text-primary/40 mx-auto mb-3" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {isEnglish ? 'Coming Soon' : 'Em Breve'}
                        </span>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-300" />
                  </div>

                  {/* Card Content */}
                  <div className="p-5 tablet:p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>

                    {/* Status/Link */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {project.status}
                      </span>

                      <button
                        disabled
                        className="inline-flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      >
                        <span>{isEnglish ? 'View Project' : 'Ver Projeto'}</span>
                        <FiExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Border Accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-light to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Coming Soon Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-16 text-center"
          >
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {isEnglish
                ? 'More projects coming soon...'
                : 'Mais projetos em breve...'}
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
