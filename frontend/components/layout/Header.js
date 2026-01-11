import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiGlobe } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../locales/translations';

export default function Header({ isTransparent = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  const toggleMenu = () => setIsOpen(!isOpen);

  const languageText = language === 'pt-BR' ? 'EN-US' : 'PT-BR';

  const navItems = useMemo(() => [
    { name: t('nav.home', language), href: '/' },
    { name: t('nav.about', language), href: '/about' },
    { name: t('nav.contact', language), href: '/contact' },
  ], [language]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${isTransparent ? 'bg-transparent' : 'bg-white/95 dark:bg-dark/95 backdrop-blur-sm'}`}>
      <div className="container flex items-center justify-between h-20 ultrawide:h-24 4k:h-28">
        {/* Logo */}
        <Link href="/" className="text-2xl ultrawide:text-3xl 4k:text-4xl font-bold text-white group">
          <span className="text-primary group-hover:text-primary-light transition-colors">Enzo</span>
          <span className="text-white/90">.dev</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden tablet:flex items-center space-x-10 ultrawide:space-x-12 4k:space-x-16">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-base ultrawide:text-lg 4k:text-xl text-white/80 hover:text-white font-medium transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 4k:h-1 bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
          ))}

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center text-base ultrawide:text-lg 4k:text-xl text-white/80 hover:text-white font-medium transition-colors px-3 py-1.5 ultrawide:px-4 ultrawide:py-2 4k:px-5 4k:py-2.5 rounded-full border border-white/20 hover:border-primary hover:bg-primary/10"
            aria-label={`Switch to ${languageText}`}
          >
            <FiGlobe className="mr-2 w-4 h-4 ultrawide:w-5 ultrawide:h-5 4k:w-6 4k:h-6" />
            <span className="text-sm ultrawide:text-base 4k:text-lg">{languageText}</span>
          </button>
        </nav>

        {/* Mobile Menu Controls */}
        <div className="flex items-center tablet:hidden">
          <button
            className="text-white p-2 focus:outline-none"
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="tablet:hidden bg-black/95 backdrop-blur-lg border-t border-white/10"
          >
            <div className="container py-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-3 text-lg text-white/80 hover:text-primary font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Language Toggle */}
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsOpen(false);
                }}
                className="flex items-center py-3 text-lg text-white/80 hover:text-primary font-medium"
                aria-label={`Switch to ${languageText}`}
              >
                <FiGlobe className="mr-2" />
                <span>{languageText}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
