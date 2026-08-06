import { useState, useRef, useMemo, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../locales/translations';
import { FiCode, FiBook, FiUser, FiBriefcase, FiCheck } from 'react-icons/fi';
import Image from 'next/image';
import Head from 'next/head';
import { formatPeriod } from '../utils/dateUtils';

import PageBackdrop from '../components/layout/PageBackdrop';
import SkillCard from '../components/about/SkillCard';
import LanguageCard from '../components/about/LanguageCard';

import { getSkillsDetails, getLanguageSkills, getTabs } from '../components/about/data';

export default function About() {
  const { language } = useLanguage();
  const isEnglish = language === 'en-US';

  const pageTitle = isEnglish
    ? 'About | SAP ABAP Developer & AI Engineer - Enzo Araujo Duarte'
    : 'Sobre | Desenvolvedor SAP ABAP e Engenheiro de IA - Enzo Araujo Duarte';

  const pageDescription = isEnglish
    ? 'Systems Programmer specializing in SAP ABAP, Python automation, and AI development with LangChain. Experience with CDS Views, OData, SQL Server and Shopify.'
    : 'Programador de Sistemas especializado em SAP ABAP, automações Python e desenvolvimento de IA com LangChain. Experiência com CDS Views, OData, SQL Server e Shopify.';

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href="https://enzoaraujo.site/about" />

        {/* Open Graph */}
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content="https://enzoaraujo.site/about" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Head>

      <div className="relative min-h-screen">
        <PageBackdrop />
        <div className="relative z-10 container py-16">
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-display text-3xl tablet:text-4xl font-bold text-gray-900 dark:text-white tracking-[-0.025em]">
            {t('about.title', language)}
          </h1>
        </div>

        <AboutContent language={language} />
        </div>
      </div>
    </Layout>
  );
}

