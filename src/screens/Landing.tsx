import { useEffect, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { getSavedResults, relativeTime } from '../hooks/useLocalStorage';
import Button from '../components/ui/Button';
import type { Language, SavedResult } from '../types';

interface LandingProps {
  onStart: () => void;
}

const LANGS: { id: Language; label: string }[] = [
  { id: 'cat', label: 'CAT' },
  { id: 'es',  label: 'ES'  },
  { id: 'en',  label: 'EN'  },
];

export default function Landing({ onStart }: LandingProps) {
  const { language, setLanguage, t } = useLanguage();
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setSavedResults(getSavedResults());
    // Entrada con escala
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-dvh flex flex-col px-6 pt-8 pb-safe">
      {/* Language selector */}
      <div className="flex justify-end mb-6">
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-cream-dark">
          {LANGS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setLanguage(id)}
              className={`
                px-3 py-1.5 rounded-lg text-[12px] font-bold cursor-pointer
                transition-all duration-200
                ${language === id
                  ? 'bg-primary text-white'
                  : 'text-text-muted hover:text-text'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
        <div
          className={`
            transition-all duration-500
            ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
          `}
        >
          <span className="text-[72px] block leading-none select-none">🌹</span>
        </div>

        <div
          className={`
            flex flex-col gap-3 transition-all duration-500 delay-100
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          <span className="text-[11px] font-bold tracking-[2px] uppercase text-primary">
            {t('hero_label')}
          </span>
          <h1
            className="font-playfair text-[42px] font-extrabold leading-[1.1] text-text whitespace-pre-line"
          >
            {t('hero_title')}
          </h1>
          <p className="text-text-secondary text-[15px] leading-relaxed whitespace-pre-line max-w-[300px] mx-auto">
            {t('hero_subtitle')}
            <a
              href="https://www.instagram.com/mazzmkt"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline"
            >
              mazzmkt
            </a>
            {t('hero_subtitle_after')}
          </p>
        </div>

        <div
          className={`
            w-full max-w-[320px] transition-all duration-500 delay-200
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          <Button onClick={onStart} fullWidth>
            {t('cta_main')}
          </Button>
        </div>

        {/* Previous results */}
        {savedResults.length > 0 && (
          <div
            className={`
              w-full transition-all duration-500 delay-300
              ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            <p className="text-[12px] font-semibold text-text-muted mb-3 text-center uppercase tracking-wide">
              {t('previous_results')}
            </p>
            <div className="flex flex-col gap-2">
              {savedResults.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-xl px-4 py-3 border border-cream-dark flex items-center justify-between"
                >
                  <div>
                    <p className="text-[13px] font-semibold text-text">{r.recipient}</p>
                    <p className="text-[11px] text-text-muted">{r.books[0]?.title}</p>
                  </div>
                  <span className="text-[11px] text-text-muted">
                    {relativeTime(r.timestamp, language)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-8 flex flex-col gap-1">
        <p className="text-[11px] text-text-muted">
          {t('footer_credit')}{' '}
          <a
            href="https://www.instagram.com/mazzmkt"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline text-text-secondary"
          >
            mazzmkt
          </a>
        </p>
        <a
          href="https://wa.me/34673337621"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-primary font-semibold hover:underline"
        >
          {t('footer_cta')}
        </a>
      </div>
    </div>
  );
}
