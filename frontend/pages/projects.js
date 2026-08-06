import { useMemo } from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../locales/translations';
import Head from 'next/head';
import Image from 'next/image';
import { FiArrowUpRight, FiCode } from 'react-icons/fi';
import PageBackdrop from '../components/layout/PageBackdrop';

// ─────────────────────────────────────────────────────────────────────────────
// Featured project card – large, editorial horizontal layout
// ─────────────────────────────────────────────────────────────────────────────
function FeaturedProjectCard({ project, index, isEnglish }) {
  const reversed = index % 2 !== 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title} — ${isEnglish ? 'View Project' : 'Ver Projeto'}`}
        className={`group flex flex-col ${
          reversed ? 'tablet:flex-row-reverse' : 'tablet:flex-row'
        } overflow-hidden rounded-2xl bg-white dark:bg-dark-secondary border border-gray-100 dark:border-white/[0.06] hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/10 tablet:min-h-[300px]`}
      >
        {/* ── Image panel ─────────────────────────────────── */}
        <div className="relative w-full aspect-[16/10] tablet:w-[58%] tablet:aspect-auto overflow-hidden bg-gray-100 dark:bg-dark-lighter flex-shrink-0">
          {project.images?.[0] && (
            <Image
              src={project.images[0]}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, 58vw"
              priority={index === 0}
            />
          )}
          {project.images?.[1] && (
            <Image
              src={project.images[1]}
              alt={`${project.title} – 2`}
              fill
              className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"
              sizes="(max-width: 768px) 100vw, 58vw"
            />
          )}
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Status badge */}
          <div className="absolute top-4 left-4 z-10">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${
                project.status === 'Online'
                  ? 'bg-black/40 text-emerald-300 border-emerald-500/30'
                  : 'bg-black/40 text-violet-300 border-violet-400/30'
              }`}
            >
              {project.status === 'Online' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
              {project.status}
            </span>
          </div>
        </div>

        {/* ── Content panel ───────────────────────────────── */}
        <div className="relative flex flex-col justify-center flex-1 p-7 tablet:p-8 laptop:p-10 overflow-hidden">
          {/* Decorative watermark number */}
          <span className="absolute -top-2 right-4 text-[7rem] laptop:text-[8.5rem] font-black leading-none select-none pointer-events-none text-gray-100 dark:text-white/[0.025]">
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Eyebrow label */}
          <p className="relative text-[10px] font-bold uppercase tracking-[0.22em] text-primary mb-4">
            {isEnglish ? 'Featured Work' : 'Projeto em Destaque'}
          </p>

          {/* Title */}
          <h3 className="relative text-2xl laptop:text-3xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
            {project.title}
          </h3>

          {/* Description */}
          <p className="relative text-sm laptop:text-[0.925rem] text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="relative flex flex-wrap gap-1.5 mb-7">
            {project.tags.slice(0, 5).map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-dark-lighter text-gray-600 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 5 && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium text-gray-400 dark:text-gray-500">
                +{project.tags.length - 5}
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="relative flex items-center gap-2 text-sm font-semibold text-primary">
            <span>{isEnglish ? 'View Project' : 'Ver Projeto'}</span>
            <FiArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </a>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Library project card – compact, refined grid card
// ─────────────────────────────────────────────────────────────────────────────
function LibraryCard({ project, index, isEnglish }) {
  const Tag = project.url ? 'a' : 'div';
  const linkProps = project.url
    ? { href: project.url, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <motion.article
      className="h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.08 }}
    >
      <Tag
        {...linkProps}
        className={`group flex flex-col h-full overflow-hidden rounded-2xl bg-white dark:bg-dark-secondary border border-gray-100 dark:border-white/[0.06] hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-lg hover:shadow-primary/10`}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-dark-lighter flex-shrink-0">
          {project.images?.[0] ? (
            <>
              <Image
                src={project.images[0]}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {project.images?.[1] && (
                <Image
                  src={project.images[1]}
                  alt={`${project.title} – 2`}
                  fill
                  className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
              <FiCode className="w-10 h-10 text-primary/25" />
            </div>
          )}
          {/* Status pill */}
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-sm border ${
                project.status === 'Online'
                  ? 'bg-black/50 text-emerald-300 border-emerald-500/30'
                  : 'bg-black/50 text-violet-300 border-violet-400/30'
              }`}
            >
              {project.status === 'Online' && (
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
              )}
              {project.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-5 laptop:p-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors duration-300 leading-snug">
            {project.title}
          </h3>

          <p className="text-xs laptop:text-[0.8125rem] text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {project.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-[10px] laptop:text-xs font-medium bg-gray-100 dark:bg-dark-lighter text-gray-600 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-2 py-0.5 rounded text-[10px] laptop:text-xs font-medium text-gray-400 dark:text-gray-500">
                +{project.tags.length - 3}
              </span>
            )}
          </div>

          {/* Link or status note */}
          <div className="mt-auto">
            {project.url ? (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <span>{isEnglish ? 'View Project' : 'Ver Projeto'}</span>
                <FiArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            ) : (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {isEnglish ? 'In development' : 'Em desenvolvimento'}
              </p>
            )}
          </div>
        </div>

        {/* Bottom border accent */}
        <div className="h-px w-0 group-hover:w-full bg-gradient-to-r from-primary via-primary-light to-primary transition-all duration-500 ease-out" />
      </Tag>
    </motion.article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function Projects() {
  const { language } = useLanguage();
  const isEnglish = language === 'en-US';

  const pageTitle = isEnglish
    ? 'Projects | Enzo Araujo Duarte'
    : 'Projetos | Enzo Araujo Duarte';

  const pageDescription = isEnglish
    ? 'Explore my projects and portfolio works.'
    : 'Explore meus projetos e trabalhos do portfólio.';

  const projects = useMemo(
    () => [
      {
        id: 1,
        title: 'TechGrowth',
        description: isEnglish
          ? 'Project still in development. Created to help me achieve my personal goals for this year, with the goal of evolving so that other people can use it. Platform for developers to track growth in leadership, communication, and software architecture. Manage books, goals, and daily tasks.'
          : 'Projeto ainda em desenvolvimento. Foi criado para me ajudar a alcançar minhas metas pessoais para este ano, mas quero evoluir para que outras pessoas possam usar. Plataforma para desenvolvedores acompanharem seu crescimento em liderança, comunicação e arquitetura de software. Gerencie livros, metas e tarefas diárias.',
        status: isEnglish ? 'In Development' : 'Em Desenvolvimento',
        url: 'https://tech-growth-nine.vercel.app/',
        images: [
          '/Images/Projects/TechGrowth/TechGrowth.png',
          '/Images/Projects/TechGrowth/TechGrowth2.png',
        ],
        tags: isEnglish
          ? ['Next.js', 'React', 'Productivity']
          : ['Next.js', 'React', 'Produtividade'],
      },
      {
        id: 2,
        title: 'Rota Certa Logtech',
        description: isEnglish
          ? 'Website for a fictional logistics company built with Next.js 15. Corporate site showcasing B2B wholesale distribution services, last-mile delivery solutions, and real-time tracking technology. Features responsive design, modern UI components, and seamless user experience.'
          : 'Site para uma empresa fictícia de logística desenvolvido com Next.js 15. Site corporativo apresentando serviços de distribuição atacadista B2B, soluções de entrega last-mile e tecnologia de rastreamento em tempo real. Possui design responsivo, componentes UI modernos e experiência de usuário fluida.',
        status: 'Online',
        url: 'https://rotacerta-sand.vercel.app/',
        images: [
          '/Images/Projects/RotaCerta/RotaCerta.png',
          '/Images/Projects/RotaCerta/RotaCerta3.png',
          '/Images/Projects/RotaCerta/RotaCerta2.png',
        ],
        tags: ['Next.js 15', 'React 18', 'Tailwind CSS', 'shadcn/ui', 'Radix UI'],
      },
      {
        id: 3,
        featured: true,
        title: 'Hydro E-commerce',
        description: isEnglish
          ? 'Premium fashion e-commerce storefront built with Next.js and Mock.shop API. Features a headless commerce architecture with sophisticated animations, custom cursor system, smooth scroll physics, and cinematic route transitions. Designed to deliver a high-end shopping experience with product catalog, variant selection, and persistent cart management.'
          : 'Loja virtual premium de moda desenvolvida com Next.js e Mock.shop API. Possui arquitetura headless commerce com animações sofisticadas, sistema de cursor customizado, física de scroll suave e transições cinematográficas entre rotas. Foi projetada para entregar uma experiência de compra de alto nível com catálogo de produtos, seleção de variantes e carrinho persistente.',
        status: 'Online',
        url: 'https://hidro-e-commerce.vercel.app/',
        images: [
          '/Images/Projects/Hydro/HYDRO.png',
          '/Images/Projects/Hydro/HYDRO2.png',
          '/Images/Projects/Hydro/HYDRO3.png',
          '/Images/Projects/Hydro/HYDRO4.png',
        ],
        tags: ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Mock.shop API'],
      },
      {
        id: 4,
        featured: true,
        title: 'Flash Sale Engine',
        description: isEnglish
          ? 'E-commerce experience simulating high-pressure flash sale drops with real-time event phases, scarcity mechanics, and batch-based product release. Features a full event lifecycle from pre-sale queue to sold-out state, with dynamic countdown timers, per-user purchase limits, and availability signals driven by live stock levels. Product catalog is fetched from an external API with automatic fallback and ISR revalidation.'
          : 'Experiência de e-commerce que simula flash sales de alta pressão com fases de evento em tempo real, mecânicas de escassez e liberação de produtos em lotes. Possui um ciclo completo do evento, da fila de pré-venda ao estado de esgotado, com contadores regressivos dinâmicos, limite de compra por usuário e sinais de disponibilidade guiados pelos níveis de estoque em tempo real. O catálogo de produtos é obtido de uma API externa com fallback automático e revalidação via ISR.',
        status: 'Online',
        url: 'https://flash-sale-beta.vercel.app/',
        images: [
          '/Images/Projects/FlashSale/FlashSale.png',
          '/Images/Projects/FlashSale/FlashSale2.png',
          '/Images/Projects/FlashSale/FlashSale3.png',
        ],
        tags: ['Next.js 15', 'React 18', 'TypeScript', 'Tailwind CSS', 'App Router'],
      },
      {
        id: 5,
        title: 'SimpleWay Organograma',
        description: isEnglish
          ? 'Interactive organizational chart website representing a company structure. Built with React and Tailwind CSS, featuring hierarchical visualization of positions, departments, and corporate structure with smooth interactions.'
          : 'Site interativo de organograma representando a estrutura organizacional de uma empresa. Desenvolvido com React e Tailwind CSS, apresenta visualização hierárquica de cargos, departamentos e estrutura corporativa com interações fluidas.',
        status: 'Online',
        url: 'https://simplewayorganize.vercel.app/organograma',
        images: [
          '/Images/Projects/Organograma/SimpleWayOrganograma.png',
          '/Images/Projects/Organograma/SimpleWayOrganograma2.png',
        ],
        tags: ['React', 'Tailwind CSS'],
      },
    ],
    [isEnglish]
  );

  const featuredProjects = useMemo(() => projects.filter((p) => p.featured), [projects]);
  const libraryProjects = useMemo(() => projects.filter((p) => !p.featured), [projects]);

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href="https://enzoaraujo.site/projects" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content="https://enzoaraujo.site/projects" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Head>

      <div className="relative min-h-screen">
        <PageBackdrop />

        <div className="relative z-10">

          {/* ── Page Hero ──────────────────────────────────────── */}
          <div className="container pt-24 tablet:pt-32 pb-10 tablet:pb-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary mb-3">
                {isEnglish
                  ? `Selected Works — ${projects.length} Projects`
                  : `Seleção de Projetos — ${projects.length} projetos`}
              </p>
              <h1 className="text-5xl tablet:text-6xl laptop:text-7xl font-bold text-gray-900 dark:text-white leading-none">
                {t('projects.title', language)}
              </h1>
            </motion.div>

            {/* Animated divider */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-8 h-px bg-gray-200 dark:bg-white/10 origin-left"
            />
          </div>

          {/* ── Featured Section ────────────────────────────────── */}
          <div className="container pb-14 tablet:pb-20">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 mb-8 tablet:mb-10"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400 whitespace-nowrap">
                {isEnglish ? '01 — Featured' : '01 — Destaques'}
              </p>
              <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
            </motion.div>

            <div className="space-y-6 laptop:space-y-8">
              {featuredProjects.map((project, index) => (
                <FeaturedProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  isEnglish={isEnglish}
                />
              ))}
            </div>
          </div>

          {/* ── Library Section ─────────────────────────────────── */}
          <div className="container pb-20 tablet:pb-28">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 mb-8 tablet:mb-10"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400 whitespace-nowrap">
                {isEnglish ? '02 — More Work' : '02 — Mais Projetos'}
              </p>
              <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
            </motion.div>

            <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-5 laptop:gap-6">
              {libraryProjects.map((project, index) => (
                <LibraryCard
                  key={project.id}
                  project={project}
                  index={index}
                  isEnglish={isEnglish}
                />
              ))}
            </div>
          </div>

          {/* ── Footer note ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="container pb-16 text-center"
          >
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {isEnglish ? 'More projects coming soon...' : 'Mais projetos em breve...'}
            </p>
          </motion.div>

        </div>
      </div>
    </Layout>
  );
}
