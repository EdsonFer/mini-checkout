export { CheckoutPage } from './components/templates'

export type { PaymentMethod, Product, FeeCalculation, CheckoutFormData, ValidationResult } from './types'

export {
  calculateFees,
  calculateFeePercentage,
  calculateCardFeePercentage,
  generateInstallmentOptions,
  FEE_RATES,
} from './domain/fee-calculator'

export { maskCPF, unmaskCPF, maskCardNumber, maskCardExpiry } from './domain/masks'

export { formatCurrency, formatPercentage } from './domain/formatters'

export {
  emailSchema,
  cpfSchema,
  cardNumberSchema,
  cardExpirySchema,
  cardCvvSchema,
  cardHolderSchema,
  validateField,
} from './domain/schemas'
