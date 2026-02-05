import {
  emailSchema,
  cpfSchema,
  validateField,
} from '../domain/schemas'
import { maskCPF, unmaskCPF } from '../domain/masks'

describe('emailSchema', () => {
  describe('valid emails', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.com',
      'user+tag@domain.org',
      'user@sub.domain.com',
      'user123@domain.co',
    ]

    it.each(validEmails)('should accept valid email: %s', async (email) => {
      const error = await validateField(emailSchema, email)
      expect(error).toBeUndefined()
    })
  })

  describe('invalid emails', () => {
    it('should reject empty email', async () => {
      const error = await validateField(emailSchema, '')
      expect(error).toBe('E-mail e obrigatorio')
    })

    it('should reject email without @', async () => {
      const error = await validateField(emailSchema, 'testexample.com')
      expect(error).toBe('E-mail invalido')
    })

    it('should reject email without domain', async () => {
      const error = await validateField(emailSchema, 'test@')
      expect(error).toBe('E-mail invalido')
    })

    it('should reject email without local part', async () => {
      const error = await validateField(emailSchema, '@example.com')
      expect(error).toBe('E-mail invalido')
    })
  })
})

describe('cpfSchema', () => {
  describe('valid CPFs', () => {
    const validCPFs = [
      '529.982.247-25',
      '52998224725',
      '111.444.777-35',
      '11144477735',
      '123.456.789-09',
    ]

    it.each(validCPFs)('should accept valid CPF: %s', async (cpf) => {
      const error = await validateField(cpfSchema, cpf)
      expect(error).toBeUndefined()
    })
  })

  describe('invalid CPFs', () => {
    it('should reject empty CPF', async () => {
      const error = await validateField(cpfSchema, '')
      expect(error).toBe('CPF e obrigatorio')
    })

    it('should reject incomplete CPF', async () => {
      const error = await validateField(cpfSchema, '123.456.789')
      expect(error).toBe('CPF incompleto')
    })

    it('should reject CPF with less than 11 digits', async () => {
      const error = await validateField(cpfSchema, '1234567890')
      expect(error).toBe('CPF incompleto')
    })

    it('should reject CPF with all same digits', async () => {
      const invalidCPFs = [
        '000.000.000-00',
        '111.111.111-11',
        '222.222.222-22',
        '999.999.999-99',
      ]

      for (const cpf of invalidCPFs) {
        const error = await validateField(cpfSchema, cpf)
        expect(error).toBe('CPF invalido')
      }
    })

    it('should reject CPF with invalid check digits', async () => {
      const error = await validateField(cpfSchema, '529.982.247-26')
      expect(error).toBe('CPF invalido')
    })
  })
})

describe('maskCPF', () => {
  it('should mask complete CPF', () => {
    expect(maskCPF('52998224725')).toBe('529.982.247-25')
  })

  it('should mask partial CPF - 3 digits', () => {
    expect(maskCPF('529')).toBe('529')
  })

  it('should mask partial CPF - 4 digits', () => {
    expect(maskCPF('5299')).toBe('529.9')
  })

  it('should mask partial CPF - 6 digits', () => {
    expect(maskCPF('529982')).toBe('529.982')
  })

  it('should mask partial CPF - 9 digits', () => {
    expect(maskCPF('529982247')).toBe('529.982.247')
  })

  it('should handle already masked input', () => {
    expect(maskCPF('529.982.247-25')).toBe('529.982.247-25')
  })
})

describe('unmaskCPF', () => {
  it('should remove mask from CPF', () => {
    expect(unmaskCPF('529.982.247-25')).toBe('52998224725')
  })

  it('should handle CPF without mask', () => {
    expect(unmaskCPF('52998224725')).toBe('52998224725')
  })

  it('should remove any non-digit characters', () => {
    expect(unmaskCPF('529-982-247.25')).toBe('52998224725')
  })
})
