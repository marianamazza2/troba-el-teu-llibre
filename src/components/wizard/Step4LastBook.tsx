import { useLanguage } from '../../hooks/useLanguage';
import ProgressBar from '../ui/ProgressBar';
import Button from '../ui/Button';

interface Step4Props {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
}

export default function Step4LastBook({ value, onChange, onNext, onSkip, onBack }: Step4Props) {
  const { t } = useLanguage();

  return (
    <div className="min-h-dvh flex flex-col">
      <div className="px-6 pt-8">
        <ProgressBar currentStep={3} />
      </div>

      <div className="flex-1 flex flex-col px-6 pb-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="font-playfair text-[28px] font-bold text-text leading-tight mb-1">
            {t('q4_title')}
          </h2>
          <p className="text-text-secondary text-[14px]">{t('q4_subtitle')}</p>
        </div>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('q4_placeholder')}
          className="
            w-full rounded-2xl border-2 border-cream-dark bg-white
            px-4 py-3.5 text-base text-text
            placeholder:text-text-muted
            focus:outline-none focus:border-primary
            transition-colors duration-200
          "
        />

        {/* Skip link */}
        <button
          type="button"
          onClick={onSkip}
          className="mt-4 text-[13px] font-semibold text-primary cursor-pointer hover:underline self-start"
        >
          {t('q4_skip')}
        </button>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-auto pt-8">
          <Button onClick={onNext} fullWidth>
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
