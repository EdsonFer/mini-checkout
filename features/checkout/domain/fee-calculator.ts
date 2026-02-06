import type {
  FeeCalculation,
  PaymentMethod,
  InstallmentOption,
} from '../types';

export const FEE_RATES = {
  pix: 0,
  card: {
    base: 3.99,
    installment: {
      base: 4.99,
      perInstallment: 2,
    },
  },
} as const;

export function calculateCardFeePercentage(installments: number): number {
  if (installments < 1 || installments > 12) {
    throw new Error('Installments must be between 1 and 12');
  }

  if (installments === 1) {
    return FEE_RATES.card.base;
  }

  return (
    FEE_RATES.card.installment.base +
    (installments - 1) * FEE_RATES.card.installment.perInstallment
  );
}

export function calculateFeePercentage(
  method: PaymentMethod,
  installments = 1,
): number {
  return method === 'pix'
    ? FEE_RATES.pix
    : calculateCardFeePercentage(installments);
}

export function calculateFees(
  productPrice: number,
  method: PaymentMethod,
  installments = 1,
): FeeCalculation {
  const feePercentage = calculateFeePercentage(method, installments);
  const platformFee = (productPrice * feePercentage) / 100;
  const producerNetAmount = productPrice - platformFee;

  const cardFeePercentage = calculateCardFeePercentage(installments);
  const cardFee = (productPrice * cardFeePercentage) / 100;
  const pixSavings = method === 'pix' ? cardFee : cardFee - platformFee;

  return {
    buyerTotal: productPrice,
    platformFee: Math.round(platformFee * 100) / 100,
    platformFeePercentage: feePercentage,
    producerNetAmount: Math.round(producerNetAmount * 100) / 100,
    pixSavings: Math.round(pixSavings * 100) / 100,
  };
}

export function generateInstallmentOptions(
  maxInstallments = 12,
): InstallmentOption[] {
  return Array.from({ length: maxInstallments }, (_, i) => {
    const value = i + 1;
    return {
      value,
      label: value === 1 ? '1x (a vista)' : `${value}x`,
      feePercentage: calculateCardFeePercentage(value),
    };
  });
}
