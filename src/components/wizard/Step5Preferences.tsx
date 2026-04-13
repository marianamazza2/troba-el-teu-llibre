import { useLanguage } from '../../hooks/useLanguage';
import ProgressBar from '../ui/ProgressBar';
import OptionButton from '../ui/OptionButton';
import Button from '../ui/Button';
import type { Language } from '../../types';

interface Step5Props {
  preferredLanguage: string;
  budget: string;
  onSetLanguage: (val: string) => void;
  onSetBudget: (val: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const LANG_OPTIONS: Record<Language, { id: string; label: string }[]> = {
  cat: [
    { id: 'catala',    label: 'Català'    },
    { id: 'castella',  label: 'Castellà'  },
    { id: 'angles',    label: 'Anglès'    },
    { id: 'tant_se_val', label: 'Tant se val' },
  ],
  es: [
    { id: 'catala',    label: 'Catalán'   },
    { id: 'castella',  label: 'Castellano'},
    { id: 'angles',    label: 'Inglés'    },
    { id: 'tant_se_val', label: 'Da igual' },
  ],
  en: [
    { id: 'catala',    label: 'Catalan'   },
    { id: 'castella',  label: 'Spanish'   },
    { id: 'angles',    label: 'English'   },
    { id: 'tant_se_val', label: 'Any'     },
  ],
};

const BUDGET_OPTIONS = [
  { id: 'menos15',   label: '< 15€'    },
  { id: '15_25',     label: '15-25€'   },
  { id: 'mas25',     label: '> 25€'    },
  { id: 'tant_se_val', label: '' }, // label set dynamically
];

export default function Step5Preferences({
  preferredLanguage,
  budget,
  onSetLanguage,
  onSetBudget,
  onSubmit,
  onBack,
}: Step5Props) {
  const { language, t } = useLanguage();
  const langOptions = LANG_OPTIONS[language];
  const budgetOptions = BUDGET_OPTIONS.map((b) =>
    b.id === 'tant_se_val' ? { ...b, label: t('tant_se_val') } : b
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 pt-8">
        <ProgressBar currentStep={4} />
      </div>

      <div className="flex-1 flex flex-col px-6 pb-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="font-playfair text-[28px] font-bold text-text leading-tight mb-1">
            {t('q5_title')}
          </h2>
          <p className="text-text-secondary text-[14px]">{t('q5_subtitle')}</p>
        </div>

        {/* Idioma preferit */}
        <div className="mb-7">
          <p className="text-[13px] font-bold text-text mb-3">{t('q5_language_label')}</p>
          <div className="flex gap-2">
            {langOptions.map((opt) => (
              <OptionButton
                key={opt.id}
                label={opt.label}
                selected={preferredLanguage === opt.id}
                onClick={() => onSetLanguage(opt.id)}
              />
            ))}
          </div>
        </div>

        {/* Pressupost */}
        <div className="mb-auto">
          <p className="text-[13px] font-bold text-text mb-3">{t('q5_budget_label')}</p>
          <div className="flex gap-2">
            {budgetOptions.map((opt) => (
              <OptionButton
                key={opt.id}
                label={opt.label}
                selected={budget === opt.id}
                onClick={() => onSetBudget(opt.id)}
              />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-8">
          <Button onClick={onSubmit} fullWidth>
            {t('btn_find')}
          </Button>
          <Button onClick={onBack} variant="ghost" fullWidth>
            {t('btn_back')}
          </Button>
        </div>
      </div>
    </div>
  );
}
