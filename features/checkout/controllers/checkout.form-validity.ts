import type { CheckoutFormData, FormErrors } from '../types';

export function isCheckoutFormValid(
  formData: CheckoutFormData,
  errors: FormErrors,
): boolean {
  const hasEmail = formData.email.length > 0;
  const hasCPF = formData.cpf.replace(/\D/g, '').length === 11;
  const hasNoErrors = Object.values(errors).every((e) => !e);

  if (!hasEmail || !hasCPF || !hasNoErrors) return false;

  if (formData.paymentMethod === 'card' && formData.card) {
    const hasCard = formData.card.number.replace(/\D/g, '').length >= 13;
    const hasExpiry = /^\d{2}\/\d{2}$/.test(formData.card.expiry);
    const hasCvv = formData.card.cvv.length >= 3;
    const hasHolder = formData.card.holderName.length >= 3;
    return hasCard && hasExpiry && hasCvv && hasHolder;
  }

  return true;
}
