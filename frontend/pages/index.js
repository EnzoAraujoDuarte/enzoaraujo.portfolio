import { useMemo } from 'react';
import Layout from '../components/layout/Layout';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { FiArrowRight, FiDownload } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../locales/translations';
import Head from 'next/head';
import EnzoIAChat from '../components/chat/EnzoIAChat';

// Lazy load effects to optimize bundle size
const GridDistortion = dynamic(
  () => import('../components/effects/GridDistortion'),
  { ssr: false }
);

const DecryptedText = dynamic(
  () => import('../components/effects/DecryptedText'),
  { ssr: false }
);

/**
 * Homepage component with modern hero section
 * Features: Grid distortion background, decrypted text animation, centered layout
 * @returns {JSX.Element} Homepage with hero section
 */
export default function Home() {
  const { language } = useLanguage();

  // Determine which CV file to download based on current language
  const cvFile = useMemo(() => {
    return language === 'en-US'
      ? '/Images/Curriculo EN-US.pdf'
      : '/Images/Curriculo PT-BR.pdf';
  }, [language]);

  // Get translated content
  const content = useMemo(() => ({
    greeting: t('home.greeting', language),
    name: t('home.title', language),
    subtitle: t('home.subtitle', language),
    ctaAbout: t('home.cta.about', language),
    ctaCv: t('home.cta.cv', language),
    metaTitle: language === 'pt-BR'
      ? 'Enzo Araujo Duarte | Desenvolvedor ABAP, Shopify e IA com Python'
      : 'Enzo Araujo Duarte | ABAP Developer, Shopify & Python',
    metaDescription: t('home.meta.description', language),
  }), [language]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Enzo Araujo Duarte",
    "jobTitle": language === 'pt-BR' ? "Programador de Sistemas" : "Systems Programmer",
    "url": "https://enzoaraujo.site",
    "sameAs": [
      "https://github.com/EnzoAraujoDuarte",
      "https://linkedin.com/in/enzo-araujo-duarte"
    ],
    "knowsAbout": [
      "ABAP",
      "SAP ERP",
      "Python",
      "LangChain",
      "LangGraph",
      "SQL Server",
      "Shopify",
      "React",
      "Next.js",
      "CDS Views",
      "OData"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Unimarka Distribuidora"
    },
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "UNESC"
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <Layout isHomePage={true}>
      <Head>
        <title>{content.metaTitle}</title>
        <meta name="description" content={content.metaDescription} />
        <meta name="author" content="Enzo Araujo Duarte" />
        <meta name="keywords" content="Desenvolvedor ABAP, SAP Developer, Shopify Developer, IA com Python, LangChain, LangGraph, Engenheiro de IA, CDS Views, OData" />
        <link rel="canonical" href="https://enzoaraujo.site" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={content.metaTitle} />
        <meta property="og:description" content={content.metaDescription} />
        <meta property="og:url" content="https://enzoaraujo.site" />
        <meta property="og:site_name" content="Enzo Araujo Duarte" />
        <meta property="og:locale" content={language === 'pt-BR' ? 'pt_BR' : 'en_US'} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.metaTitle} />
        <meta name="twitter:description" content={content.metaDescription} />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      {/* Hero Section - Full viewport with centered content */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black dark:bg-black pt-0 pb-20 sm:pb-0">
        {/* Grid Distortion Background */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <GridDistortion
            imageSrc="/Images/griddistortion.png"
            grid={10}
            mouse={0.15}
            strength={0.2}
            relaxation={0.9}
          />
        </div>

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-20 container px-6 ultrawide:px-8 4k:px-12 text-center max-w-4xl ultrawide:max-w-6xl 4k:max-w-[90rem] mx-auto pt-0 sm:pt-20 desktop:pt-32 ultrawide:pt-24 4k:pt-28"
        >
          {/* Greeting */}
          <motion.div variants={itemVariants} className="mb-3 4k:mb-4">
            <span className="text-base tablet:text-lg laptop:text-xl desktop:text-2xl ultrawide:text-4xl 4k:text-5xl text-gray-400 font-normal tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {content.greeting}
            </span>
          </motion.div>

          {/* Name with Decrypted Text effect */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl tablet:text-5xl laptop:text-6xl desktop:text-7xl ultrawide:text-9xl 4k:text-[12rem] font-bold text-primary mb-4 4k:mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <DecryptedText
              text={content.name}
              speed={20}
              delay={200}
              id="hero-name"
              className="text-primary"
            />
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base tablet:text-lg laptop:text-xl desktop:text-2xl ultrawide:text-4xl 4k:text-5xl text-gray-300 leading-relaxed max-w-3xl ultrawide:max-w-5xl 4k:max-w-7xl mx-auto mb-8 4k:mb-12 font-normal"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {content.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 ultrawide:gap-6 4k:gap-8"
          >
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                href="/about"
                className="inline-flex items-center px-8 py-4 ultrawide:px-10 ultrawide:py-5 4k:px-14 4k:py-7 bg-primary hover:bg-primary-dark text-white text-base ultrawide:text-lg 4k:text-2xl font-semibold rounded-2xl 4k:rounded-3xl transition-colors duration-200 shadow-lg shadow-primary/25"
              >
                {content.ctaAbout}
                <FiArrowRight className="ml-2 w-5 h-5 ultrawide:w-6 ultrawide:h-6 4k:w-8 4k:h-8" />
              </Link>
            </motion.div>

            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <a
                href={cvFile}
                className="inline-flex items-center px-8 py-4 ultrawide:px-10 ultrawide:py-5 4k:px-14 4k:py-7 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-base ultrawide:text-lg 4k:text-2xl font-semibold rounded-2xl 4k:rounded-3xl border border-white/20 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <FiDownload className="mr-2 w-5 h-5 ultrawide:w-6 ultrawide:h-6 4k:w-8 4k:h-8" />
                {content.ctaCv}
              </a>
            </motion.div>
          </motion.div>

        </motion.div>
      </section>
      
      <EnzoIAChat />
    </Layout>
  );
}
