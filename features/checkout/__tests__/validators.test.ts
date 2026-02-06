import { checkoutSchema } from '../domain/schemas';

describe('checkoutSchema', () => {
  describe('email', () => {
    const baseData = {
      cpf: '529.982.247-25',
      paymentMethod: 'pix',
      installments: 1,
    };

    it.each([
      'test@example.com',
      'user.name@domain.com',
      'user+tag@domain.org',
      'user@sub.domain.com',
      'user123@domain.co',
    ])('accepts valid email: %s', async (email) => {
      await expect(
        checkoutSchema.validateAt('email', { ...baseData, email }),
      ).resolves.toBeDefined();
    });

    it('rejects empty email', async () => {
      await expect(
        checkoutSchema.validateAt('email', { ...baseData, email: '' }),
      ).rejects.toThrow('E-mail obrigatório');
    });

    it('rejects invalid email', async () => {
      await expect(
        checkoutSchema.validateAt('email', {
          ...baseData,
          email: 'testexample.com',
        }),
      ).rejects.toThrow('E-mail inválido');
    });
  });

  describe('cpf', () => {
    const baseData = {
      email: 'test@example.com',
      paymentMethod: 'pix',
      installments: 1,
    };

    it.each([
      '529.982.247-25',
      '52998224725',
      '111.444.777-35',
      '11144477735',
      '123.456.789-09',
    ])('accepts valid CPF: %s', async (cpf) => {
      await expect(
        checkoutSchema.validateAt('cpf', { ...baseData, cpf }),
      ).resolves.toBeDefined();
    });

    it('rejects empty CPF', async () => {
      await expect(
        checkoutSchema.validateAt('cpf', { ...baseData, cpf: '' }),
      ).rejects.toThrow('CPF obrigatório');
    });

    it('rejects invalid CPF', async () => {
      await expect(
        checkoutSchema.validateAt('cpf', {
          ...baseData,
          cpf: '529.982.247-26',
        }),
      ).rejects.toThrow('CPF inválido');
    });
  });

  describe('card', () => {
    const baseData = {
      email: 'test@example.com',
      cpf: '52998224725',
      installments: 1,
    };

    it('requires card when paymentMethod is card', async () => {
      await expect(
        checkoutSchema.validate({
          ...baseData,
          paymentMethod: 'card',
        }),
      ).rejects.toThrow();
    });

    it('accepts card when paymentMethod is card', async () => {
      await expect(
        checkoutSchema.validate({
          ...baseData,
          paymentMethod: 'card',
          card: {
            number: '4111111111111111',
            expiry: '12/30',
            cvv: '123',
            holderName: 'John Doe',
          },
        }),
      ).resolves.toBeDefined();
    });

    it('ignores card when paymentMethod is pix', async () => {
      await expect(
        checkoutSchema.validate({
          ...baseData,
          paymentMethod: 'pix',
        }),
      ).resolves.toBeDefined();
    });
  });
});
