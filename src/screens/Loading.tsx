import { useEffect, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import Button from '../components/ui/Button';

interface LoadingProps {
  onError?: () => void;
  error: string | null;
  onRetry: () => void;
}

const LOADING_KEYS = ['loading_1', 'loading_2', 'loading_3'];

export default function Loading({ error, onRetry }: LoadingProps) {
  const { t } = useLanguage();
  const [textIndex, setTextIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [dots, setDots] = useState(0);

  // Texto rotativo cada 2s
  useEffect(() => {
    if (error) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setTextIndex((i) => (i + 1) % LOADING_KEYS.length);
        setFade(true);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, [error]);

  // Dots secuenciales cada 400ms
  useEffect(() => {
    if (error) return;
    const interval = setInterval(() => {
      setDots((d) => (d + 1) % 4);
    }, 400);
    return () => clearInterval(interval);
  }, [error]);

  if (error) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center px-6 text-center gap-6">
        <span className="text-[56px]">😔</span>
        <p className="text-text-secondary text-[15px] leading-relaxed">{error}</p>
        <Button onClick={onRetry} fullWidth>
          {t('btn_retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col items-center justify-center px-6 text-center gap-8">
      {/* Rosa pulsante */}
      <span
        className="text-[64px] block select-none"
        style={{ animation: 'pulse-scale 1.5s ease-in-out infinite' }}
      >
        🌹
      </span>

      {/* Texto rotativo */}
      <p
        className="text-text-secondary text-[15px] font-medium transition-opacity duration-300"
        style={{ opacity: fade ? 1 : 0 }}
      >
        {t(LOADING_KEYS[textIndex])}
      </p>

      {/* Dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${dots > i ? 'bg-primary scale-110' : 'bg-cream-dark'}
            `}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
