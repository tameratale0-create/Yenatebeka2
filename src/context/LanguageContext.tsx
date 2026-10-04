import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, UI_TRANSLATIONS } from '../data/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  isAmharic: boolean;
  isOromo: boolean;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('ytb_language');
      if (saved === 'am' || saved === 'om' || saved === 'en') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'am';
  });

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('ytb_language', newLang);
      document.documentElement.lang = newLang;
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const entry = UI_TRANSLATIONS[key];
    if (entry && entry[language]) {
      return entry[language];
    }
    if (entry && entry.am) {
      return entry.am;
    }
    return fallback || key;
  };

  const isAmharic = language === 'am';
  const isOromo = language === 'om';
  const isEnglish = language === 'en';

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isAmharic,
        isOromo,
        isEnglish,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
