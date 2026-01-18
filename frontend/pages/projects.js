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
      title: 'TechGrowth',
      description: isEnglish 
        ? 'Project still in development. Created to help me achieve my personal goals for this year, with the goal of evolving so that other people can use it. Platform for developers to track growth in leadership, communication, and software architecture. Manage books, goals, and daily tasks.'
        : 'Projeto ainda em desenvolvimento. Foi criado para me ajudar a alcançar minhas metas pessoais para este ano, mas quero evoluir para que outras pessoas possam usar. Plataforma para desenvolvedores acompanharem seu crescimento em liderança, comunicação e arquitetura de software. Gerencie livros, metas e tarefas diárias.',
      status: isEnglish ? 'In Development' : 'Em Desenvolvimento',
      url: 'https://tech-growth-nine.vercel.app/',
      images: ['/Images/Projects/TechGrowth/TechGrowth.png' , '/Images/Projects/TechGrowth/TechGrowth2.png' ],
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
      status: isEnglish ? 'Online' : 'Online',
      url: 'https://rotacerta-sand.vercel.app/',
      images: ['/Images/Projects/RotaCerta/RotaCerta.png' , '/Images/Projects/RotaCerta/RotaCerta3.png' , '/Images/Projects/RotaCerta/RotaCerta2.png'],
      tags: isEnglish 
        ? ['Next.js 15', 'React 18', 'Tailwind CSS', 'shadcn/ui', 'Radix UI']
        : ['Next.js 15', 'React 18', 'Tailwind CSS', 'shadcn/ui', 'Radix UI'],
    },
    {
      id: 3,
      title: 'SimpleWay Organograma',
      description: isEnglish 
        ? 'Interactive organizational chart website representing a company structure. Built with React and Tailwind CSS, featuring hierarchical visualization of positions, departments, and corporate structure with smooth interactions.'
        : 'Site interativo de organograma representando a estrutura organizacional de uma empresa. Desenvolvido com React e Tailwind CSS, apresenta visualização hierárquica de cargos, departamentos e estrutura corporativa com interações fluidas.',
      status: isEnglish ? 'Online' : 'Online',
      url: 'https://simplewayorganize.vercel.app/organograma',
      images: ['/Images/Projects/Organograma/SimpleWayOrganograma.png' , '/Images/Projects/Organograma/SimpleWayOrganograma2.png'],
      tags: isEnglish 
        ? ['React', 'Tailwind CSS']
        : ['React', 'Tailwind CSS'],
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
                className="group flex"
              >
                <div className="relative bg-white dark:bg-dark-secondary rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col w-full">
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-dark-lighter">
                    {project.images && project.images.length > 1 ? (
                      <>
                        {project.images.map((imgSrc, index) => (
                          <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                              index === 0 
                                ? 'opacity-100 group-hover:opacity-0' 
                                : 'opacity-0'
                            }`}
                            style={{
                              zIndex: project.images.length - index,
                              transitionDelay: index > 0 ? `${(index - 1) * 800}ms` : '0ms',
                            }}
                          >
                            <Image
                              src={imgSrc}
                              alt={`${project.title} - ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                        <style jsx>{`
                          ${project.images.map((_, index) => {
                            if (index === 0) return '';
                            const delay = (index - 1) * 800;
                            return `
                              .group:hover div:nth-child(${index + 1}) {
                                opacity: 1 !important;
                              }
                            `;
                          }).join('')}
                        `}</style>
                      </>
                    ) : project.image && project.image !== '/Images/placeholder-project.png' ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <>
                        {/* Placeholder with gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />

                        {/* Placeholder Icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <FiCode className="w-16 h-16 text-primary/40 mx-auto mb-3" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {project.url 
                                ? (isEnglish ? 'Live Project' : 'Projeto Online')
                                : (isEnglish ? 'Coming Soon' : 'Em Breve')
                              }
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-300" />
                  </div>

                  {/* Card Content */}
                  <div className="p-5 tablet:p-6 flex flex-col flex-grow">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>

                    {/* Description */}
                    {project.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                        {project.description}
                      </p>
                    )}

                    {/* Tags */}
                    {project.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-dark-lighter text-gray-700 dark:text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Status/Link */}
                    <div className="flex items-center justify-between mt-auto">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {project.status}
                      </span>

                      {project.url ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-light transition-colors duration-300"
                        >
                          <span>{isEnglish ? 'View Project' : 'Ver Projeto'}</span>
                          <FiExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        >
                          <span>{isEnglish ? 'View Project' : 'Ver Projeto'}</span>
                          <FiExternalLink className="w-4 h-4" />
                        </button>
                      )}
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
