import React from 'react';

const languages = [
  { code: 'az', label: 'Azərbaycanca' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'tr', label: 'Türkçe' }
];

export default function TranslationTabs({ activeLang, onLangChange, children }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-1 p-1 bg-neutral-100 rounded-xl w-fit">
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => onLangChange(lang.code)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeLang === lang.code
                ? "bg-white text-primary shadow-sm"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
