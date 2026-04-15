import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { saveResult } from '../hooks/useLocalStorage';
import { fireConfetti } from '../lib/confetti';
import { trackEvent } from '../lib/analytics';
import Button from '../components/ui/Button';
import type { BookRecommendation, RecommendationResponse } from '../types';
import recipients from '../i18n/recipients';

interface ResultsProps {
  results: RecommendationResponse;
  recipient: string;
  onShare: () => void;
  onRestart: () => void;
}

function BookCard({ book, index }: { book: BookRecommendation; index: number }) {
  const { t } = useLanguage();
  const [imgError, setImgError] = useState(false);

  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${book.title} ${book.author} llibreria comprar`)}`;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-cream-dark shadow-sm">
      <div className="flex gap-4 p-4">
        {/* Cover */}
        <div className="flex-shrink-0 w-[80px] h-[120px] rounded-xl overflow-hidden bg-cream flex items-center justify-center">
          {book.coverUrl && !imgError ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full bg-primary-light gap-1 px-2">
              <span className="text-[24px]">📚</span>
              <span className="text-[9px] text-text-muted text-center leading-tight">{book.title}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                #{index + 1}
              </span>
              <h3 className="font-playfair text-[16px] font-bold text-text leading-tight">
                {book.title}
              </h3>
              <p className="text-[12px] text-text-muted">{book.author}</p>
            </div>
            {book.priceEstimate && (
              <span className="text-[12px] font-bold text-gold bg-gold-light px-2 py-1 rounded-lg flex-shrink-0">
                {book.priceEstimate}€
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Synopsis + Why */}
      <div className="px-4 pb-4 flex flex-col gap-3">
        <p className="text-[13px] text-text-secondary leading-relaxed">{book.synopsis}</p>

        <div className="bg-primary-light rounded-xl p-3">
          <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
            {t('results_why_perfect')} ✨
          </p>
          <p className="text-[13px] text-text leading-relaxed">{book.whyPerfect}</p>
        </div>

        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] font-semibold text-primary hover:underline text-center block"
          onClick={() => trackEvent('search_bookstore', { title: book.title })}
        >
          {t('results_search')}
        </a>
      </div>
    </div>
  );
}

export default function Results({ results, recipient, onShare, onRestart }: ResultsProps) {
  const { language, t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Get recipient label
  const recipientOptions = recipients[language];
  const recipientLabel = recipientOptions.find(r => r.id === recipient)?.label ?? recipient;

  useEffect(() => {
    // Save to localStorage
    saveResult(results, recipientLabel);
    trackEvent('results_shown', { books: results.books.length.toString() });

    // Confetti + animation
    const timer = setTimeout(() => {
      setVisible(true);
      fireConfetti();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = () => {
    const el = sliderRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(index);
  };

  const scrollToIndex = (i: number) => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * i, behavior: 'smooth' });
  };

  return (
    <div className="min-h-dvh flex flex-col px-6 pt-8 pb-8 gap-4">
      {/* Header */}
      <div
        className={`text-center transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      >
        <span className="text-[10px] font-bold tracking-[2px] uppercase text-primary block mb-2">
          {t('results_label')}
        </span>
        <h1 className="font-playfair text-[28px] font-extrabold text-text leading-tight mb-1">
          {t('results_title')}
        </h1>
        <p className="text-text-secondary text-[14px]">
          {t('results_for')}{' '}
          <span className="font-semibold text-text">{recipientLabel}</span>
        </p>
      </div>

      {/* Slider */}
      <div
        className={`transition-all duration-500 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory -mx-6"
          style={{ scrollbarWidth: 'none' } as React.CSSProperties}
        >
          {results.books.map((book, i) => (
            <div key={i} className="snap-center flex-shrink-0 w-full px-6">
              <BookCard book={book} index={i} />
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 pt-4">
          {results.books.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-5 bg-primary' : 'w-2 bg-cream-dark'}`}
            />
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div
        className={`flex flex-col gap-3 transition-all duration-500 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <Button onClick={onShare} fullWidth>
          {t('results_share_btn')}
        </Button>
        <Button onClick={onRestart} variant="ghost" fullWidth>
          {t('restart')}
        </Button>
      </div>
    </div>
  );
}
