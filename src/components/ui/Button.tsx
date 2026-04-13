interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
  type?: 'button' | 'submit';
}

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  fullWidth = false,
  type = 'button',
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-xl font-bold text-[15px] tracking-[0.3px] transition-all duration-200 px-8 py-[14px] cursor-pointer';

  const variants = {
    primary: disabled
      ? 'bg-cream-dark text-white cursor-default'
      : 'bg-primary text-white shadow-[0_4px_20px_rgba(196,30,58,0.35)] active:scale-[0.98]',
    secondary:
      'bg-transparent border-2 border-cream-dark text-text-secondary hover:border-primary hover:text-primary',
    ghost:
      'bg-transparent text-text-muted hover:text-primary text-[13px] font-normal',
  };

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {children}
    </button>
  );
}
