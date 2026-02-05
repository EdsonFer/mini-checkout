import type { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FormField, LockIcon, SpinnerIcon } from '../atoms'
import { PaymentMethodSelector } from './payment-method-selector'
import { CardForm } from './card-form'
import type { CheckoutFormProps } from './types'

const formStyles = 'space-y-6'
const fieldsContainerStyles = 'space-y-4'
const dividerStyles = 'border-t border-border'
const securityTextStyles = 'text-xs text-muted-foreground text-center flex items-center justify-center gap-1'

const buttonStyles = {
  base: 'w-full h-12 font-semibold text-base',
  pix: 'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500 text-white',
  card: 'bg-primary hover:bg-primary/90 focus:ring-primary text-primary-foreground',
}

export function CheckoutForm({
  formData,
  errors,
  isSubmitting,
  isFormValid,
  productPrice,
  pixSavings,
  onEmailChange,
  onCPFChange,
  onPaymentMethodChange,
  onInstallmentsChange,
  onCardNumberChange,
  onCardExpiryChange,
  onCardCvvChange,
  onCardHolderNameChange,
  onBlur,
  onSubmit,
}: CheckoutFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const buttonClassName = cn(
    buttonStyles.base,
    formData.paymentMethod === 'pix' ? buttonStyles.pix : buttonStyles.card
  )

  const isCardPayment = formData.paymentMethod === 'card'
  const showCardForm = isCardPayment && formData.card

  return (
    <form onSubmit={handleSubmit} className={formStyles} noValidate>
      <h2 className="text-xl font-semibold text-foreground">Informacoes de pagamento</h2>

      <div className={fieldsContainerStyles}>
        <FormField
          label="E-mail"
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onEmailChange(e.target.value)}
          onBlur={() => onBlur('email')}
          error={errors.email}
          placeholder="seu@email.com"
          autoComplete="email"
        />

        <FormField
          label="CPF"
          id="cpf"
          value={formData.cpf}
          onChange={(e) => onCPFChange(e.target.value)}
          onBlur={() => onBlur('cpf')}
          error={errors.cpf}
          placeholder="000.000.000-00"
          inputMode="numeric"
          maxLength={14}
        />
      </div>

      <div className={dividerStyles} />

      <PaymentMethodSelector
        value={formData.paymentMethod}
        onChange={onPaymentMethodChange}
        pixSavings={pixSavings}
      />

      {showCardForm && formData.card && (
        <CardForm
          cardNumber={formData.card.number}
          cardExpiry={formData.card.expiry}
          cardCvv={formData.card.cvv}
          cardHolderName={formData.card.holderName}
          installments={formData.installments}
          productPrice={productPrice}
          errors={errors}
          onCardNumberChange={onCardNumberChange}
          onCardExpiryChange={onCardExpiryChange}
          onCardCvvChange={onCardCvvChange}
          onCardHolderNameChange={onCardHolderNameChange}
          onInstallmentsChange={onInstallmentsChange}
          onBlur={onBlur}
        />
      )}

      <Button
        type="submit"
        disabled={isSubmitting || !isFormValid}
        className={buttonClassName}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <SpinnerIcon />
            Processando...
          </span>
        ) : (
          <>
            Finalizar Compra
            {formData.paymentMethod === 'pix' && <span className="ml-2 text-emerald-100">via PIX</span>}
          </>
        )}
      </Button>

      <p className={securityTextStyles}>
        <LockIcon />
        Pagamento 100% seguro. Seus dados estao protegidos.
      </p>
    </form>
  )
}
