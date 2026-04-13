interface SelectChipProps {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function SelectChip({ emoji, label, selected, onClick }: SelectChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5
        rounded-full border-2 px-4 py-2.5 cursor-pointer
        transition-all duration-200 text-[13px]
        ${selected
          ? 'border-primary bg-primary-light font-bold text-primary'
          : 'border-cream-dark bg-white font-medium text-text-secondary hover:border-primary/40'
        }
      `}
    >
      <span className="text-base">{emoji}</span>
      <span>{label}</span>
    </button>
  );
}
