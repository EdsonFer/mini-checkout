import type { CheckoutFormData, FormErrors } from '../types';
import {
  emailSchema,
  cpfSchema,
  cardNumberSchema,
  cardExpirySchema,
  cardCvvSchema,
  cardHolderSchema,
  validateField,
} from '../domain/schemas';

export async function validateTouchedFields(
  data: CheckoutFormData,
  touched: Record<string, boolean>,
): Promise<FormErrors> {
  const errors: FormErrors = {};

  if (touched.email) {
    errors.email = await validateField(emailSchema, data.email);
  }

  if (touched.cpf) {
    errors.cpf = await validateField(cpfSchema, data.cpf);
  }

  if (data.paymentMethod === 'card' && data.card) {
    if (touched.cardNumber) {
      errors.cardNumber = await validateField(
        cardNumberSchema,
        data.card.number,
      );
    }
    if (touched.cardExpiry) {
      errors.cardExpiry = await validateField(
        cardExpirySchema,
        data.card.expiry,
      );
    }
    if (touched.cardCvv) {
      errors.cardCvv = await validateField(cardCvvSchema, data.card.cvv);
    }
    if (touched.cardHolderName) {
      errors.cardHolderName = await validateField(
        cardHolderSchema,
        data.card.holderName,
      );
    }
  }

  return errors;
}
