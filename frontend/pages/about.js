import { useState, useRef, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../locales/translations';
import { FiCode, FiDatabase, FiShoppingBag, FiBook, FiTarget, FiUser, FiBriefcase, FiGlobe, FiCheck } from 'react-icons/fi';
import Image from 'next/image';
import Head from 'next/head';
import { formatPeriod } from '../utils/dateUtils';

import SkillCard from '../components/about/SkillCard';
import LanguageCard from '../components/about/LanguageCard';
import CourseItem from '../components/about/CourseItem';
import { TimelineItem, TimelineItemWithImage, CareerPosition } from '../components/about/TimelineItems';

import { getSkillsDetails, getLanguageSkills, getCoursesDetails, getTabs } from '../components/about/data';

export default function About() {
  const { language } = useLanguage();

  return (
    <Layout>
      <Head>
        <title>{t('about.title', language)} | Enzo Araujo Duarte</title>
        <meta name="description" content={t('about.intro.content', language).substring(0, 160) + '...'} />
      </Head>
      
      <div className="container py-16">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl tablet:text-4xl font-bold text-gray-900 dark:text-white">
            {t('about.title', language)}
          </h1>
        </div>

        <AboutContent language={language} />
      </div>
    </Layout>
  );
}

function AboutContent({ language }) {
  const isEnglish = language === 'en-US';
  const [activeTab, setActiveTab] = useState('intro');
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const imageRef = useRef(null);
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
    briefcase: <FiBriefcase />,
    shop: <FiShoppingBag />,
    target: <FiTarget />
  }), []);
  
  const tabs = useMemo(() => getTabs(isEnglish, icons), [isEnglish, icons]);
  const skillsDetails = useMemo(() => getSkillsDetails(isEnglish), [isEnglish]);
  const languageSkills = useMemo(() => getLanguageSkills(isEnglish), [isEnglish]);
  const coursesDetails = useMemo(() => getCoursesDetails(isEnglish), [isEnglish]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-none"
    >
      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto pb-4 mb-8 hide-scrollbar">
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
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <div className="flex flex-col tablet:flex-row tablet:items-start gap-6 tablet:gap-8">
              <div className="tablet:flex-grow">
                <h2 className="text-2xl font-bold text-primary mb-4">{t('about.intro.title', language)}</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('about.intro.content', language)}
                </p>
              </div>
              
              {/* Interactive image in intro section */}
              <div className="mx-auto tablet:mx-0 relative w-64 h-64 tablet:w-80 tablet:h-80 desktop:w-96 desktop:h-96 flex-shrink-0">
                <motion.div
                  ref={imageRef}
                  className="w-full h-full rounded-3xl shadow-2xl overflow-hidden bg-transparent relative"
                  style={{ 
                    rotateX: isHovered ? rotateX : 0,
                    rotateY: isHovered ? rotateY : 0,
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                    backgroundColor: 'transparent'
                  }}
                  animate={imageAnimation}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => {
                    setIsHovered(false);
                    mouseX.set(0);
                    mouseY.set(0);
                  }}
                  transition={springConfig}
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Gradient border effect with grain */}
                  <div 
                    className="absolute inset-0 rounded-3xl p-1.5 profile-gradient-border"
                    style={{
                      filter: 'blur(0.5px)',
                      zIndex: 0,
                    }}
                  >
                    <div 
                      className="w-full h-full rounded-3xl relative overflow-hidden"
                      style={{
                        backgroundColor: 'transparent',
                        position: 'relative',
                      }}
                    >
                      {/* Grain/noise overlay with better effect */}
                      <div 
                        className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                          backgroundSize: '150px 150px',
                          backgroundRepeat: 'repeat',
                          zIndex: 1,
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Image - Sharp and clear */}
                  <div 
                    className="absolute inset-0 rounded-3xl overflow-hidden"
                    style={{
                      padding: '6px',
                      zIndex: 2,
                    }}
                  >
                    <div className="relative w-full h-full" style={{ backgroundColor: 'transparent' }}>
                      <Image 
                        src="/Images/novafotoperfil.png"
                        alt="Profile Image"
                        fill
                        sizes="(max-width: 768px) 256px, 320px, 384px"
                        className="object-contain"
                        priority
                        style={{ 
                          backgroundColor: 'transparent',
                          imageRendering: 'crisp-edges',
                        }}
                        quality={100}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <motion.div variants={fadeIn} initial="hidden" animate="visible" className="relative">
            <h2 className="text-2xl font-bold text-primary mb-6">{t('about.skills.title', language)}</h2>
            
            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8">
              {Object.entries(skillsDetails).map(([skill, details]) => (
                <div key={skill}>
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <SkillCard
                      title={skill}
                      percentage={details.percentage}
                      onClick={() => setSelectedSkill(selectedSkill === skill ? null : skill)}
                      isActive={selectedSkill === skill}
                    />
                  </motion.div>
                  
                  <AnimatePresence>
                    {selectedSkill === skill && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-100 dark:bg-dark rounded-lg p-6 border-l-4 border-primary relative overflow-hidden"
                      >
                        <button 
                          onClick={() => setSelectedSkill(null)}
                          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-dark-lighter text-gray-500 hover:bg-gray-200 dark:hover:bg-dark-secondary"
                        >
                          ×
                        </button>
                        <div className="flex flex-col tablet:flex-row gap-4 items-start">
                          <div className="bg-white dark:bg-dark-secondary p-2 rounded-lg shadow-sm">
                            <Image
                              src={skillsDetails[selectedSkill].icon || "/Images/skill-default.png"}
                              alt={selectedSkill}
                              width={60}
                              height={60}
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{selectedSkill}</h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                              {skillsDetails[selectedSkill].description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {skillsDetails[selectedSkill].tools.map((tool) => (
                                <span 
                                  key={tool} 
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary bg-opacity-10 text-primary"
                                >
                                  <FiCheck className="mr-1" size={14} />
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <motion.div 
              className="mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center mb-6">
                <FiGlobe className="text-primary mr-2" size={24} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{isEnglish ? 'Languages' : 'Idiomas'}</h3>
              </div>
              
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
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
            <h2 className="text-2xl font-bold text-primary mb-6">{t('about.education.title', language)}</h2>
            <div className="space-y-4">
              <TimelineItemWithImage 
                period="2023-2026" 
                title={t('about.education.bachelor', language)}
                description={t('about.education.bachelor.details', language)}
                imageSrc="/Images/Unesc.png"
                alt="UNESC Logo"
              />
              <TimelineItemWithImage 
                period="2020-2022" 
                title={t('about.education.highschool', language)}
                description={t('about.education.highschool.details', language)}
                imageSrc="/Images/EEEFMHonorioFraga.webp"
                alt="EEEFM Honório Fraga Logo"
              />
            </div>
          </motion.div>
        )}

        {/* Career Tab */}
        {activeTab === 'career' && (
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <h2 className="text-2xl font-bold text-primary mb-6">{t('about.career.title', language)}</h2>
            
            <div className="mb-8 flex flex-col tablet:flex-row items-center tablet:items-start gap-6">
              <div className="w-32 h-32 relative flex-shrink-0 bg-gray-800 dark:bg-dark rounded-lg p-2 shadow-sm">
                <div className="relative w-full h-full">
                  <Image 
                    src="/Images/Logo_Unimarka.png"
                    alt="Unimarka Logo"
                    width={120}
                    height={120}
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('about.career.unimarka', language)}
                </h3>
                <div className="mt-4 space-y-6">
                  <CareerPosition 
                    title={t('about.career.position1', language)}
                    period={formatPeriod(2024, 12, isEnglish)}
                    description={t('about.career.position1.description', language)}
                  />
                  <CareerPosition 
                    title={t('about.career.position2', language)}
                    period={t('about.career.position2.period', language)}
                    description={t('about.career.position2.description', language)}
                  />
                  <CareerPosition 
                    title={t('about.career.position3', language)}
                    period={t('about.career.position3.period', language)}
                    description={t('about.career.position3.description', language)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Development Tab */}
        {activeTab === 'development' && (
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <h2 className="text-2xl font-bold text-primary mb-6">{t('about.development.title', language)}</h2>
            
            <div className="space-y-6">
              {Object.entries(coursesDetails).map(([course, details]) => (
                <div key={course}>
                  <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                    <CourseItem
                      title={course}
                      description={details.description}
                      progress={details.progress}
                      imageSrc={details.imageSrc}
                      onClick={details.expandable ? () => setSelectedCourse(course === selectedCourse ? null : course) : undefined}
                      isActive={selectedCourse === course}
                      expandable={details.expandable}
                    />
                  </motion.div>
                  
                  <AnimatePresence>
                    {selectedCourse === course && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-100 dark:bg-dark rounded-lg p-6 border-l-4 border-primary relative overflow-hidden"
                      >
                        <button 
                          onClick={() => setSelectedCourse(null)}
                          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-dark-lighter text-gray-500 hover:bg-gray-200 dark:hover:bg-dark-secondary"
                        >
                          ×
                        </button>
                        <div className="flex flex-col tablet:flex-row gap-4 items-start">
                          <div className="bg-white dark:bg-dark-secondary p-2 rounded-lg shadow-sm">
                            <Image
                              src={coursesDetails[selectedCourse].imageSrc}
                              alt={selectedCourse}
                              width={80}
                              height={80}
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{selectedCourse}</h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                              {coursesDetails[selectedCourse].description}
                            </p>
                            
                            <div className="mb-4">
                              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                {isEnglish ? "Key Topics" : "Tópicos Principais"}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {coursesDetails[selectedCourse].topics.map((topic) => (
                                  <span 
                                    key={topic} 
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary bg-opacity-10 text-primary"
                                  >
                                    <FiCheck className="mr-1" size={14} />
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            {coursesDetails[selectedCourse].experience && (
                              <div className="p-4 mb-4 bg-white dark:bg-dark-secondary rounded-lg">
                                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                  {isEnglish ? "My Experience" : "Minha Experiência"}
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                  {coursesDetails[selectedCourse].experience}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Objective Tab */}
        {activeTab === 'objective' && (
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <h2 className="text-2xl font-bold text-primary mb-4">{t('about.objective.title', language)}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('about.objective.content', language)}
            </p>
            <div className="mt-6 bg-gray-100 dark:bg-dark p-4 rounded-lg border-l-4 border-primary">
              <p className="italic text-gray-700 dark:text-gray-300">
                {isEnglish ? 
                  "Combining technical expertise with a passion for continuous learning to deliver high-quality solutions." : 
                  "Combinando expertise técnica com paixão pelo aprendizado contínuo para entregar soluções de alta qualidade."}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
} 