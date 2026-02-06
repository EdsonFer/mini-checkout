export interface PaymentPayload {
  customer: {
    email: string;
    cpf: string;
  };
  payment: {
    method: 'pix' | 'card';
    installments: number;
    card?: {
      number: string;
      expiry: string;
      cvv: string;
      holderName: string;
    };
  };
  product: {
    id: number;
    name: string;
    price: number;
  };
  fees: {
    platformFee: number;
    producerNetAmount: number;
  };
}
