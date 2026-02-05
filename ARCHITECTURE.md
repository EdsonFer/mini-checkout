# Arquitetura do Checkout

## Diagrama da Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         app/page.tsx                            │
│                    (Entry Point - Next.js)                      │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    features/checkout/                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              components/ (Atomic Design)                 │   │
│  │  ┌──────────┐ ┌───────────┐ ┌───────────┐ ┌──────────┐  │   │
│  │  │  atoms/  │ │ molecules/│ │ organisms/│ │templates/│  │   │
│  │  └──────────┘ └───────────┘ └───────────┘ └──────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                    │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   controllers/                           │   │
│  │            (Estado e Orquestração)                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                    │
│              ┌─────────────┴─────────────┐                     │
│              ▼                           ▼                      │
│  ┌───────────────────┐       ┌───────────────────┐             │
│  │     services/     │       │      domain/      │             │
│  │  (Backend API)    │       │  (Regras Puras)   │             │
│  └───────────────────┘       └───────────────────┘             │
│                                        │                        │
│                                        ▼                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                       types/                             │   │
│  │              (Interfaces TypeScript)                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Estrutura de Pastas

```
features/checkout/
├── index.ts
├── types/
│   ├── index.ts
│   ├── product.ts
│   ├── payment.ts
│   └── form.ts
├── domain/
│   ├── fee-calculator.ts
│   ├── schemas.ts
│   ├── masks.ts
│   └── formatters.ts
├── controllers/
│   ├── checkout-controller.ts
│   ├── checkout.form-validity.ts
│   ├── checkout.initial-state.ts
│   ├── checkout.pix-comparison.ts
│   ├── checkout.validation.ts
│   └── controller.types.ts
├── services/
│   ├── checkout-service.ts
│   └── types.ts
├── components/
│   ├── index.ts
│   ├── atoms/
│   │   ├── index.ts
│   │   ├── form-field.tsx
│   │   └── icons.tsx
│   │   └── types.ts
│   ├── molecules/
│   │   ├── index.ts
│   │   ├── payment-option.tsx
│   │   ├── installment-select.tsx
│   │   ├── price-line.tsx
│   │   └── types.ts
│   ├── organisms/
│   │   ├── index.ts
│   │   ├── checkout-form.tsx
│   │   ├── card-form.tsx
│   │   ├── order-summary.tsx
│   │   └── payment-method-selector.tsx
│   │   └── types.ts
│   └── templates/
│       ├── index.ts
│       └── checkout-page.tsx
├── data/
│   └── product.ts
└── __tests__/
    ├── fee-calculator.test.ts
    └── validators.test.ts
```

## Fluxo do Checkout

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Usuario    │────▶│  Controller  │────▶│   Schemas    │
│  preenche    │     │   (Estado)   │     │    (Yup)     │
└──────────────┘     └──────────────┘     └──────────────┘
                            │                    │
                            ▼                    ▼
                     ┌──────────────┐     ┌──────────────┐
                     │ Fee Calc     │     │   Erros em   │
                     │  (Domain)    │     │  tempo real  │
                     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   Service    │
                     │ (fetch API)  │
                     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  Console.log │
                     │  (payload)   │
                     └──────────────┘
```

## Separação de Responsabilidades

### Domain (Regras de Negocio)

Funções puras sem side effects:

```typescript
calculateFees(price, method, installments) → FeeCalculation
emailSchema.validate(email) → Promise<string>
maskCPF(cpf) → string
formatCurrency(value) → string
```

### Controllers (Orquestração)

Conectam domínio, serviços e UI:

```typescript
useCheckoutController(productPrice) → {
  formData,
  errors,
  isSubmitting,
  isFormValid,
  fees,
  actions: { setEmail, setCPF, handleSubmit, ... }
}
```

### Services (Backend)

Comunicação externa com fetch:

```typescript
submitPayment(formData, product, fees) → Promise<{ success: boolean }>
```

### UI (Atomic Design)

| Nível     | Responsabilidade    | Exemplos                   |
| --------- | ------------------- | -------------------------- |
| Atoms     | Elementos básicos   | FormField, Icons           |
| Molecules | Combinações simples | PaymentOption, PriceLine   |
| Organisms | Seções completas    | CheckoutForm, OrderSummary |
| Templates | Layouts de pagina   | CheckoutPage               |

## Princípios SOLID Aplicados

### SRP (Single Responsibility)

| Modulo                   | Responsabilidade       |
| ------------------------ | ---------------------- |
| `fee-calculator.ts`      | Calcular taxas         |
| `schemas.ts`             | Validar inputs com Yup |
| `masks.ts`               | Aplicar mascaras       |
| `formatters.ts`          | Formatar valores       |
| `checkout-controller.ts` | Gerenciar estado       |
| `checkout-service.ts`    | Enviar para backend    |

### OCP (Open/Closed)

Novo método de pagamento:

1. Adicionar ao type PaymentMethod
2. Adicionar regra em calculateFeePercentage
3. Nenhuma modificação nos componentes

### DIP (Dependency Inversion)

Controller depende de abstrações (funções do domain), nao de implementações concretas.

## Decisões de Design

### Por que Yup ao invés de Zod?

- Sintaxe mais familiar para validações assíncronas
- Melhor integração com formulários tradicionais
- Mensagens de erro mais customizáveis

### Por que Controller separado da View?

- Testabilidade: logica pode ser testada sem renderizar
- Reusabilidade: mesma logica para diferentes UIs
- Clareza: separação clara entre estado e apresentação

### Por que Service com fetch?

- Preparado para integração real com backend
- Estrutura de payload ja definida para API
