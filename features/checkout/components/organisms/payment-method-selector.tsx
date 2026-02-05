import { formatCurrency } from '../../domain/formatters'
import { PaymentOption } from '../molecules'
import { PixIcon, CardIcon } from '../atoms'
import type { PaymentMethodSelectorProps } from './types'

const iconStyles = {
  pix: {
    selected: 'text-emerald-600',
    unselected: 'text-muted-foreground',
  },
  card: {
    selected: 'text-primary',
    unselected: 'text-muted-foreground',
  },
}

export function PaymentMethodSelector({ value, onChange, pixSavings }: PaymentMethodSelectorProps) {
  const pixIconClassName = value === 'pix' ? iconStyles.pix.selected : iconStyles.pix.unselected
  const cardIconClassName = value === 'card' ? iconStyles.card.selected : iconStyles.card.unselected

  return (
    <fieldset className="space-y-3">
      <legend className="block text-sm font-medium text-foreground mb-3">Forma de pagamento</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <PaymentOption
          selected={value === 'pix'}
          onClick={() => onChange('pix')}
          icon={<PixIcon className={pixIconClassName} />}
          title="PIX"
          badge="0% de taxa"
          badgeVariant="success"
        >
          {pixSavings > 0 && (
            <span className="text-xs text-emerald-700 font-medium">
              Produtor recebe {formatCurrency(pixSavings)} a mais
            </span>
          )}
        </PaymentOption>

        <PaymentOption
          selected={value === 'card'}
          onClick={() => onChange('card')}
          icon={<CardIcon className={cardIconClassName} />}
          title="Cartão de Credito"
          subtitle="Ate 12x com juros"
          badgeVariant="default"
        />
      </div>
    </fieldset>
  )
}
