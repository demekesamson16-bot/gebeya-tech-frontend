import { createContext, useContext, useEffect, useState } from 'react';
import { translations, translate } from './i18n';

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

const STORAGE_KEY = 'gebeya_lang';

/**
 * Detects the initial language:
 * 1. Saved preference in localStorage
 * 2. Telegram user's language_code (if 'am')
 * 3. Falls back to 'en'
 */
function detectLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'am') return saved;
  } catch {}

  try {
    const tgLang = window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code;
    if (tgLang && tgLang.toLowerCase().startsWith('am')) return 'am';
  } catch {}

  return 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectLanguage);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  }, [lang]);

  // Set the html lang attribute (accessibility + CSS)
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (next) => {
    if (next === 'en' || next === 'am') setLangState(next);
  };

  const t = (key) => translate(lang, key);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
