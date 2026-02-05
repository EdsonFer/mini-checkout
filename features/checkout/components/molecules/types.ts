import type { ReactNode } from 'react';

export interface PaymentOptionProps {
  selected: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
  badge?: string;
  badgeVariant?: 'success' | 'default';
  subtitle?: string;
  children?: ReactNode;
}

export interface InstallmentSelectProps {
  value: number;
  productPrice: number;
  onChange: (value: number) => void;
}

export interface PriceLineProps {
  label: string;
  value: string;
  variant?: 'default' | 'discount' | 'strikethrough' | 'highlight';
  size?: 'sm' | 'lg';
}
