import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glow?: boolean;
}

export function Card({ children, className = '', onClick, glow = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`card shadow-card ${glow ? 'shadow-glow' : ''} ${
        onClick ? 'cursor-pointer transition-transform active:scale-[0.98]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
