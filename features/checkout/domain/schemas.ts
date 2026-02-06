import * as yup from 'yup';

function isValidCPFDigits(digits: string): boolean {
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(digits[i]) * (10 - i);
  }

  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== Number(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number(digits[i]) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;

  return remainder === Number(digits[10]);
}

function isValidCardNumber(digits: string): boolean {
  let sum = 0;
  let even = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (even) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    even = !even;
  }

  return sum % 10 === 0;
}

function isValidExpiry(value: string): boolean {
  const match = value.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);

  const now = new Date();
  return (
    month >= 1 &&
    month <= 12 &&
    (year > now.getFullYear() ||
      (year === now.getFullYear() && month >= now.getMonth() + 1))
  );
}

export const checkoutSchema = yup.object({
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),

  cpf: yup
    .string()
    .required('CPF obrigatório')
    .test('cpf-valid', 'CPF inválido', (value) => {
      const digits = value?.replace(/\D/g, '') || '';
      return digits.length === 11 && isValidCPFDigits(digits);
    }),

  paymentMethod: yup.string().oneOf(['pix', 'card']).required(),

  installments: yup
    .number()
    .defined()
    .when('paymentMethod', {
      is: 'card',
      then: (schema) => schema.min(1).required(),
      otherwise: (schema) => schema.default(1),
    }),

  card: yup
    .object({
      number: yup
        .string()
        .required('Número do cartão obrigatório')
        .test('card-valid', 'Cartão inválido', (value) => {
          const digits = value?.replace(/\D/g, '') || '';
          return isValidCardNumber(digits);
        }),

      expiry: yup
        .string()
        .required('Validade obrigatória')
        .test('expiry-valid', 'Cartão expirado', isValidExpiry),

      cvv: yup
        .string()
        .required('CVV obrigatório')
        .test('cvv-valid', 'CVV inválido', (value) => {
          const digits = value?.replace(/\D/g, '') || '';
          return digits.length >= 3 && digits.length <= 4;
        }),

      holderName: yup
        .string()
        .transform((value) => value?.toUpperCase())
        .required('Nome do titular é obrigatório')
        .min(3, 'Nome do titular deve ter no mínimo 3 caracteres'),
    })
    .nullable()
    .when('paymentMethod', {
      is: 'card',
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.strip(),
    }),
});
