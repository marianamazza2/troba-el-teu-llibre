import { useLanguage } from '../../hooks/useLanguage';
import recipients from '../../i18n/recipients';
import ProgressBar from '../ui/ProgressBar';
import SelectCard from '../ui/SelectCard';
import Button from '../ui/Button';

interface Step1Props {
  selected: string | null;
  onSelect: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
}

export default function Step1Recipient({ selected, onSelect, onNext, onBack, canProceed }: Step1Props) {
  const { language, t } = useLanguage();
  const options = recipients[language];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 pt-8">
        <ProgressBar currentStep={0} />
      </div>

      <div className="flex-1 flex flex-col px-6 pb-8">
        {/* Header */}
        <div className="mb-7">
          <h2 className="font-playfair text-[28px] font-bold text-text leading-tight mb-1">
            {t('q1_title')}
          </h2>
          <p className="text-text-secondary text-[14px]">{t('q1_subtitle')}</p>
        </div>

        {/* Grid de recipientes */}
        <div className="grid grid-cols-2 gap-3 mb-auto">
          {options.map((r) => (
            <SelectCard
              key={r.id}
              emoji={r.emoji}
              label={r.label}
              selected={selected === r.id}
              onClick={() => onSelect(r.id)}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-8">
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
