import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = '', ...props }: InputProps) {
  const combinedClassName = className ? `input ${className}` : 'input';

  return <input className={combinedClassName} {...props} />;
}
