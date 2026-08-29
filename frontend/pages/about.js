import { useMemo, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowUpRight, FiCheck } from 'react-icons/fi';

import Layout from '../components/layout/Layout';
import { useReveal } from '../hooks/useReveal';
import { usePointerMask } from '../hooks/usePointerMask';
import PageBackdrop from '../components/layout/PageBackdrop';
import SectionHeading from '../components/about/SectionHeading';
import CareerTimeline from '../components/about/CareerTimeline';
import SkillDomainCard from '../components/about/SkillDomainCard';
import ProjectCard from '../components/about/ProjectCard';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../locales/translations';
import { getCareer, getSkillDomains, getEducation, getLanguages } from '../components/about/data';
import { getProjects } from '../components/about/projects';

function AboutHero({ language, isEnglish }) {
  const plateRef = useRef(null);

  usePointerMask(plateRef);

  return (
    <section
      data-reveal-group
      className="grid grid-cols-1 tablet:grid-cols-[minmax(0,1fr)_auto] tablet:items-end gap-10 tablet:gap-14">
      <div>
        <p data-reveal className="meta mb-6 text-ember">
          {t('about.eyebrow', language)}
        </p>

        <h1 data-reveal className="font-display text-4xl tablet:text-5xl laptop:text-6xl desktop:text-7xl font-semibold text-bone leading-[0.98] tracking-[-0.04em] text-balance">
          {t('about.headline', language)}
        </h1>

        <p data-reveal className="mt-7 max-w-xl text-base tablet:text-lg text-bone/55 leading-relaxed text-pretty">
          {t('about.lead', language)}
        </p>

        <div data-reveal className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-ember/20 bg-ember/10 px-3 py-1.5 text-xs font-medium text-ember">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            {t('about.currentRole', language)}
          </span>
          <span className="text-xs text-ash/70">
            {isEnglish ? 'New York · Remote' : 'Nova York · Remoto'}
          </span>
        </div>
      </div>

      {/* Editorial plate, not an avatar. No rounded cutout floating on the
          page: a 4:5 frame that bleeds into the ink through a gradient mask,
          with an ember rule sitting on the headline's baseline. The one
          interaction is a light the cursor carries across it — the page is
          ink, the person is underneath. */}
      <figure
        data-reveal
        ref={plateRef}
        className="group relative mx-auto w-full max-w-[19rem] flex-shrink-0 tablet:mx-0 tablet:max-w-[17rem] laptop:max-w-[21rem]"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src="/Images/enzo-profile.webp"
            alt="Enzo Araujo Duarte"
            fill
            sizes="(max-width: 768px) 304px, (max-width: 1024px) 272px, 336px"
            className="object-cover object-[center_18%]"
            priority
            quality={88}
          />

          {/* The same frame in black and white, revealed only where the cursor
              is. Nothing regenerates per frame: the mask gradient is fixed and
              only its position moves. */}
          <div
            data-pointer-mask
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out"
            style={{
              maskImage: 'radial-gradient(circle closest-side, #000 42%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(circle closest-side, #000 42%, transparent 100%)',
              maskSize: '20rem 20rem',
              WebkitMaskSize: '20rem 20rem',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'calc(var(--x) * 1px - 10rem) calc(var(--y) * 1px - 10rem)',
              WebkitMaskPosition: 'calc(var(--x) * 1px - 10rem) calc(var(--y) * 1px - 10rem)',
            }}
          >
            <Image
              src="/Images/enzo-profile.webp"
              alt=""
              fill
              sizes="(max-width: 768px) 304px, (max-width: 1024px) 272px, 336px"
              className="object-cover object-[center_18%] grayscale contrast-[1.18] brightness-[0.95]"
              quality={88}
            />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
            style={{ backgroundImage: 'url(/Images/art/grain-256.png)' }}
          />

          {/* Bleeds into the page instead of ending at an edge. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent"
          />
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-ember/70 pt-3">
          <figcaption className="meta">Enzo Araujo Duarte</figcaption>
          <span className="font-mono text-[10px] text-ash/60">
            {isEnglish ? 'New York · Remote' : 'Nova York · Remoto'}
          </span>
        </div>
      </figure>
    </section>
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
        <blockquote data-reveal
          className="relative pl-6 border-l-2 border-ember">
          <p className="font-display text-xl tablet:text-2xl laptop:text-[1.75rem] font-medium text-bone/90 leading-[1.35] tracking-[-0.02em] text-balance">
            {t('about.approach.quote', language)}
          </p>
        </blockquote>

        <div className="space-y-5">
          {paragraphs.map((paragraph, index) => (
            <p data-reveal
              key={paragraph}
              className="text-base text-bone/55 leading-relaxed text-pretty">
              {paragraph}
            </p>
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
            <article data-reveal
              key={item.institution}
              className="flex items-start gap-5 py-7 border-t border-bone/10 last:border-b">
              <div className="relative w-11 h-11 flex-shrink-0 mt-0.5 opacity-80">
                <Image src={item.logo} alt={item.institution} fill className="object-contain" />
              </div>

              <div className="min-w-0 flex-grow">
                <div className="flex items-center gap-2.5 flex-wrap mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ember">
                    {item.institution} — {item.period}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                      item.isOngoing ? 'text-ember' : 'text-emerald-400'
                    }`}
                  >
                    {item.isOngoing ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
                    ) : (
                      <FiCheck size={9} />
                    )}
                    {item.status}
                  </span>
                </div>

                <h3 className="font-display text-lg laptop:text-xl font-bold text-bone leading-snug tracking-[-0.02em]">
                  {item.degree}
                </h3>
              </div>
            </article>
          ))}
        </div>

        <div data-reveal
          className="laptop:self-start">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ash mb-2">
            {isEnglish ? 'Languages' : 'Idiomas'}
          </p>

          <dl>
            {languages.map((item) => (
              <div
                key={item.name}
                className="flex items-baseline justify-between gap-4 py-5 border-t border-bone/10 last:border-b"
              >
                <dt className="font-display text-lg font-bold text-bone">{item.name}</dt>
                <dd className="text-xs font-semibold uppercase tracking-[0.12em] text-ember">
                  {item.level}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function ClosingCallToAction({ language, isEnglish }) {
  return (
    <section data-reveal
      className="pt-4">
      <div className="h-px bg-bone/10 mb-10 tablet:mb-14" />

      <div className="flex flex-col tablet:flex-row tablet:items-end tablet:justify-between gap-8">
        <h2 className="font-display text-2xl tablet:text-3xl laptop:text-4xl font-bold text-bone tracking-[-0.03em] leading-tight max-w-lg text-balance">
          {t('about.cta.title', language)}
        </h2>

        <div className="flex flex-wrap gap-3 flex-shrink-0">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-ember text-ink hover:bg-ember-dim transition-colors duration-200"
          >
            {isEnglish ? 'Get in touch' : 'Falar comigo'}
            <FiArrowUpRight className="w-4 h-4" />
          </Link>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-bone/15 text-bone/80 hover:border-ember hover:text-ember transition-colors duration-200"
          >
            {isEnglish ? 'Read the blog' : 'Ler o blog'}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function About() {
  const rootRef = useRef(null);
  const { language } = useLanguage();
  const isEnglish = language === 'en-US';

  const career = useMemo(() => getCareer(isEnglish), [isEnglish]);
  const skillDomains = useMemo(() => getSkillDomains(isEnglish), [isEnglish]);
  const projects = useMemo(() => getProjects(isEnglish), [isEnglish]);

  useReveal(rootRef, [isEnglish]);

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

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:image" content="https://enzoaraujo.site/Images/art/og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="https://enzoaraujo.site/Images/art/og.jpg" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Head>

      <div ref={rootRef} className="relative min-h-screen">
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
