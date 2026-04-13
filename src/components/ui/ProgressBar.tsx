interface ProgressBarProps {
  currentStep: number; // 0-based index (0 = step 1 active)
  totalSteps?: number;
}

export default function ProgressBar({ currentStep, totalSteps = 5 }: ProgressBarProps) {
  return (
    <div className="flex gap-1.5 px-6 mb-5">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`
            flex-1 h-[3px] rounded-full transition-all duration-300
            ${i <= currentStep ? 'bg-primary' : 'bg-cream-dark'}
          `}
        />
      ))}
    </div>
  );
}
