# Teste Front-End Cakto - Edson Fernandes de Oliveira

## Decisões Técnicas

### Arquitetura e Organização

Optei por uma **feature-based architecture** enxuta, concentrando todo o código relacionado ao checkout em uma única feature (`/features/checkout`). Esta abordagem foi escolhida por equilibrar organização e simplicidade - evita complexidade desnecessária em um projeto pequeno, mas mantém a separação de responsabilidades clara e permite evolução conforme o projeto cresça.

A estrutura interna segue uma divisão entre:

- `domain/` - Regras de negócio puras (calculadora de taxas, schemas Yup, formatadores, máscaras)
- `controllers/` - Lógica de estado e orquestração (useCheckoutController)
- `services/` - Comunicação com backend (checkout-service com fetch)
- `components/` - UI organizada em Atomic Design (atoms, molecules, organisms, templates)
- `types/` - Interfaces TypeScript separadas por domínio (product, payment, form)

### Padrões e Trade-offs

O **Atomic Design** foi adotado para melhorar organização e reutilização dos componentes de UI, sendo aplicado apenas onde agrega valor.

- **Atoms**: FormField, Icons (elementos básicos reutilizáveis)
- **Molecules**: PaymentOption, InstallmentSelect, PriceLine (combinações de atoms)
- **Organisms**: CheckoutForm, OrderSummary, CardForm, PaymentMethodSelector (seções completas)
- **Templates**: CheckoutPage (layout completo da página)

A separação entre **Controller** e **View** permite que a lógica de estado e validação fique isolada da renderização, facilitando testes e manutenção. O **Service** simula o envio para o backend usando fetch do Next.js, logando os dados no console.

## Transparência de Uso de IA

Durante o desenvolvimento, utilizei IA de forma pontual para:

- Rascunhar a estrutura inicial de tipos e interfaces
- Listar edge cases de validação de CPF
- Gerar um primeiro esboço da função de cálculo de taxas
- Rascunhar casos de teste unitário para funções puras
- Revisar acessibilidade (aria-\* attributes e roles)
- Apoio pontual na organização inicial do ARCHITECTURE.md e do README

Todo o código foi revisado, testado e ajustado manualmente para garantir qualidade e conformidade com os requisitos.

## Regras de Negócio

### Princípio Fundamental

O **comprador sempre paga o valor fixo do produto** (R$ 297,00). A taxa da plataforma é **descontada do valor que o produtor recebe**, nunca adicionada ao valor do comprador.

### Como foi garantido no código

```typescript
export function calculateFees(productPrice, method, installments) {
  const feePercentage = calculateFeePercentage(method, installments);
  const platformFee = (productPrice * feePercentage) / 100;
  const producerNetAmount = productPrice - platformFee;

  return {
    buyerTotal: productPrice,
    platformFee,
    producerNetAmount,
  };
}
```

O `buyerTotal` é sempre igual ao `productPrice`, independente do método de pagamento.

### Por que este modelo?

1. **Previsibilidade**: Fórmula simples e linear
2. **Escalabilidade**: Novos métodos podem ser adicionados sem alterar lógica existente
3. **Transparência**: Comprador vê exatamente a taxa e quanto o produtor recebe

## Como Executar

```bash
npm install
npm run dev
```

## Testes

```bash
npm test
npm test -- --coverage
npm test -- --watch
```

### Testes implementados

- `fee-calculator.test.ts`: Testa o cálculo de taxas para todos os cenários
- `validators.test.ts`: Testa validação de CPF e Email com Yup

## Resposta Bônus

### Se tivesse mais tempo, o que faria para aumentar a conversão?

1. **Countdown de urgência**: Timer mostrando que a oferta expira
2. **Prova social**: "23 pessoas compraram nas últimas 2 horas"
3. **Garantia visível**: Badge de garantia próximo ao botão
4. **One-click checkout**: Salvar dados para compras recorrentes
5. **Exit intent popup**: Cupom ao detectar intenção de sair
6. **Chat de suporte**: Widget para dúvidas em tempo real
7. **Recuperação de carrinho**: Email para quem abandonou

## Pull Request

A implementação do checkout foi realizada na seguinte Pull Request:

[Ver Pull Request](https://github.com/EdsonFer/mini-checkout/pull/1)
