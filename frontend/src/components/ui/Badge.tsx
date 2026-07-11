import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'accent' | 'warning';
}

export const Badge = ({ children, variant = 'default' }: BadgeProps) => {
  return <span className={`badge badge-${variant}`}>{children}</span>;
};
