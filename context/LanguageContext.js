import { createContext, useState, useContext, useEffect } from 'react';

// Constants for supported languages
export const LANGUAGES = {
  ENGLISH: 'en-US',
  PORTUGUESE: 'pt-BR'
};

// Create the language context
const LanguageContext = createContext();

/**
 * Provider component that manages language state for the application
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(LANGUAGES.ENGLISH);

  // Initialize language from localStorage or browser preferences
  useEffect(() => {
    try {
      // Check if there's a saved preference
      const savedLanguage = localStorage.getItem('language');
      
      if (savedLanguage && Object.values(LANGUAGES).includes(savedLanguage)) {
        setLanguage(savedLanguage);
        return;
      }
      
      // If no valid saved preference, try to detect browser language
      const browserLang = navigator.language;
      if (browserLang && browserLang.startsWith('pt')) {
        setLanguage(LANGUAGES.PORTUGUESE);
      }
    } catch (error) {
      // Fallback to English in case of errors
      console.warn('Error setting language:', error);
    }
  }, []);

  /**
   * Toggle between English and Portuguese languages
   */
  const toggleLanguage = () => {
    const newLanguage = language === LANGUAGES.PORTUGUESE 
      ? LANGUAGES.ENGLISH 
      : LANGUAGES.PORTUGUESE;
    
    setLanguage(newLanguage);
    try {
      localStorage.setItem('language', newLanguage);
    } catch (error) {
      console.warn('Error saving language preference:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Custom hook to access the language context
 * @returns {Object} Language context with current language and toggle function
 */
export function useLanguage() {
  return useContext(LanguageContext);
} 