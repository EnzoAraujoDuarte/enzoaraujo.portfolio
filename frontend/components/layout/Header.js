import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
          ? 'bg-ink/50 backdrop-blur-md border-b border-bone/[0.06]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="container">
        <div className="flex items-center justify-between h-16 tablet:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="relative z-10 font-display text-xl tablet:text-2xl font-semibold tracking-[-0.03em] group flex items-baseline gap-0.5"
          >
            <span className="text-bone">Enzo</span>
            <span className="text-ash transition-colors duration-300 group-hover:text-bone/70">
              Araujo
            </span>
            <span className="h-1 w-1 rounded-full bg-ember transition-transform duration-500 group-hover:scale-150" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden tablet:flex items-center gap-1 laptop:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex min-h-[44px] items-center px-4 font-mono text-[11px] uppercase tracking-meta transition-colors duration-300 group ${
                  isActive(item.href) ? 'text-bone' : 'text-ash hover:text-bone'
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
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-ember rounded-full transition-all duration-300 ${
                    isActive(item.href)
                      ? 'w-6'
                      : 'w-0 group-hover:w-4 group-hover:bg-ash'
                  }`}
                />
              </Link>
            ))}

            {/* Separador */}
            <div className="w-px h-5 bg-bone/15 mx-2" />

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-ash hover:text-bone transition-colors duration-300 rounded-lg hover:bg-bone/[0.04]"
              aria-label={`Switch to ${languageText}`}
            >
              <FiGlobe className="w-4 h-4" />
              <span>{languageText}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="tablet:hidden relative z-10 p-2 text-bone/80 hover:text-bone transition-colors duration-300"
            onClick={toggleMenu}
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            <span
              className={`block transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile navigation — always mounted so both directions transition;
          presence trees were the only thing framer-motion was still doing here. */}
      <div
        aria-hidden={!isOpen}
        onClick={() => setIsOpen(false)}
        className={`tablet:hidden fixed inset-0 top-16 bg-ink/70 backdrop-blur-sm transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        className={`tablet:hidden absolute top-full left-0 right-0 origin-top border-t border-bone/10 bg-ink/95 backdrop-blur-lg transition-[opacity,transform] duration-200 ease-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <div className="container py-4">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                tabIndex={isOpen ? 0 : -1}
                className={`flex min-h-[44px] items-center rounded-lg px-4 py-3 text-base font-medium transition-colors duration-300 ${
                  isActive(item.href)
                    ? 'text-ember bg-ember/10'
                    : 'text-bone/80 hover:text-bone hover:bg-bone/[0.04]'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-ember" />
                )}
              </Link>
            ))}

            <div className="mx-4 my-2 h-px bg-bone/10" />

            <button
              type="button"
              tabIndex={isOpen ? 0 : -1}
              onClick={() => {
                toggleLanguage();
                setIsOpen(false);
              }}
              className="flex min-h-[44px] w-full items-center rounded-lg px-4 py-3 text-base font-medium text-bone/80 transition-colors duration-300 hover:bg-bone/[0.04] hover:text-bone"
              aria-label={`Switch to ${languageText}`}
            >
              <FiGlobe className="mr-3 h-5 w-5" />
              <span>{language === 'pt-BR' ? 'English' : 'Português'}</span>
            </button>
          </div>
        </div>
      </div>

    </header>
  );
}
