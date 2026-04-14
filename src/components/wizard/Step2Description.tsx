import { useRef, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import ProgressBar from '../ui/ProgressBar';
import Button from '../ui/Button';

interface Step2Props {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
}

export default function Step2Description({ value, onChange, onNext, onBack, canProceed }: Step2Props) {
  const { t } = useLanguage();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <div className="min-h-dvh flex flex-col">
      <div className="px-6 pt-8">
        <ProgressBar currentStep={1} />
      </div>

      <div className="flex-1 flex flex-col px-6 pb-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="font-playfair text-[28px] font-bold text-text leading-tight mb-1">
            {t('q2_title')}
          </h2>
          <p className="text-text-secondary text-[14px]">{t('q2_subtitle')}</p>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('q2_placeholder')}
          rows={4}
          className="
            w-full rounded-2xl border-2 border-cream-dark bg-white
            px-4 py-3.5 text-base text-text leading-relaxed
            placeholder:text-text-muted resize-none
            focus:outline-none focus:border-primary
            transition-colors duration-200
            min-h-[120px]
          "
        />

        {/* Tip box */}
        <div className="mt-4 rounded-2xl border border-gold bg-gold-light px-4 py-3.5">
          <p className="text-[12px] font-bold text-gold mb-1">{t('q2_tip_title')}</p>
          <p className="text-[12px] text-gold leading-relaxed">{t('q2_tip')}</p>
        </div>

        {/* Char counter */}
        <p className={`mt-2 text-[11px] text-right ${value.length >= 10 ? 'text-green' : 'text-text-muted'}`}>
          {value.length} / 10 min
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-auto pt-8">
          <Button onClick={onNext} disabled={!canProceed} fullWidth>
            {t('btn_continue')}
          </Button>
          <Button onClick={onBack} variant="ghost" fullWidth>
            {t('btn_back')}
          </Button>
        </div>
      </div>
    </div>
  );
}
