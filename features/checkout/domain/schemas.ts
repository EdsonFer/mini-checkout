import * as yup from 'yup';

function isValidCPFDigits(digits: string): boolean {
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(digits[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== Number.parseInt(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(digits[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === Number.parseInt(digits[10]);
}

function isValidCardNumber(digits: string): boolean {
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(digits[i]);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

function isValidExpiry(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const month = Number.parseInt(match[1]);
  const year = Number.parseInt(match[2]) + 2000;

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  return !(
    year < currentYear ||
    (year === currentYear && month < currentMonth)
  );
}

export const emailSchema = yup
  .string()
  .required('E-mail e obrigatorio')
  .email('E-mail invalido');

export const cpfSchema = yup
  .string()
  .required('CPF e obrigatorio')
  .test('cpf-length', 'CPF incompleto', (value) => {
    const digits = value?.replace(/\D/g, '') || '';
    return digits.length === 11;
  })
  .test('cpf-valid', 'CPF invalido', (value) => {
    const digits = value?.replace(/\D/g, '') || '';
    if (digits.length !== 11) return false;
    return isValidCPFDigits(digits);
  });

export const cardNumberSchema = yup
  .string()
  .required('Numero do cartao e obrigatorio')
  .test('card-valid', 'Numero do cartao invalido', (value) => {
    const digits = value?.replace(/\D/g, '') || '';
    return isValidCardNumber(digits);
  });

export const cardExpirySchema = yup
  .string()
  .required('Validade e obrigatória')
  .test('expiry-format', 'Formato invalido (MM/AA)', (value) => {
    return /^\d{2}\/\d{2}$/.test(value || '');
  })
  .test('expiry-valid', 'Cartão expirado', (value) => {
    return isValidExpiry(value || '');
  });

export const cardCvvSchema = yup
  .string()
  .required('CVV e obrigatório')
  .test('cvv-valid', 'CVV invalido', (value) => {
    const digits = value?.replace(/\D/g, '') || '';
    return digits.length >= 3 && digits.length <= 4;
  });

export const cardHolderSchema = yup
  .string()
  .required('Nome e obrigatório')
  .min(3, 'Nome muito curto');

export async function validateField(
  schema: yup.StringSchema,
  value: string,
): Promise<string | undefined> {
  try {
    await schema.validate(value);
    return undefined;
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return err.message;
    }
    return 'Erro de validação';
  }
}
