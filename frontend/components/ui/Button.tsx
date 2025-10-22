import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'alt' | 'pill';
  children: ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const variantClass = variant === 'pill' ? 'pill' : variant === 'alt' ? 'btn alt' : 'btn';
  const combinedClassName = className ? `${variantClass} ${className}` : variantClass;

  return (
    <button className={combinedClassName} type="button" {...props}>
      {children}
    </button>
  );
}
