import { calculateCardFeePercentage } from '../domain/fee-calculator';

export function calculatePixComparison(
  productPrice: number,
  installments: number,
) {
  const cardFeePercentage = calculateCardFeePercentage(installments);
  const cardFee = (productPrice * cardFeePercentage) / 100;
  const rounded = Math.round(cardFee * 100) / 100;

  return {
    cardFee: rounded,
    savings: rounded,
  };
}
