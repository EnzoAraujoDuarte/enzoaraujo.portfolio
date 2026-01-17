import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiArrowUpRight } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../locales/translations';
import Head from 'next/head';
import ContactForm from '../components/contact/ContactForm';

export default function Contact() {
  const { language } = useLanguage();
  const isEnglish = language === 'en-US';

  const pageTitle = isEnglish
    ? 'Contact | Enzo Araujo Duarte - SAP Developer & AI Engineer'
    : 'Contato | Enzo Araujo Duarte - Desenvolvedor SAP e Engenheiro de IA';

  const pageDescription = isEnglish
    ? 'Get in touch with Enzo Araujo Duarte. SAP ABAP Developer, AI Engineer with Python and Shopify Developer available for projects and opportunities.'
    : 'Entre em contato com Enzo Araujo Duarte. Desenvolvedor SAP ABAP, Engenheiro de IA com Python e Desenvolvedor Shopify disponível para projetos e oportunidades.';

  const contactLinks = [
    {
      icon: <FiGithub />,
      title: 'GitHub',
      description: t('contact.github', language),
      link: 'https://github.com/EnzoAraujoDuarte',
      color: 'group-hover:text-gray-900 dark:group-hover:text-white',
      bgColor: 'group-hover:bg-gray-100 dark:group-hover:bg-white/10',
    },
    {
      icon: <FiLinkedin />,
      title: 'LinkedIn',
      description: t('contact.linkedin', language),
      link: 'https://www.linkedin.com/in/enzo-araujo-duarte/',
      color: 'group-hover:text-blue-600',
      bgColor: 'group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20',
    },
    {
      icon: <FiMail />,
      title: 'Email',
      description: t('contact.email', language),
      link: 'mailto:araujoduarteenzo@gmail.com',
      color: 'group-hover:text-primary',
      bgColor: 'group-hover:bg-primary/5 dark:group-hover:bg-primary/10',
    },
  ];

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href="https://enzoaraujo.site/contact" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content="https://enzoaraujo.site/contact" />

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
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 tablet:mb-16"
          >
            <h1 className="text-4xl tablet:text-5xl laptop:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              {t('contact.title', language)}
            </h1>
            <p className="text-lg tablet:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('contact.subtitle', language)}
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 laptop:grid-cols-5 gap-8 laptop:gap-12">
              {/* Form Section - Takes 3 columns */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="laptop:col-span-3"
              >
                <div className="bg-white/80 dark:bg-dark-secondary/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 tablet:p-8 border border-gray-100 dark:border-gray-800">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {t('contact.form.title', language)}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('contact.form.subtitle', language)}
                    </p>
                  </div>
                  <ContactForm />
                </div>
              </motion.div>

              {/* Contact Links Section - Takes 2 columns */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="laptop:col-span-2 space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {isEnglish ? 'Connect with me' : 'Conecte-se comigo'}
                  </h2>

                  <div className="space-y-4">
                    {contactLinks.map((item, index) => (
                      <motion.a
                        key={item.title}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                        className={`group flex items-center gap-4 p-4 bg-white/60 dark:bg-dark-secondary/60 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-lg hover:border-transparent ${item.bgColor}`}
                      >
                        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-dark-lighter text-gray-600 dark:text-gray-400 text-2xl transition-colors duration-300 ${item.color}`}>
                          {item.icon}
                        </div>
                        <div className="flex-grow min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-0.5">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {item.description}
                          </p>
                        </div>
                        <FiArrowUpRight className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Additional Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 rounded-2xl border border-primary/20"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {isEnglish ? 'Available for' : 'Disponível para'}
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {isEnglish ? 'Freelance' : 'Freelance'} 
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {isEnglish ? 'Technical consulting' : 'Consultoria técnica'}
                    </li>
                  </ul>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
