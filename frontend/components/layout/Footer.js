import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowUpRight, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

import { useLanguage } from '../../hooks/useLanguage';
import { t } from '../../locales/translations';
import { EASE, DURATION, viewportOnce } from '../../lib/motion';

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/EnzoAraujoDuarte', Icon: FiGithub },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/enzo-araujo-duarte/', Icon: FiLinkedin },
  { label: 'Email', href: 'mailto:araujoduarteenzo@gmail.com', Icon: FiMail },
];

export default function Footer() {
  const { language } = useLanguage();
  const isEnglish = language === 'en-US';

  const navLinks = [
    { name: t('nav.home', language), href: '/' },
    { name: t('nav.about', language), href: '/about' },
    { name: t('nav.blog', language), href: '/blog' },
    { name: t('nav.contact', language), href: '/contact' },
  ];

  return (
    <footer className="relative border-t border-white/[0.07] bg-dark">
      <div className="container pt-20 tablet:pt-28 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.base, ease: EASE.out }}
          className="grid grid-cols-1 laptop:grid-cols-[minmax(0,1fr)_auto] gap-12 laptop:gap-20"
        >
          <div>
            <p className="font-display text-xs font-medium uppercase tracking-[0.28em] text-primary mb-6">
              {t('footer.eyebrow', language)}
            </p>

            <Link href="/contact" className="group inline-block">
              <h2 className="font-display text-4xl tablet:text-5xl laptop:text-6xl font-bold text-white leading-[0.98] tracking-[-0.04em] text-balance">
                {t('footer.title', language)}
              </h2>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                {t('footer.cta', language)}
                <FiArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </div>

          <nav className="flex flex-col gap-10 largemobile:flex-row laptop:flex-col laptop:gap-12 largemobile:gap-16">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">
                {isEnglish ? 'Navigate' : 'Navegar'}
              </p>
              <ul className="space-y-2.5">
                {navLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">
                {isEnglish ? 'Elsewhere' : 'Onde me achar'}
              </p>
              <ul className="space-y-2.5">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                      <FiArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </motion.div>

        <div className="mt-16 tablet:mt-20 pt-8 border-t border-white/[0.06] flex flex-col largemobile:flex-row largemobile:items-center largemobile:justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Enzo Araujo Duarte
          </p>
          <p className="text-xs text-gray-600">{t('footer.builtWith', language)}</p>
        </div>
      </div>
    </footer>
  );
}
