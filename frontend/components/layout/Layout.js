'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';

export default function Layout({ children, isHomePage = false, hideHeaderOnDesktop = false, onHeaderToggle }) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;
    
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const shouldShowHeader = !hideHeaderOnDesktop || isHeaderVisible || (mounted && !isDesktop);

  const handleToggle = () => {
    const newState = !isHeaderVisible;
    setIsHeaderVisible(newState);
    if (onHeaderToggle) {
      onHeaderToggle(newState);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-dark">
      <AnimatePresence>
        {shouldShowHeader && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50"
          >
            <Header isTransparent={isHomePage || (hideHeaderOnDesktop && isHeaderVisible)} />
          </motion.div>
        )}
      </AnimatePresence>
      {hideHeaderOnDesktop && (
        <button
          onClick={handleToggle}
          className="hidden desktop:flex fixed top-0 left-1/2 -translate-x-1/2 z-[60] p-3 bg-primary/90 hover:bg-primary text-white rounded-b-xl shadow-lg transition-all duration-300 items-center justify-center group"
          aria-label={isHeaderVisible ? 'Ocultar menu' : 'Mostrar menu'}
        >
          <svg
            className={`w-6 h-6 transition-transform duration-300 ${isHeaderVisible ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
      <main className={`flex-grow ${isHomePage ? '' : ''}`}>
        {children}
      </main>
    </div>
  );
} 