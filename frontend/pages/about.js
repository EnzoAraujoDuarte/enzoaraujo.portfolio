import { useMemo } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowUpRight, FiCheck } from 'react-icons/fi';

import Layout from '../components/layout/Layout';
import PageBackdrop from '../components/layout/PageBackdrop';
import SectionHeading from '../components/about/SectionHeading';
import CareerTimeline from '../components/about/CareerTimeline';
import SkillDomainCard from '../components/about/SkillDomainCard';
import ProjectCard from '../components/about/ProjectCard';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../locales/translations';
import { getCareer, getSkillDomains, getEducation, getLanguages } from '../components/about/data';
import { getProjects } from '../components/about/projects';
import { EASE, DURATION, viewportOnce } from '../lib/motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE.out } },
};

function AboutHero({ language, isEnglish }) {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
      className="grid grid-cols-1 tablet:grid-cols-[minmax(0,1fr)_auto] tablet:items-end gap-10 tablet:gap-14"
    >
      <div>
        <motion.p
          variants={fadeUp}
          className="font-display text-xs font-medium uppercase tracking-[0.28em] text-primary mb-6"
        >
          {t('about.eyebrow', language)}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="font-display text-4xl tablet:text-5xl laptop:text-6xl desktop:text-7xl font-bold text-white leading-[0.98] tracking-[-0.04em] text-balance"
        >
          {t('about.headline', language)}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-7 max-w-xl text-base tablet:text-lg text-gray-400 leading-relaxed text-pretty"
        >
          {t('about.lead', language)}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {t('about.currentRole', language)}
          </span>
          <span className="text-xs text-gray-600">
            {isEnglish ? 'New York · Remote' : 'Nova York · Remoto'}
          </span>
        </motion.div>
      </div>

      <motion.div
        variants={fadeUp}
        className="relative w-44 tablet:w-52 laptop:w-60 aspect-square mx-auto tablet:mx-0 rounded-3xl overflow-hidden border border-white/[0.08] flex-shrink-0"
      >
        <Image
          src="/Images/enzo-profile.webp"
          alt="Enzo Araujo Duarte"
          fill
          sizes="(max-width: 768px) 176px, (max-width: 1024px) 208px, 240px"
          className="object-cover object-center"
          priority
          quality={85}
        />
      </motion.div>
    </motion.section>
  );
}

function ApproachSection({ language, isEnglish }) {
  const paragraphs = t('about.approach.content', language).split('\n\n');

  return (
    <section>
      <SectionHeading
        index="01"
        label={isEnglish ? 'Approach' : 'Abordagem'}
        title={t('about.approach.title', language)}
      />

      <div className="grid grid-cols-1 laptop:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 laptop:gap-14">
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.base, ease: EASE.out }}
          className="relative pl-6 border-l-2 border-primary"
        >
          <p className="font-display text-xl tablet:text-2xl laptop:text-[1.75rem] font-medium text-gray-100 leading-[1.35] tracking-[-0.02em] text-balance">
            {t('about.approach.quote', language)}
          </p>
        </motion.blockquote>

        <div className="space-y-5">
          {paragraphs.map((paragraph, index) => (
            <motion.p
              key={paragraph}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.base, delay: index * 0.08 }}
              className="text-base text-gray-400 leading-relaxed text-pretty"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}

