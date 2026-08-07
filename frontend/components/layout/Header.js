import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiGlobe } from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../locales/translations';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  const languageText = language === 'pt-BR' ? 'EN' : 'PT';

  // Detectar scroll para efeito sutil de backdrop
  useEffect(() => {
    let frame = null;

    const handleScroll = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        frame = null;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  // Fechar menu ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = useMemo(() => [
    { name: t('nav.home', language), href: '/' },
    { name: t('nav.about', language), href: '/about' },
    { name: t('nav.blog', language), href: '/blog' },
    { name: t('nav.contact', language), href: '/contact' },
  ], [language]);

  const isActive = (href) =>
    href === '/' ? router.pathname === href : router.pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/20 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="container">
        <div className="flex items-center justify-between h-16 tablet:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="relative z-10 font-display text-xl tablet:text-2xl font-bold tracking-[-0.02em] group flex items-center"
          >
            <span className="text-primary transition-colors duration-300 group-hover:text-primary-light">
              Enzo
            </span>
            <span className="text-white/90 transition-colors duration-300 group-hover:text-white">
              .dev
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden tablet:flex items-center gap-1 laptop:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 text-sm laptop:text-base font-medium transition-all duration-300 rounded-lg group ${
                  isActive(item.href)
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {/* Clipped swap: the label slides out while its twin slides in */}
                <span className="relative block overflow-hidden">
                  <span className="block transition-transform duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
                    {item.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 block translate-y-full transition-transform duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
                  >
                    {item.name}
                  </span>
                </span>

                {/* Indicador de página ativa */}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-300 ${
                    isActive(item.href)
                      ? 'w-6'
                      : 'w-0 group-hover:w-4 group-hover:bg-white/50'
                  }`}
                />
              </Link>
            ))}

            {/* Separador */}
            <div className="w-px h-5 bg-white/20 mx-2" />

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5"
              aria-label={`Switch to ${languageText}`}
            >
              <FiGlobe className="w-4 h-4" />
              <span>{languageText}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="tablet:hidden relative z-10 p-2 text-white/80 hover:text-white transition-colors duration-300"
            onClick={toggleMenu}
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.div>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="tablet:hidden fixed inset-0 top-16 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="tablet:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-white/10"
            >
              <div className="container py-4">
                <div className="flex flex-col gap-1">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                          isActive(item.href)
                            ? 'text-primary bg-primary/10'
                            : 'text-white/80 hover:text-white hover:bg-white/5'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                        {isActive(item.href) && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </Link>
                    </motion.div>
                  ))}

                  {/* Divider */}
                  <div className="h-px bg-white/10 my-2 mx-4" />

                  {/* Language Toggle */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.05 }}
                  >
                    <button
                      onClick={() => {
                        toggleLanguage();
                        setIsOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-base font-medium text-white/80 hover:text-white rounded-lg transition-all duration-300 hover:bg-white/5"
                      aria-label={`Switch to ${languageText}`}
                    >
                      <FiGlobe className="w-5 h-5 mr-3" />
                      <span>{language === 'pt-BR' ? 'English' : 'Português'}</span>
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
