'use client';

import { useState, useEffect } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

// Theme constants
const THEMES = {
  DARK: 'dark',
  LIGHT: 'light'
};

/**
 * Theme toggle component for switching between light and dark modes
 * Persists theme preference in localStorage
 * @returns {JSX.Element} Theme toggle button
 */
export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // On component mount, set the theme based on localStorage or default to dark
    const savedTheme = localStorage.getItem('theme') || THEMES.DARK;
    const shouldUseDarkMode = savedTheme === THEMES.DARK;
    
    setIsDarkMode(shouldUseDarkMode);
    applyThemeToDocument(shouldUseDarkMode);
  }, []);

  /**
   * Apply theme to document by toggling dark class
   * @param {boolean} isDark - Whether to apply dark mode
   */
  const applyThemeToDocument = (isDark) => {
    document.documentElement.classList.toggle(THEMES.DARK, isDark);
  };

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    applyThemeToDocument(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? THEMES.DARK : THEMES.LIGHT);
  };

  const buttonAriaLabel = isDarkMode ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-dark-secondary hover:bg-gray-300 dark:hover:bg-dark-lighter transition-colors focus:outline-none"
      aria-label={buttonAriaLabel}
    >
      {isDarkMode ? (
        <FiSun className="text-white" size={18} />
      ) : (
        <FiMoon className="text-gray-700" size={18} />
      )}
    </button>
  );
} 