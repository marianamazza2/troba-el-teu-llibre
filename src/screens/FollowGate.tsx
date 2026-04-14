import { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { trackEvent } from '../lib/analytics';

const INSTAGRAM_URL = 'https://www.instagram.com/mazzmkt';

interface FollowGateProps {
  onContinue: () => void;
}

export default function FollowGate({ onContinue }: FollowGateProps) {
  const { t } = useLanguage();
  const [followed, setFollowed] = useState(false);

  const handleFollow = () => {
    trackEvent('follow_instagram_gate');
    window.open(INSTAGRAM_URL, '_blank');
    setFollowed(true);
  };

  const handleSkip = () => {
    trackEvent('follow_gate_skip');
    onContinue();
  };

  const handleContinueAfterFollow = () => {
    trackEvent('follow_gate_continue_after_follow');
    onContinue();
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] flex items-center justify-center mb-6 shadow-lg">
        <span className="text-[36px]">📷</span>
      </div>

      {/* Text */}
      <h1 className="font-playfair text-[26px] font-extrabold text-text text-center leading-tight mb-3">
        {t('follow_gate_title')}
      </h1>
      <p className="text-text-secondary text-[15px] text-center leading-relaxed max-w-[300px] mb-2">
        {t('follow_gate_subtitle')}
      </p>
      <p className="text-[13px] font-bold text-primary text-center mb-8">
        @mazzmkt
      </p>

      {/* Primary CTA */}
      {!followed ? (
        <button
          type="button"
          onClick={handleFollow}
          className="
            w-full max-w-[320px]
            bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045]
            text-white font-bold text-[16px]
            rounded-2xl py-4 px-6 cursor-pointer
            active:scale-[0.98] transition-transform
            flex items-center justify-center gap-3
            shadow-md mb-4
          "
        >
          <span className="text-[20px]">📷</span>
          {t('follow_gate_cta')}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleContinueAfterFollow}
          className="
            w-full max-w-[320px]
            bg-primary text-white font-bold text-[16px]
            rounded-2xl py-4 px-6 cursor-pointer
            active:scale-[0.98] transition-transform
            flex items-center justify-center gap-3
            shadow-md mb-4
          "
        >
          <span className="text-[20px]">✓</span>
          {t('follow_gate_followed')}
        </button>
      )}

      {/* Skip */}
      <button
        type="button"
        onClick={handleSkip}
        className="text-[13px] text-text-muted hover:text-text-secondary transition-colors cursor-pointer underline underline-offset-2"
      >
        {t('follow_gate_skip')}
      </button>
    </div>
  );
}
