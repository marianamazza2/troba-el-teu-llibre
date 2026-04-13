import { useLanguage } from '../../hooks/useLanguage';
import genres from '../../i18n/genres';
import ProgressBar from '../ui/ProgressBar';
import SelectChip from '../ui/SelectChip';
import Button from '../ui/Button';

interface Step3Props {
  selected: string[];
  onToggle: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
}

export default function Step3Genres({ selected, onToggle, onNext, onBack, canProceed }: Step3Props) {
  const { language, t } = useLanguage();
  const options = genres[language];

  const countLabel =
    selected.length === 1
      ? `1 ${t('q3_count_one')}`
      : `${selected.length} ${t('q3_count_many')}`;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 pt-8">
        <ProgressBar currentStep={2} />
      </div>

      <div className="flex-1 flex flex-col px-6 pb-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="font-playfair text-[28px] font-bold text-text leading-tight mb-1">
            {t('q3_title')}
          </h2>
          <p className="text-text-secondary text-[14px]">{t('q3_subtitle')}</p>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {options.map((g) => (
            <SelectChip
              key={g.id}
              emoji={g.emoji}
              label={g.label}
              selected={selected.includes(g.id)}
              onClick={() => onToggle(g.id)}
            />
          ))}
        </div>

        {/* Contador */}
        {selected.length > 0 && (
          <p className="text-[12px] font-semibold text-primary">{countLabel}</p>
        )}

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
