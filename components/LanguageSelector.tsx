'use client';

import { useState, useEffect } from 'react';
import { LANGUAGES, Language } from '@/lib/i18n';

export default function LanguageSelector() {
  const [lang, setLang] = useState<Language>('en');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('language') as Language;
      if (stored && stored in LANGUAGES) setLang(stored);
    } catch (e) {
      console.warn('Could not read language preference from localStorage:', e);
    }
  }, []);

  const handleSelect = (l: Language) => {
    setLang(l);
    setOpen(false);
    try {
      localStorage.setItem('language', l);
    } catch (e) {
      console.warn('Could not save language preference to localStorage:', e);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Select language"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white transition-colors"
      >
        🌐 {LANGUAGES[lang]}
        <span className="text-slate-400">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 backdrop-blur-xl bg-[#0A0E1A]/95 border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
          {(Object.entries(LANGUAGES) as [Language, string][]).map(([code, name]) => (
            <button
              key={code}
              onClick={() => handleSelect(code)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-white/10 ${lang === code ? 'text-cyan-400' : 'text-white'}`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
