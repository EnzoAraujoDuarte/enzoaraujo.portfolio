import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
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

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

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
        <div className="relative z-10 container py-16 pt-24 min-h-[calc(100vh-4rem)] flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {t('contact.title', language)}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-6xl mx-auto w-full space-y-12"
        >
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-700 dark:text-gray-300 text-center"
          >
            {t('contact.subtitle', language)}
          </motion.p>

          <div className="grid grid-cols-1 laptop:grid-cols-2 gap-8">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('contact.form.title', language)}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('contact.form.subtitle', language)}
                </p>
                <ContactForm />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {isEnglish ? 'Other ways to reach me' : 'Outras formas de contato'}
              </h2>
              <motion.div 
                variants={containerAnimation}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="space-y-4"
              >
                <motion.div variants={itemAnimation}>
                  <ContactCard 
                    icon={<FiGithub size={48} />}
                    title="GitHub"
                    description={t('contact.github', language)}
                    link="https://github.com/EnzoAraujoDuarte"
                  />
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <ContactCard 
                    icon={<FiLinkedin size={48} />}
                    title="LinkedIn"
                    description={t('contact.linkedin', language)}
                    link="https://www.linkedin.com/in/enzo-araujo-duarte/"
                  />
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <ContactCard 
                    icon={<FiMail size={48} />}
                    title="Email"
                    description={t('contact.email', language)}
                    link="mailto:araujoduarteenzo@gmail.com"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        </div>
      </div>
    </Layout>
  );
}

function ContactCard({ icon, title, description, link }) {
  return (
    <motion.a 
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center p-6 bg-white dark:bg-dark-secondary rounded-lg shadow-sm hover:shadow-md transition-all text-center w-full h-full"
      whileHover={{ y: -5, scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-primary mb-3 p-2">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-700 dark:text-gray-300">
        {description}
      </p>
    </motion.a>
  );
} 