import { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { trackEvent } from '../lib/analytics';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import type { BookRecommendation } from '../types';

interface ShareProps {
  books: BookRecommendation[];
  recipient: string;
  onRestart: () => void;
}

export default function Share({ books, recipient, onRestart }: ShareProps) {
  const { t } = useLanguage();
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const shareUrl = window.location.origin;

  const shareText =
    `📚 He trobat 3 llibres perfectes per a ${recipient} gràcies a la IA!\n` +
    books.slice(0, 3).map((b, i) => `${i + 1}. "${b.title}" de ${b.author}`).join('\n') +
    `\n\nTroba el teu: ${shareUrl}`;

  const handleWhatsApp = () => {
    trackEvent('share_whatsapp');
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setToastMsg(t('share_copied'));
      setToastVisible(true);
      trackEvent('share_copy_link');
    } catch {
      // ignore
    }
  };

  const handleInstagram = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setToastMsg(t('share_instagram_toast'));
      setToastVisible(true);
      trackEvent('share_instagram');
    } catch {
      // ignore
    }
  };

  return (
    <div className="h-dvh flex flex-col overflow-y-auto px-6 py-8">
      <Toast
        message={toastMsg}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />

      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-[48px] block mb-3">🌹</span>
        <h1 className="font-playfair text-[28px] font-extrabold text-text leading-tight mb-2">
          {t('share_title')}
        </h1>
        <p className="text-text-secondary text-[14px] leading-relaxed">
          {t('share_subtitle')}
        </p>
      </div>

      {/* Share buttons */}
      <div className="flex flex-col gap-3 mb-8">
        <button
          type="button"
          onClick={handleWhatsApp}
          className="
            w-full bg-[#25D366] text-white font-bold text-[15px]
            rounded-xl py-[14px] px-6 cursor-pointer
            active:scale-[0.98] transition-transform
            flex items-center justify-center gap-2
          "
        >
          <span>💬</span> {t('share_whatsapp')}
        </button>

        <button
          type="button"
          onClick={handleInstagram}
          className="
            w-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045]
            text-white font-bold text-[15px]
            rounded-xl py-[14px] px-6 cursor-pointer
            active:scale-[0.98] transition-transform
            flex items-center justify-center gap-2
          "
        >
          <span>📷</span> {t('share_instagram')}
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="
            w-full bg-cream border-2 border-cream-dark text-text-secondary font-bold text-[15px]
            rounded-xl py-[14px] px-6 cursor-pointer
            hover:border-primary hover:text-primary transition-colors
            flex items-center justify-center gap-2
          "
        >
          <span>🔗</span> {t('share_copy')}
        </button>
      </div>

      {/* Follow CTA */}
      <div className="bg-white rounded-2xl border border-cream-dark p-5 mb-6">
        <p className="font-playfair text-[18px] font-bold text-text text-center mb-1">
          {t('follow_title')}
        </p>
        <p className="text-[13px] text-text-secondary text-center mb-4">
          {t('follow_subtitle')}
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="w-full bg-cream rounded-xl py-3 text-[13px] font-semibold text-text-secondary hover:bg-cream-dark transition-colors cursor-pointer"
            onClick={() => { trackEvent('follow_instagram'); window.open('https://www.instagram.com/mazzmkt', '_blank'); }}
          >
            {t('follow_instagram')}
          </button>
          <button
            type="button"
            className="w-full bg-cream rounded-xl py-3 text-[13px] font-semibold text-text-secondary hover:bg-cream-dark transition-colors cursor-pointer"
            onClick={() => trackEvent('follow_google')}
          >
            {t('follow_google')}
          </button>
        </div>
      </div>

      {/* Restart */}
      <Button onClick={onRestart} variant="ghost" fullWidth>
        {t('restart')}
      </Button>
    </div>
  );
}