function AboutContent({ language }) {
  const isEnglish = language === 'en-US';
  const [activeTab, setActiveTab] = useState('intro');
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [scrollDirection, setScrollDirection] = useState('right');
  const imageRef = useRef(null);
  const tabsScrollRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10]);

  const handleMouseMove = (e) => {
    if (imageRef.current && isHovered) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const limitedX = Math.max(-100, Math.min(100, x));
      const limitedY = Math.max(-100, Math.min(100, y));
      
      mouseX.set(limitedX);
      mouseY.set(limitedY);
    }
  };

  const springConfig = { stiffness: 300, damping: 30 };
  const imageAnimation = isHovered 
    ? { scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }
    : { scale: 1, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" };

  // Use memoized data
  const icons = useMemo(() => ({
    user: <FiUser />,
    code: <FiCode />,
    book: <FiBook />,
    briefcase: <FiBriefcase />
  }), []);

  const tabs = useMemo(() => getTabs(isEnglish, icons), [isEnglish, icons]);
  const skillsDetails = useMemo(() => getSkillsDetails(isEnglish), [isEnglish]);
  const languageSkills = useMemo(() => getLanguageSkills(isEnglish), [isEnglish]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const handleScroll = () => {
    if (tabsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsScrollRef.current;
      const isAtStart = scrollLeft === 0;
      const isAtEnd = Math.abs(scrollWidth - clientWidth - scrollLeft) < 1;
      
      if (isAtEnd) {
        setScrollDirection('left');
      } else if (isAtStart) {
        setScrollDirection('right');
      }
    }
  };

  useEffect(() => {
    const scrollContainer = tabsScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      handleScroll();
      
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-none"
    >
      {/* Tabs Navigation */}
      {/* Mobile scroll hint */}
      <div className="tablet:hidden mb-3 flex items-center justify-center">
        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
          <span>{isEnglish ? 'Swipe to see more' : 'Role para o lado'}</span>
          <motion.span 
            animate={{ x: scrollDirection === 'right' ? [0, 5, 0] : [0, -5, 0] }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
            className="ml-1"
          >
            {scrollDirection === 'right' ? '→' : '←'}
          </motion.span>
        </div>
      </div>
      
      <div 
        ref={tabsScrollRef}
        className="flex overflow-x-auto pb-4 mb-8 hide-scrollbar"
        onScroll={handleScroll}
      >
        <div className="flex space-x-2 tablet:space-x-4 mx-auto">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`flex items-center px-4 py-3 rounded-full transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white dark:bg-dark-secondary text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-lighter border border-transparent'
              }`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">{tab.icon}</span>
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-dark-secondary rounded-xl p-6 tablet:p-8 shadow-sm">
        {/* Introduction Tab */}
        {activeTab === 'intro' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          >
            <div className="flex flex-col tablet:flex-row-reverse tablet:items-stretch gap-8 tablet:gap-10">

              {/* Image — top on mobile, right on desktop */}
              <motion.div
                variants={{ hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: 'easeOut' } } }}
                className="mx-auto tablet:mx-0 flex-shrink-0 w-64 tablet:w-72 desktop:w-80"
              >
                <motion.div
                  ref={imageRef}
                  className="w-full h-full min-h-[340px] tablet:min-h-0 rounded-3xl shadow-2xl overflow-hidden bg-transparent relative"
                  style={{
                    rotateX: isHovered ? rotateX : 0,
                    rotateY: isHovered ? rotateY : 0,
                    transformStyle: 'preserve-3d',
                    perspective: '1000px',
                    backgroundColor: 'transparent',
                  }}
                  animate={imageAnimation}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => { setIsHovered(false); mouseX.set(0); mouseY.set(0); }}
                  transition={springConfig}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute inset-0 rounded-3xl p-1.5 profile-gradient-border" style={{ filter: 'blur(0.5px)', zIndex: 0 }}>
                    <div className="w-full h-full rounded-3xl relative overflow-hidden" style={{ backgroundColor: 'transparent' }}>
                      <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, backgroundSize: '150px 150px', backgroundRepeat: 'repeat', zIndex: 1 }} />
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-3xl overflow-hidden" style={{ padding: '6px', zIndex: 2 }}>
                    <div className="relative w-full h-full" style={{ backgroundColor: 'transparent' }}>
                      <Image
                        src="/Images/profile.webp"
                        alt="Enzo Araujo Duarte"
                        fill
                        sizes="(max-width: 768px) 256px, (max-width: 1024px) 288px, 320px"
                        className="object-cover object-top"
                        priority
                        quality={85}
                      />
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Text content */}
              <div className="flex-grow flex flex-col gap-4">
                {/* Eyebrow */}
                <motion.p
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                  className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary"
                >
                  {t('about.intro.eyebrow', language)}
                </motion.p>

                {/* Title */}
                <motion.h2
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                  className="text-2xl tablet:text-3xl font-bold text-gray-900 dark:text-white leading-tight"
                >
                  {t('about.intro.title', language)}
                </motion.h2>

                {/* Gradient divider */}
                <motion.div
                  variants={{ hidden: { opacity: 0, scaleX: 0 }, visible: { opacity: 1, scaleX: 1, transition: { duration: 0.5 } } }}
                  style={{ transformOrigin: 'left', background: 'linear-gradient(90deg, rgb(147,51,234), transparent)', height: '1px' }}
                  className="w-3/4"
                />

                {/* Body paragraphs */}
                {t('about.intro.content', language).split('\n\n').map((paragraph, idx) => (
                  <motion.p
                    key={idx}
                    variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                    className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm tablet:text-base"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }} className="relative">

            {/* Section header */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
              className="mb-8"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-1.5">
                {t('about.skills.eyebrow', language)}
              </p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('about.skills.title', language)}</h2>
              <div className="mt-2 h-px w-3/4" style={{ background: 'linear-gradient(90deg, rgb(147,51,234), transparent)' }} />
            </motion.div>

            {/* Skills grid */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
              className="grid grid-cols-1 tablet:grid-cols-2 gap-3 mb-8"
            >
              {['Shopify', 'SAP ABAP', 'SQL Server', 'JavaScript', 'React', 'Python', 'HTML/CSS']
                .filter(s => skillsDetails[s])
                .map(skill => { const details = skillsDetails[skill]; return (
                <div key={skill}>
                  <SkillCard
                    title={skill}
                    percentage={details.percentage}
                    icon={details.icon}
                    onClick={() => setSelectedSkill(selectedSkill === skill ? null : skill)}
                    isActive={selectedSkill === skill}
                  />
                  <AnimatePresence>
                    {selectedSkill === skill && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative overflow-hidden rounded-xl bg-gray-50 dark:bg-dark border border-primary/20"
                      >
                        <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, rgb(147,51,234), transparent)' }} />
                        <div className="p-5">
                          <div className="flex flex-col tablet:flex-row gap-4 items-start">
                            <div className="bg-white dark:bg-dark-secondary p-2.5 rounded-xl shadow-sm border border-gray-100 dark:border-dark-lighter">
                              <Image
                                src={details.icon || '/Images/skill-default.png'}
                                alt={skill}
                                width={64}
                                height={64}
                                className="object-contain"
                                loading="eager"
                                quality={90}
                              />
                            </div>
                            <div className="flex-grow">
                              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">{skill}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                                {details.description}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {details.tools.map((tool) => (
                                  <span
                                    key={tool}
                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                                  >
                                    <FiCheck className="mr-1" size={11} />
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );})}
            </motion.div>

            {/* Languages section */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.3 } } }}
              className="mt-4 pt-8 border-t border-gray-100 dark:border-dark-lighter"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-1.5">
                {t('about.skills.languages.eyebrow', language)}
              </p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {isEnglish ? 'Languages' : 'Idiomas'}
              </h3>
              <div className="mb-5 h-px w-3/4" style={{ background: 'linear-gradient(90deg, rgb(147,51,234), transparent)' }} />
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
                {languageSkills.map((lang) => (
                  <LanguageCard
                    key={lang.name}
                    name={lang.name}
                    level={lang.level}
                    description={lang.description}
                    abilities={lang.abilities}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            {/* Header */}
            <div className="mb-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary mb-1.5">
                {isEnglish ? '— Academic Path' : '— Trajetória Acadêmica'}
              </p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('about.education.title', language)}
              </h2>
              <div className="mt-2 h-px w-3/4" style={{ background: 'linear-gradient(90deg, rgb(147,51,234), transparent)' }} />
            </div>

            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-5">
              {/* UNESC */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-gray-50 dark:bg-dark overflow-hidden"
              >
                {/* Logo area */}
                <div className="relative h-32 bg-white dark:bg-dark-secondary flex items-center justify-center px-6 border-b border-gray-100 dark:border-white/[0.04]">
                  <div className="relative w-36 h-16">
                    <Image
                      src="/Images/Unesc.png"
                      alt="UNESC Logo"
                      fill
                      className="object-contain"
                      loading="eager"
                      quality={90}
                    />
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      {isEnglish ? 'In Progress' : 'Em Andamento'}
                    </span>
                  </div>
                </div>
                {/* Content */}
                <div className="p-5 laptop:p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-2">
                    UNESC — 2023–2026
                  </p>
                  <h3 className="text-base laptop:text-lg font-bold text-gray-900 dark:text-white leading-snug mb-2">
                    {t('about.education.bachelor', language)}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {t('about.education.bachelor.details', language)}
                  </p>
                </div>
              </motion.div>

              {/* EEEFM */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-gray-50 dark:bg-dark overflow-hidden"
              >
                {/* Logo area */}
                <div className="relative h-32 bg-white dark:bg-dark-secondary flex items-center justify-center px-6 border-b border-gray-100 dark:border-white/[0.04]">
                  <div className="relative w-36 h-16">
                    <Image
                      src="/Images/EEEFMHonorioFraga.webp"
                      alt="EEEFM Honório Fraga Logo"
                      fill
                      className="object-contain"
                      loading="eager"
                      quality={90}
                    />
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <FiCheck size={9} />
                      {isEnglish ? 'Completed' : 'Concluído'}
                    </span>
                  </div>
                </div>
                {/* Content */}
                <div className="p-5 laptop:p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-2">
                    EEEFM — 2020–2022
                  </p>
                  <h3 className="text-base laptop:text-lg font-bold text-gray-900 dark:text-white leading-snug mb-2">
                    {t('about.education.highschool', language)}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {t('about.education.highschool.details', language)}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Career Tab */}
        {activeTab === 'career' && (
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            {/* Company header */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-white/[0.06]">
              <div className="w-14 h-14 laptop:w-16 laptop:h-16 relative flex-shrink-0 bg-gray-800 dark:bg-dark rounded-xl p-2 shadow-sm">
                <Image
                  src="/Images/Logo_Unimarka.png"
                  alt="Unimarka Logo"
                  width={60}
                  height={60}
                  style={{ objectFit: 'contain' }}
                  loading="eager"
                  quality={90}
                />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary mb-1">
                  {isEnglish ? '— Current Employer' : '— Empresa Atual'}
                </p>
                <h2 className="text-xl laptop:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  {t('about.career.unimarka', language)}
                </h2>
                <div className="mt-1.5 mb-1 h-px w-3/4" style={{ background: 'linear-gradient(90deg, rgb(147,51,234), transparent)' }} />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {isEnglish ? 'Feb 2023 – Present' : 'Fev 2023 – Atual'}
                </p>
              </div>
            </div>

            {/* Section label */}
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-6">
              {isEnglish ? 'Career Progression' : 'Progressão de Carreira'}
            </p>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical line — tablet+ */}
              <div className="absolute left-[1.125rem] top-5 bottom-5 w-px bg-gradient-to-b from-primary via-primary/40 to-primary/10 hidden tablet:block" />

              <div className="space-y-4">
                {/* Position 1 — Current */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="relative tablet:pl-12"
                >
                  <div className="hidden tablet:flex absolute left-0 top-5 w-9 h-9 rounded-full bg-primary shadow-lg shadow-primary/30 items-center justify-center z-10">
                    <span className="text-[9px] font-black text-white">01</span>
                  </div>
                  <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-gray-50 dark:bg-dark p-5 laptop:p-6">
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {isEnglish ? 'Current role' : 'Cargo atual'}
                      </span>
                      <span className="tablet:hidden inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-[9px] font-black text-white">01</span>
                    </div>
                    <h3 className="text-base laptop:text-lg font-bold text-gray-900 dark:text-white mb-1 leading-snug">
                      {t('about.career.position1', language)}
                    </h3>
                    <p className="text-xs font-semibold text-primary mb-3">
                      {formatPeriod(2024, 12, isEnglish)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {t('about.career.position1.description', language)}
                    </p>
                  </div>
                </motion.div>

                {/* Promotion divider */}
                <div className="tablet:pl-12 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary whitespace-nowrap">
                    <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[11px] leading-none">↑</div>
                    <span>{isEnglish ? 'Promoted' : 'Promoção'}</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-white/[0.05]" />
                </div>

                {/* Position 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="relative tablet:pl-12"
                >
                  <div className="hidden tablet:flex absolute left-0 top-5 w-9 h-9 rounded-full bg-primary/20 border border-primary/30 items-center justify-center z-10">
                    <span className="text-[9px] font-black text-primary">02</span>
                  </div>
                  <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-gray-50 dark:bg-dark p-5 laptop:p-6">
                    <span className="tablet:hidden inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 border border-primary/30 text-[9px] font-black text-primary mb-3 block">02</span>
                    <h3 className="text-base laptop:text-lg font-bold text-gray-900 dark:text-white mb-1 leading-snug">
                      {t('about.career.position2', language)}
                    </h3>
                    <p className="text-xs font-semibold text-primary mb-3">
                      {t('about.career.position2.period', language)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {t('about.career.position2.description', language)}
                    </p>
                  </div>
                </motion.div>

                {/* Promotion divider */}
                <div className="tablet:pl-12 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary whitespace-nowrap">
                    <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[11px] leading-none">↑</div>
                    <span>{isEnglish ? 'Promoted' : 'Promoção'}</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-white/[0.05]" />
                </div>

                {/* Position 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="relative tablet:pl-12"
                >
                  <div className="hidden tablet:flex absolute left-0 top-5 w-9 h-9 rounded-full bg-primary/10 border border-primary/20 items-center justify-center z-10">
                    <span className="text-[9px] font-black text-primary/60">03</span>
                  </div>
                  <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-gray-50 dark:bg-dark p-5 laptop:p-6">
                    <span className="tablet:hidden inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-[9px] font-black text-primary/60 mb-3 block">03</span>
                    <h3 className="text-base laptop:text-lg font-bold text-gray-900 dark:text-white mb-1 leading-snug">
                      {t('about.career.position3', language)}
                    </h3>
                    <p className="text-xs font-semibold text-primary mb-3">
                      {t('about.career.position3.period', language)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {t('about.career.position3.description', language)}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
} 
