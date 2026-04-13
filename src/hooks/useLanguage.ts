import { createContext, useContext, useState } from 'react';
import type { Language } from '../types';
import translations from '../i18n/translations';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextValue>({
  language: 'cat',
  setLanguage: () => {},
  t: (key) => key,
});

function detectBrowserLanguage(): Language {
  const lang = navigator.language?.toLowerCase() ?? '';
  if (lang.startsWith('ca')) return 'cat';
  if (lang.startsWith('es')) return 'es';
  return 'en';
}

export function useLanguageState() {
  const [language, setLanguage] = useState<Language>(detectBrowserLanguage);

  const t = (key: string): string => {
    return translations[language][key] ?? translations['cat'][key] ?? key;
  };

  return { language, setLanguage, t };
}

export function useLanguage() {
  return useContext(LanguageContext);
}
