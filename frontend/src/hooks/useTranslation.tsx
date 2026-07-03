'use client';

import { useState, useCallback, createContext, useContext, useEffect } from 'react';
import en from '../i18n/en.json';
import hi from '../i18n/hi.json';

type Language = 'en' | 'hi';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TranslationDict = Record<string, any>;

const TRANSLATIONS: Record<Language, TranslationDict> = { en, hi };
const SUPPORTED_LANGS: { code: Language; label: string; nativeName: string }[] = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिंदी' },
];

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  supportedLangs: typeof SUPPORTED_LANGS;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const stored = localStorage.getItem('hs_lang') as Language | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored && TRANSLATIONS[stored]) setLangState(stored);
  }, []);

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    localStorage.setItem('hs_lang', l);
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const parts = key.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let result: any = TRANSLATIONS[lang];
      for (const part of parts) {
        if (result == null) break;
        result = result[part];
      }
      if (result == null) {
        // Fall back to English
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let enResult: any = TRANSLATIONS['en'];
        for (const part of parts) {
          if (enResult == null) break;
          enResult = enResult[part];
        }
        return enResult ?? fallback ?? key;
      }
      return String(result);
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t, supportedLangs: SUPPORTED_LANGS }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation(): I18nContextType {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used inside I18nProvider');
  return ctx;
}

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang, supportedLangs } = useTranslation();

  return (
    <div className={`flex items-center gap-1 ${className}`} role="group" aria-label="Language selector">
      {supportedLangs.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          aria-label={`Switch to ${l.label}`}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            lang === l.code
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {l.nativeName}
        </button>
      ))}
    </div>
  );
}
