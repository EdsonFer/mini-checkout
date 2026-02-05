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
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardHolderName: string;
  installments: number;
  productPrice: number;
  errors: FormErrors;
  onCardNumberChange: (value: string) => void;
  onCardExpiryChange: (value: string) => void;
  onCardCvvChange: (value: string) => void;
  onCardHolderNameChange: (value: string) => void;
  onInstallmentsChange: (value: number) => void;
  onBlur: (field: string) => void;
}

export interface OrderSummaryProps {
  product: Product;
  fees: FeeCalculation;
  paymentMethod: PaymentMethod;
  installments: number;
}

export interface CheckoutFormProps {
  formData: CheckoutFormData;
  errors: FormErrors;
  isSubmitting: boolean;
  isFormValid: boolean;
  productPrice: number;
  pixSavings: number;
  onEmailChange: (value: string) => void;
  onCPFChange: (value: string) => void;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onInstallmentsChange: (value: number) => void;
  onCardNumberChange: (value: string) => void;
  onCardExpiryChange: (value: string) => void;
  onCardCvvChange: (value: string) => void;
  onCardHolderNameChange: (value: string) => void;
  onBlur: (field: string) => void;
  onSubmit: () => void;
}
