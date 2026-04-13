interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function OptionButton({ label, selected, onClick }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex-1 px-2 py-2.5 rounded-xl text-[13px] cursor-pointer
        transition-all duration-200 border-2 text-center
        ${selected
          ? 'border-primary bg-primary text-white font-bold'
          : 'border-cream-dark bg-white text-text-secondary font-medium hover:border-primary/40'
        }
      `}
    >
      {label}
    </button>
  );
}
