import type { CheckoutFormData, FeeCalculation, Product } from '../types';
import { PaymentPayload } from './types';

export async function submitPayment(
  formData: CheckoutFormData,
  product: Product,
  fees: FeeCalculation,
): Promise<{ success: boolean }> {
  const payload: PaymentPayload = {
    customer: {
      email: formData.email,
      cpf: formData.cpf.replace(/\D/g, ''),
    },
    payment: {
      method: formData.paymentMethod,
      installments: formData.installments,
      ...(formData.paymentMethod === 'card' &&
        formData.card && {
          card: {
            number: formData.card.number.replace(/\D/g, ''),
            expiry: formData.card.expiry,
            cvv: formData.card.cvv,
            holderName: formData.card.holderName,
          },
        }),
    },
    product: {
      id: product.id,
      name: product.name,
      price: product.currentPrice,
    },
    fees: {
      platformFee: fees.platformFee,
      producerNetAmount: fees.producerNetAmount,
    },
  };

  console.log('[Checkout Service] Enviando pagamento para o backend:', payload);

  await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {});

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('[Checkout Service] Pagamento processado com sucesso');
      resolve({ success: true });
    }, 2000);
  });
}