function EducationSection({ language, isEnglish }) {
  const education = useMemo(() => getEducation(isEnglish), [isEnglish]);
  const languages = useMemo(() => getLanguages(isEnglish), [isEnglish]);

  return (
    <section>
      <SectionHeading
        index="05"
        label={isEnglish ? 'Education' : 'Formação'}
        title={t('about.education.title', language)}
      />

      <div className="grid grid-cols-1 laptop:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-12 laptop:gap-20">
        <div>
          {education.map((item, index) => (
            <motion.article
              key={item.institution}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.base, delay: index * 0.08, ease: EASE.out }}
              className="flex items-start gap-5 py-7 border-t border-white/10 last:border-b"
            >
              <div className="relative w-11 h-11 flex-shrink-0 mt-0.5 opacity-80">
                <Image src={item.logo} alt={item.institution} fill className="object-contain" />
              </div>

              <div className="min-w-0 flex-grow">
                <div className="flex items-center gap-2.5 flex-wrap mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                    {item.institution} — {item.period}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                      item.isOngoing ? 'text-primary' : 'text-emerald-400'
                    }`}
                  >
                    {item.isOngoing ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    ) : (
                      <FiCheck size={9} />
                    )}
                    {item.status}
                  </span>
                </div>

                <h3 className="font-display text-lg laptop:text-xl font-bold text-white leading-snug tracking-[-0.02em]">
                  {item.degree}
                </h3>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.base, delay: 0.16, ease: EASE.out }}
          className="laptop:self-start"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-2">
            {isEnglish ? 'Languages' : 'Idiomas'}
          </p>

          <dl>
            {languages.map((item) => (
              <div
                key={item.name}
                className="flex items-baseline justify-between gap-4 py-5 border-t border-white/10 last:border-b"
              >
                <dt className="font-display text-lg font-bold text-white">{item.name}</dt>
                <dd className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                  {item.level}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}

function ClosingCallToAction({ language, isEnglish }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: DURATION.base, ease: EASE.out }}
      className="pt-4"
    >
      <div className="h-px bg-white/10 mb-10 tablet:mb-14" />

      <div className="flex flex-col tablet:flex-row tablet:items-end tablet:justify-between gap-8">
        <h2 className="font-display text-2xl tablet:text-3xl laptop:text-4xl font-bold text-white tracking-[-0.03em] leading-tight max-w-lg text-balance">
          {t('about.cta.title', language)}
        </h2>

        <div className="flex flex-wrap gap-3 flex-shrink-0">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors duration-200"
          >
            {isEnglish ? 'Get in touch' : 'Falar comigo'}
            <FiArrowUpRight className="w-4 h-4" />
          </Link>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-white/15 text-gray-200 hover:border-primary hover:text-primary transition-colors duration-200"
          >
            {isEnglish ? 'Read the blog' : 'Ler o blog'}
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

export default function About() {
  const { language } = useLanguage();
  const isEnglish = language === 'en-US';

  const career = useMemo(() => getCareer(isEnglish), [isEnglish]);
  const skillDomains = useMemo(() => getSkillDomains(isEnglish), [isEnglish]);
  const projects = useMemo(() => getProjects(isEnglish), [isEnglish]);

  const pageTitle = isEnglish
    ? 'About | Enzo Araujo Duarte — Software Developer'
    : 'Sobre | Enzo Araujo Duarte — Desenvolvedor de Software';

  const pageDescription = isEnglish
    ? 'Software Developer at 260 Sample Sale, working on Shopify storefronts and internal systems with PHP, Laravel, React, Next.js, Liquid and GraphQL, backed by an enterprise SAP/ABAP foundation.'
    : 'Software Developer na 260 Sample Sale, atuando em lojas Shopify e sistemas internos com PHP, Laravel, React, Next.js, Liquid e GraphQL, com base em sistemas corporativos SAP/ABAP.';

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href="https://enzoaraujo.site/about" />

        <meta property="og:type" content="profile" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content="https://enzoaraujo.site/about" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Head>

      <div className="relative min-h-screen">
        <PageBackdrop />

        <div className="relative z-10 container pt-28 tablet:pt-36 pb-24 tablet:pb-32">
          <AboutHero language={language} isEnglish={isEnglish} />

          <div className="mt-20 tablet:mt-28 space-y-20 tablet:space-y-28">
            <ApproachSection language={language} isEnglish={isEnglish} />

            <section>
              <SectionHeading
                index="02"
                label={isEnglish ? 'Experience' : 'Experiência'}
                title={t('about.career.title', language)}
              />
              <CareerTimeline career={career} isEnglish={isEnglish} />
            </section>

            <section>
              <SectionHeading
                index="03"
                label={isEnglish ? 'Selected work' : 'Projetos'}
                title={t('about.projects.title', language)}
                lead={t('about.projects.lead', language)}
              />
              <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-x-8 gap-y-14 laptop:gap-x-10">
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    isEnglish={isEnglish}
                  />
                ))}
              </div>
            </section>

            <section>
              <SectionHeading
                index="04"
                label="Stack"
                title={t('about.skills.title', language)}
                lead={t('about.skills.lead', language)}
              />
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-x-10 gap-y-10 laptop:gap-x-14">
                {skillDomains.map((domain, index) => (
                  <SkillDomainCard key={domain.id} domain={domain} index={index} />
                ))}
              </div>
            </section>

            <EducationSection language={language} isEnglish={isEnglish} />

            <ClosingCallToAction language={language} isEnglish={isEnglish} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
