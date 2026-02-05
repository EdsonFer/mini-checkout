import { FormField } from '../atoms'
import { InstallmentSelect } from '../molecules'
import type { CardFormProps } from './types'

const containerStyles = 'space-y-4 animate-in fade-in slide-in-from-top-2 duration-300'
const gridStyles = 'grid grid-cols-2 gap-4'

export function CardForm({
  cardNumber,
  cardExpiry,
  cardCvv,
  cardHolderName,
  installments,
  productPrice,
  errors,
  onCardNumberChange,
  onCardExpiryChange,
  onCardCvvChange,
  onCardHolderNameChange,
  onInstallmentsChange,
  onBlur,
}: CardFormProps) {
  return (
    <div className={containerStyles}>
      <InstallmentSelect
        value={installments}
        productPrice={productPrice}
        onChange={onInstallmentsChange}
      />

      <FormField
        label="Numero do cartão"
        id="card-number"
        value={cardNumber}
        onChange={(e) => onCardNumberChange(e.target.value)}
        onBlur={() => onBlur('cardNumber')}
        error={errors.cardNumber}
        placeholder="0000 0000 0000 0000"
        inputMode="numeric"
        autoComplete="cc-number"
        maxLength={19}
      />

      <div className={gridStyles}>
        <FormField
          label="Validade"
          id="card-expiry"
          value={cardExpiry}
          onChange={(e) => onCardExpiryChange(e.target.value)}
          onBlur={() => onBlur('cardExpiry')}
          error={errors.cardExpiry}
          placeholder="MM/AA"
          inputMode="numeric"
          autoComplete="cc-exp"
          maxLength={5}
        />
        <FormField
          label="CVV"
          id="card-cvv"
          value={cardCvv}
          onChange={(e) => onCardCvvChange(e.target.value)}
          onBlur={() => onBlur('cardCvv')}
          error={errors.cardCvv}
          placeholder="123"
          inputMode="numeric"
          autoComplete="cc-csc"
          maxLength={4}
        />
      </div>

      <FormField
        label="Nome no cartao"
        id="card-holder-name"
        value={cardHolderName}
        onChange={(e) => onCardHolderNameChange(e.target.value)}
        onBlur={() => onBlur('cardHolderName')}
        error={errors.cardHolderName}
        placeholder="NOME COMO ESTA NO CARTÃO"
        autoComplete="cc-name"
      />
    </div>
  )
}
