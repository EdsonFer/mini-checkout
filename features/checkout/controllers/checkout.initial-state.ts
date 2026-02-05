import type { CheckoutFormData } from '../types';

export const initialFormData: CheckoutFormData = {
  email: '',
  cpf: '',
  paymentMethod: 'pix',
  installments: 1,
  card: {
    number: '',
    expiry: '',
    cvv: '',
    holderName: '',
  },
};
