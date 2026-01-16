'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../locales/translations';

export default function ContactForm() {
  const { language } = useLanguage();
  const isEnglish = language === 'en-US';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('contact.form.nameRequired', language);
    }

    if (!formData.email.trim()) {
      newErrors.email = t('contact.form.emailRequired', language);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('contact.form.emailInvalid', language);
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t('contact.form.subjectRequired', language);
    }

    if (!formData.message.trim()) {
      newErrors.message = t('contact.form.messageRequired', language);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-dark-secondary rounded-lg shadow-lg p-6 tablet:p-8 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('contact.form.name', language)} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.name
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-primary'
            } bg-white dark:bg-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors`}
            placeholder={isEnglish ? 'Your name' : 'Seu nome'}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <FiAlertCircle size={14} />
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('contact.form.email', language)} *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.email
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-primary'
            } bg-white dark:bg-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors`}
            placeholder={isEnglish ? 'your.email@example.com' : 'seu.email@exemplo.com'}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <FiAlertCircle size={14} />
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('contact.form.subject', language)} *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.subject
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-primary'
            } bg-white dark:bg-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors`}
            placeholder={isEnglish ? 'What is this about?' : 'Sobre o que é?'}
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <FiAlertCircle size={14} />
              {errors.subject}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('contact.form.message', language)} *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.message
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-primary'
            } bg-white dark:bg-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors resize-none`}
            placeholder={isEnglish ? 'Your message...' : 'Sua mensagem...'}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <FiAlertCircle size={14} />
              {errors.message}
            </p>
          )}
        </div>
      </div>

      {submitStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-400"
        >
          <FiCheck size={20} />
          <p className="text-sm font-medium">{t('contact.form.success', language)}</p>
        </motion.div>
      )}

      {submitStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400"
        >
          <FiAlertCircle size={20} />
          <p className="text-sm font-medium">{t('contact.form.error', language)}</p>
        </motion.div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {t('contact.form.sending', language)}
          </>
        ) : (
          <>
            <FiSend size={18} />
            {t('contact.form.send', language)}
          </>
        )}
      </button>
    </motion.form>
  );
}
