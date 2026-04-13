interface SelectCardProps {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function SelectCard({ emoji, label, selected, onClick }: SelectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center gap-1.5
        rounded-2xl border-2 p-4 cursor-pointer
        transition-all duration-200 text-center
        ${selected
          ? 'border-primary bg-primary-light shadow-[0_4px_12px_rgba(196,30,58,0.12)]'
          : 'border-cream-dark bg-white hover:border-primary/40'
        }
      `}
    >
      <span
        className={`text-[26px] transition-transform duration-200 ${selected ? 'scale-110' : ''}`}
      >
        {emoji}
      </span>
      <span
        className={`text-[13px] leading-tight ${
          selected ? 'font-bold text-primary' : 'font-medium text-text-secondary'
        }`}
      >
        {label}
      </span>
    </button>
  );
}
