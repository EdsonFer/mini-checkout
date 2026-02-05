import type {
  CheckoutFormData,
  PaymentMethod,
  FormErrors,
  FeeCalculation,
  Product,
} from '../types';

export interface CheckoutController {
  formData: CheckoutFormData;
  errors: FormErrors;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isFormValid: boolean;
  fees: FeeCalculation;
  pixComparison: { cardFee: number; savings: number };
  actions: {
    setEmail(value: string): void;
    setCPF(value: string): void;
    setPaymentMethod(method: PaymentMethod): void;
    setInstallments(value: number): void;
    setCardNumber(value: string): void;
    setCardExpiry(value: string): void;
    setCardCvv(value: string): void;
    setCardHolderName(value: string): void;
    handleBlur(field: string): void;
    handleSubmit(product: Product, onSuccess: () => void): void;
  };
}
