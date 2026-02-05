import { UseFormReturn } from 'react-hook-form';
import type {
  CheckoutFormData,
  PaymentMethod,
  FeeCalculation,
  Product,
} from '../types';

export interface CheckoutController {
  form: UseFormReturn<CheckoutFormData>;
  paymentMethod: PaymentMethod;
  installments: number;
  isSubmitting: boolean;
  fees: FeeCalculation;
  pixComparison: {
    cardFee: number;
    savings: number;
  };
  actions: {
    setPaymentMethod(method: PaymentMethod): void;
    handleSubmit(product: Product, onSuccess: () => void): void;
  };
}
