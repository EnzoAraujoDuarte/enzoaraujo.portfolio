'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiCheck, FiAlertCircle, FiUser, FiMail, FiMessageSquare, FiFileText } from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
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
  const [focusedField, setFocusedField] = useState(null);

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

  const inputClasses = (fieldName) => `
    w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300
    bg-dark/50 text-white
    placeholder:text-gray-500
    focus:outline-none focus:bg-dark
    ${errors[fieldName]
      ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
      : focusedField === fieldName
        ? 'border-primary focus:border-primary focus:ring-4 focus:ring-primary/10'
        : 'border-gray-700 hover:border-gray-600'
    }
  `;

  const iconClasses = (fieldName) => `
    absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300
    ${errors[fieldName]
      ? 'text-red-400'
      : focusedField === fieldName
        ? 'text-primary'
        : 'text-gray-500'
    }
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          {t('contact.form.name', language)} <span className="text-primary">*</span>
        </label>
        <div className="relative">
          <FiUser className={iconClasses('name')} size={18} />
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            className={inputClasses('name')}
            placeholder={isEnglish ? 'Your name' : 'Seu nome'}
          />
        </div>
        <AnimatePresence>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-2 text-sm text-red-500 flex items-center gap-1.5"
            >
              <FiAlertCircle size={14} />
              {errors.name}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          {t('contact.form.email', language)} <span className="text-primary">*</span>
        </label>
        <div className="relative">
          <FiMail className={iconClasses('email')} size={18} />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            className={inputClasses('email')}
            placeholder={isEnglish ? 'your.email@example.com' : 'seu.email@exemplo.com'}
          />
        </div>
        <AnimatePresence>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-2 text-sm text-red-500 flex items-center gap-1.5"
            >
              <FiAlertCircle size={14} />
              {errors.email}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Subject Field */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
          {t('contact.form.subject', language)} <span className="text-primary">*</span>
        </label>
        <div className="relative">
          <FiFileText className={iconClasses('subject')} size={18} />
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            onFocus={() => setFocusedField('subject')}
            onBlur={() => setFocusedField(null)}
            className={inputClasses('subject')}
            placeholder={isEnglish ? 'What is this about?' : 'Sobre o que é?'}
          />
        </div>
        <AnimatePresence>
          {errors.subject && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-2 text-sm text-red-500 flex items-center gap-1.5"
            >
              <FiAlertCircle size={14} />
              {errors.subject}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
          {t('contact.form.message', language)} <span className="text-primary">*</span>
        </label>
        <div className="relative">
          <FiMessageSquare className={`absolute left-4 top-4 transition-colors duration-300 ${
            errors.message
              ? 'text-red-400'
              : focusedField === 'message'
                ? 'text-primary'
                : 'text-gray-500'
          }`} size={18} />
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onFocus={() => setFocusedField('message')}
            onBlur={() => setFocusedField(null)}
            rows={5}
            className={`
              w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300
              bg-dark/50 text-white
              placeholder:text-gray-500
              focus:outline-none focus:bg-dark resize-none
              ${errors.message
                ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                : focusedField === 'message'
                  ? 'border-primary focus:border-primary focus:ring-4 focus:ring-primary/10'
                  : 'border-gray-700 hover:border-gray-600'
              }
            `}
            placeholder={isEnglish ? 'Your message...' : 'Sua mensagem...'}
          />
        </div>
        <AnimatePresence>
          {errors.message && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-2 text-sm text-red-500 flex items-center gap-1.5"
            >
              <FiAlertCircle size={14} />
              {errors.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="p-4 bg-green-900/20 border border-green-800 rounded-xl flex items-center gap-3"
          >
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-800/30">
              <FiCheck className="text-green-400" size={18} />
            </div>
            <p className="text-sm font-medium text-green-400">
              {t('contact.form.success', language)}
            </p>
          </motion.div>
        )}

        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="p-4 bg-red-900/20 border border-red-800 rounded-xl flex items-center gap-3"
          >
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-red-800/30">
              <FiAlertCircle className="text-red-400" size={18} />
            </div>
            <p className="text-sm font-medium text-red-400">
              {t('contact.form.error', language)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
        className={`
          w-full py-4 px-6 rounded-xl font-semibold text-white
          flex items-center justify-center gap-2.5
          transition-all duration-300
          ${isSubmitting
            ? 'bg-primary/70 cursor-not-allowed'
            : 'bg-primary hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25'
          }
        `}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>{t('contact.form.sending', language)}</span>
          </>
        ) : (
          <>
            <FiSend size={18} />
            <span>{t('contact.form.send', language)}</span>
          </>
        )}
      </motion.button>
    </form>
  );
}
