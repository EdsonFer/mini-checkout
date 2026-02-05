import type { CardFormData, PaymentMethod } from './payment';

export interface CheckoutFormData {
  email: string;
  cpf: string;
  paymentMethod: PaymentMethod;
  installments: number;
  card: CardFormData | null;
}

export interface FormErrors {
  email?: string;
  cpf?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardHolderName?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
