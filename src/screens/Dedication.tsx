import { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { trackEvent } from '../lib/analytics';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import recipients from '../i18n/recipients';

interface DedicationProps {
  dedication: string;
  recipient: string;
  onBack: () => void;
  onShare: () => void;
}

export default function Dedication({ dedication, recipient, onBack, onShare }: DedicationProps) {
  const { language, t } = useLanguage();
  const [text, setText] = useState(dedication);
  const [editing, setEditing] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const recipientOptions = recipients[language];
  const recipientLabel = recipientOptions.find(r => r.id === recipient)?.label ?? recipient;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setToastVisible(true);
      trackEvent('dedication_copy');
    } catch {
      // fallback: select text
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      <Toast
        message={t('dedication_copied')}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />

      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-[10px] font-bold tracking-[2px] uppercase text-primary block mb-2">
          {t('dedication_sub')} {recipientLabel}
        </span>
        <h1 className="font-playfair text-[28px] font-extrabold text-text leading-tight">
          {t('dedication_title')}
        </h1>
      </div>

      {/* Dedication card */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white rounded-2xl border border-cream-dark shadow-sm p-6 mb-6 relative">
          <span className="text-[32px] absolute -top-4 left-1/2 -translate-x-1/2">🌹</span>
          <div className="pt-4">
            {editing ? (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="
                  w-full min-h-[160px] resize-none bg-transparent
                  font-caveat text-[20px] text-text leading-relaxed
                  outline-none border-b-2 border-primary
                "
                autoFocus
              />
            ) : (
              <p className="font-caveat text-[22px] text-text leading-relaxed whitespace-pre-wrap text-center">
                {text}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 bg-cream rounded-xl py-3 text-[13px] font-semibold text-text-secondary hover:bg-cream-dark transition-colors cursor-pointer"
          >
            {t('dedication_copy')}
          </button>
          <button
            type="button"
            onClick={() => {
              if (editing) {
                trackEvent('dedication_edit_save');
              }
              setEditing(!editing);
            }}
            className="flex-1 bg-cream rounded-xl py-3 text-[13px] font-semibold text-text-secondary hover:bg-cream-dark transition-colors cursor-pointer"
          >
            {editing ? t('dedication_done') : t('dedication_edit')}
          </button>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          <Button onClick={onShare} fullWidth>
            {t('dedication_share')}
          </Button>
          <Button onClick={onBack} variant="ghost" fullWidth>
            {t('dedication_back')}
          </Button>
        </div>
      </div>
    </div>
  );
}
