import { UseFormReturn } from 'react-hook-form';
import type {
  Product,
  FeeCalculation,
  PaymentMethod,
  CheckoutFormData,
  FormErrors,
} from '../../types';

export interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  pixSavings: number;
}

export interface CardFormProps {
  productPrice: number;
}

export interface OrderSummaryProps {
  product: Product;
  fees: FeeCalculation;
  paymentMethod: PaymentMethod;
  installments: number;
}

export interface CheckoutFormProps {
  form: UseFormReturn<CheckoutFormData>;
  isSubmitting: boolean;
  productPrice: number;
  pixSavings: number;
  onSubmit(): void;
  onPaymentMethodChange(method: PaymentMethod): void;
}
