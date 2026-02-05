import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatCurrency, formatPercentage } from '../../domain/formatters'
import { PriceLine } from '../molecules'
import { BookIcon, CheckCircleIcon } from '../atoms'
import type { OrderSummaryProps } from './types'

const productImageStyles = 'w-16 h-16 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0'
const productTitleStyles = 'font-semibold text-foreground text-balance leading-tight'
const producerStyles = 'text-sm text-muted-foreground mt-1'
const badgeContainerStyles = 'flex items-center gap-2 mt-1'
const transparencyBoxStyles = 'p-3 rounded-lg bg-muted/50 space-y-2'
const savingsBoxStyles = 'p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2'

const feeValueStyles = (isFree: boolean) =>
  cn('font-medium', isFree ? 'text-emerald-600' : 'text-foreground')

export function OrderSummary({ product, fees, paymentMethod, installments }: OrderSummaryProps) {
  const discount = product.originalPrice - product.currentPrice
  const discountPercentage = Math.round((discount / product.originalPrice) * 100)

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className={productImageStyles}>
          <BookIcon className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={productTitleStyles}>{product.name}</h3>
          <p className={producerStyles}>por {product.producer}</p>
          <div className={badgeContainerStyles}>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              {product.format === 'digital' ? 'Digital' : 'Físico'}
            </Badge>
            <span className="text-xs text-muted-foreground">Entrega {product.deliveryTime}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border" />

      <div className="space-y-3">
        {discount > 0 && (
          <>
            <PriceLine
              label="Preço original"
              value={formatCurrency(product.originalPrice)}
              variant="strikethrough"
            />
            <PriceLine
              label={`Desconto (${discountPercentage}%)`}
              value={`-${formatCurrency(discount)}`}
              variant="discount"
            />
          </>
        )}

        <div className="border-t border-dashed border-border">
          <PriceLine label="Voce paga" value={formatCurrency(fees.buyerTotal)} variant="highlight" size="lg" />
        </div>

        {paymentMethod === 'card' && installments > 1 && (
          <p className="text-sm text-muted-foreground text-right">
            {installments}x de {formatCurrency(fees.buyerTotal / installments)}
          </p>
        )}
      </div>

      <div className="border-t border-border" />

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">Transparência de taxas</h4>

        <div className={transparencyBoxStyles}>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taxa da plataforma</span>
            <span className={feeValueStyles(fees.platformFee === 0)}>
              {fees.platformFee === 0
                ? 'Gratis!'
                : `${formatCurrency(fees.platformFee)} (${formatPercentage(fees.platformFeePercentage)})`}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Produtor recebe</span>
            <span className="font-medium text-foreground">{formatCurrency(fees.producerNetAmount)}</span>
          </div>
        </div>

        {paymentMethod === 'pix' && (
          <div className={savingsBoxStyles}>
            <CheckCircleIcon className="text-emerald-600 flex-shrink-0" />
            <span className="text-sm text-emerald-700 font-medium">
              O produtor recebe +{formatCurrency(fees.pixSavings)} com PIX!
            </span>
          </div>
        )}

        {paymentMethod === 'card' && (
          <p className="text-xs text-muted-foreground">
            Ao pagar com cartão, {formatCurrency(fees.platformFee)} sao descontados do produtor.
          </p>
        )}
      </div>
    </div>
  )
}
