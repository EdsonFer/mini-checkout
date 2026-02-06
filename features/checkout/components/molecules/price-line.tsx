import { cn } from '@/lib/utils'
import { PriceLineProps } from './types'

const containerStyles = {
  sm: 'flex justify-between',
  lg: 'flex justify-between items-center pt-2',
}

const labelStyles = {
  default: 'text-muted-foreground',
  discount: 'text-emerald-600 font-medium',
  strikethrough: 'text-muted-foreground',
  highlight: 'font-semibold text-foreground',
}

const valueStyles = {
  default: 'font-medium text-foreground',
  discount: 'text-emerald-600 font-medium',
  strikethrough: 'text-muted-foreground line-through',
  highlight: 'text-2xl font-bold text-foreground',
}

export function PriceLine({ label, value, variant = 'default', size = 'sm' }: PriceLineProps) {
  const containerClassName = containerStyles[size]
  const labelClassName = cn(labelStyles[variant], size === 'sm' && 'text-sm')
  const valueClassName = cn(valueStyles[variant], size === 'sm' && 'text-sm')

  return (
    <div className={containerClassName}>
      <span className={labelClassName}>{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  )
}
