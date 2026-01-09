import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../locales/translations';
import Head from 'next/head';

export default function Contact() {
  const { language } = useLanguage();

  // Animation variants
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
        <title>{t('contact.title', language)} | Enzo Araujo Duarte</title>
      </Head>
      
      <div className="container py-16 min-h-[calc(100vh-4rem)] flex flex-col justify-center">
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
          className="max-w-4xl mx-auto w-full"
        >
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-700 dark:text-gray-300 mb-12 text-center"
          >
            {t('contact.subtitle', language)}
          </motion.p>

          <motion.div 
            variants={containerAnimation}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 tablet:grid-cols-3 gap-8"
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