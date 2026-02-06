import {
  calculateCardFeePercentage,
  calculateFeePercentage,
  calculateFees,
  generateInstallmentOptions,
  FEE_RATES,
} from '../domain/fee-calculator';

describe('calculateCardFeePercentage', () => {
  it('should return 3.99% for 1 installment', () => {
    expect(calculateCardFeePercentage(1)).toBeCloseTo(3.99, 2);
  });

  it('should return 6.99% for 2 installments', () => {
    expect(calculateCardFeePercentage(2)).toBeCloseTo(6.99, 2);
  });

  it('should return 8.99% for 3 installments', () => {
    expect(calculateCardFeePercentage(3)).toBeCloseTo(8.99, 2);
  });

  it('should return 26.99% for 12 installments', () => {
    expect(calculateCardFeePercentage(12)).toBeCloseTo(26.99, 2);
  });

  it('should throw error for installments less than 1', () => {
    expect(() => calculateCardFeePercentage(0)).toThrow(
      'Installments must be between 1 and 12',
    );
  });

  it('should throw error for installments greater than 12', () => {
    expect(() => calculateCardFeePercentage(13)).toThrow(
      'Installments must be between 1 and 12',
    );
  });
});

describe('calculateFeePercentage', () => {
  it('should return 0% for PIX', () => {
    expect(calculateFeePercentage('pix')).toBe(0);
  });

  it('should return card fee for card payment', () => {
    expect(calculateFeePercentage('card', 1)).toBeCloseTo(3.99, 2);
    expect(calculateFeePercentage('card', 6)).toBeCloseTo(14.99, 2);
  });
});

describe('calculateFees', () => {
  const productPrice = 297;

  describe('PIX payment', () => {
    it('should return 0% fee for PIX', () => {
      const result = calculateFees(productPrice, 'pix');

      expect(result.buyerTotal).toBe(productPrice);
      expect(result.platformFee).toBe(0);
      expect(result.platformFeePercentage).toBe(0);
      expect(result.producerNetAmount).toBe(productPrice);
    });

    it('buyer total should always equal product price', () => {
      const result = calculateFees(productPrice, 'pix');
      expect(result.buyerTotal).toBe(productPrice);
    });
  });

  describe('Card payment', () => {
    it('should calculate correct fee for 1x payment', () => {
      const result = calculateFees(productPrice, 'card', 1);

      expect(result.buyerTotal).toBe(productPrice);
      expect(result.platformFeePercentage).toBeCloseTo(3.99, 2);
      expect(result.platformFee).toBeCloseTo(11.85, 2);
      expect(result.producerNetAmount).toBeCloseTo(285.15, 2);
    });

    it('should calculate correct fee for 12x payment', () => {
      const result = calculateFees(productPrice, 'card', 12);

      expect(result.buyerTotal).toBe(productPrice);
      expect(result.platformFeePercentage).toBeCloseTo(26.99, 2);
      expect(result.platformFee).toBeCloseTo(80.16, 2);
      expect(result.producerNetAmount).toBeCloseTo(216.84, 2);
    });

    it('buyer total should never change regardless of installments', () => {
      for (let i = 1; i <= 12; i++) {
        const result = calculateFees(productPrice, 'card', i);
        expect(result.buyerTotal).toBe(productPrice);
      }
    });

    it('producer net amount should decrease as installments increase', () => {
      const result1x = calculateFees(productPrice, 'card', 1);
      const result12x = calculateFees(productPrice, 'card', 12);

      expect(result12x.producerNetAmount).toBeLessThan(
        result1x.producerNetAmount,
      );
    });
  });

  describe('PIX savings calculation', () => {
    it('should calculate correct PIX savings', () => {
      const pixResult = calculateFees(productPrice, 'pix', 1);
      const cardResult = calculateFees(productPrice, 'card', 1);

      expect(pixResult.pixSavings).toBeCloseTo(cardResult.platformFee, 2);
    });
  });
});

describe('generateInstallmentOptions', () => {
  it('should generate 12 options by default', () => {
    const options = generateInstallmentOptions();
    expect(options).toHaveLength(12);
  });

  it('should have correct fee percentages', () => {
    const options = generateInstallmentOptions();

    expect(options[0].feePercentage).toBeCloseTo(3.99, 2);
    expect(options[1].feePercentage).toBeCloseTo(6.99, 2);
    expect(options[11].feePercentage).toBeCloseTo(26.99, 2);
  });

  it('should have correct labels', () => {
    const options = generateInstallmentOptions();

    expect(options[0].label).toBe('1x (a vista)');
    expect(options[1].label).toBe('2x');
    expect(options[11].label).toBe('12x');
  });
});

describe('FEE_RATES configuration', () => {
  it('should have PIX rate as 0', () => {
    expect(FEE_RATES.pix).toBe(0);
  });

  it('should have correct card base rate', () => {
    expect(FEE_RATES.card.base).toBeCloseTo(3.99, 2);
  });

  it('should have correct installment rates', () => {
    expect(FEE_RATES.card.installment.base).toBeCloseTo(4.99, 2);
    expect(FEE_RATES.card.installment.perInstallment).toBe(2);
  });
});
