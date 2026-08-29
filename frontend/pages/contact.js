import { useRef } from 'react';
import Layout from '../components/layout/Layout';
import { useReveal } from '../hooks/useReveal';
import { FiGithub, FiLinkedin, FiMail, FiArrowUpRight } from 'react-icons/fi';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../locales/translations';
import Head from 'next/head';
import ContactForm from '../components/contact/ContactForm';
import PageBackdrop from '../components/layout/PageBackdrop';

export default function Contact() {
  const rootRef = useRef(null);
  useReveal(rootRef);
  const { language } = useLanguage();
  const isEnglish = language === 'en-US';

  const pageTitle = isEnglish
    ? 'Contact | Enzo Araujo Duarte — Software Developer'
    : 'Contato | Enzo Araujo Duarte — Desenvolvedor de Software';

  const pageDescription = isEnglish
    ? 'Get in touch with Enzo Araujo Duarte. Software Developer working with Shopify, Laravel, React and Next.js, available for projects and opportunities.'
    : 'Entre em contato com Enzo Araujo Duarte. Desenvolvedor de software com Shopify, Laravel, React e Next.js, disponível para projetos e oportunidades.';

  const contactLinks = [
    {
      icon: <FiGithub />,
      title: 'GitHub',
      description: t('contact.github', language),
      link: 'https://github.com/EnzoAraujoDuarte',
      color: 'group-hover:text-bone',
      bgColor: 'group-hover:bg-bone/10',
    },
    {
      icon: <FiLinkedin />,
      title: 'LinkedIn',
      description: t('contact.linkedin', language),
      link: 'https://www.linkedin.com/in/enzo-araujo-duarte/',
      color: 'group-hover:text-blue-600',
      bgColor: 'group-hover:bg-blue-900/20',
    },
    {
      icon: <FiMail />,
      title: 'Email',
      description: t('contact.email', language),
      link: 'mailto:araujoduarteenzo@gmail.com',
      color: 'group-hover:text-ember',
      bgColor: 'group-hover:bg-ember/10',
    },
  ];

  return (
    <Layout>
      <div ref={rootRef}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href="https://enzoaraujo.site/contact" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content="https://enzoaraujo.site/contact" />
        <meta property="og:image" content="https://enzoaraujo.site/Images/art/og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="https://enzoaraujo.site/Images/art/og.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Head>

      <div className="relative min-h-screen">
        <PageBackdrop />

        {/* Content */}
        <div className="relative z-10 container py-24 tablet:py-32">
          {/* Header Section */}
          <div data-reveal-group className="mb-12 tablet:mb-16">
            <p data-reveal className="meta mb-6 text-ember">
              {isEnglish ? 'Get in touch' : 'Fale comigo'}
            </p>
            <h1
              data-reveal
              className="font-display text-4xl tablet:text-5xl laptop:text-6xl font-semibold text-bone tracking-[-0.04em] leading-[0.98] text-balance"
            >
              {t('contact.title', language)}
            </h1>
            <p data-reveal className="mt-6 max-w-2xl text-base tablet:text-lg text-bone/55 text-pretty">
              {t('contact.subtitle', language)}
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 laptop:grid-cols-5 gap-8 laptop:gap-12">
              {/* Form Section - Takes 3 columns */}
              <div data-reveal
                className="laptop:col-span-3">
                <div className="bg-graphite/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 tablet:p-8 border border-gray-800">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-bone mb-2">
                      {t('contact.form.title', language)}
                    </h2>
                    <p className="text-bone/55">
                      {t('contact.form.subtitle', language)}
                    </p>
                  </div>
                  <ContactForm />
                </div>
              </div>

              {/* Contact Links Section - Takes 2 columns */}
              <div data-reveal
                className="laptop:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-bone mb-6">
                    {isEnglish ? 'Connect with me' : 'Conecte-se comigo'}
                  </h2>

                  <div className="space-y-4">
                    {contactLinks.map((item, index) => (
                      <a data-reveal
                        key={item.title}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group flex items-center gap-4 p-4 bg-graphite/60 backdrop-blur-sm rounded-xl border border-gray-800 transition-all duration-300 hover:shadow-lg hover:border-transparent ${item.bgColor}`}>
                        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-graphite text-bone/55 text-2xl transition-colors duration-300 ${item.color}`}>
                          {item.icon}
                        </div>
                        <div className="flex-grow min-w-0">
                          <h3 className="font-semibold text-bone mb-0.5">
                            {item.title}
                          </h3>
                          <p className="text-sm text-bone/55 truncate">
                            {item.description}
                          </p>
                        </div>
                        <FiArrowUpRight className="flex-shrink-0 w-5 h-5 text-bone/55 group-hover:text-ember transition-colors duration-300" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Additional Info Card */}
                <div data-reveal
                  className="rounded-2xl border border-bone/[0.08] bg-graphite/60 p-6">
                  <h3 className="mb-3 font-display font-semibold text-bone">
                    {isEnglish ? 'Available for' : 'Disponível para'}
                  </h3>
                  <ul className="space-y-2 text-sm text-bone/55">
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-ember" />
                      {isEnglish ? 'Freelance' : 'Freelance'} 
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-ember" />
                      {isEnglish ? 'Technical consulting' : 'Consultoria técnica'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}
