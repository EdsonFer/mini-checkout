import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PaymentOptionProps } from './types'

const baseStyles = 'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2'

const variantStyles = {
  selected: {
    success: 'border-emerald-500 bg-emerald-50 focus:ring-emerald-500',
    default: 'border-primary bg-muted/50 focus:ring-primary',
  },
  unselected: 'border-border bg-background hover:border-muted-foreground/30 hover:bg-muted/30',
}

const selectedBadgeStyles = {
  success: 'bg-emerald-500 text-white',
  default: 'bg-primary text-primary-foreground',
}

const titleStyles = {
  selected: {
    success: 'text-emerald-700',
    default: 'text-primary',
  },
  unselected: 'text-foreground',
}

const badgeStyles = {
  success: 'bg-emerald-100 text-emerald-600 border-emerald-200',
  default: 'bg-muted text-muted-foreground border-muted',
}

export function PaymentOption({
  selected,
  onClick,
  icon,
  title,
  badge,
  badgeVariant = 'default',
  subtitle,
  children,
}: PaymentOptionProps) {
  const buttonClassName = cn(
    baseStyles,
    selected ? variantStyles.selected[badgeVariant] : variantStyles.unselected
  )

  const titleClassName = cn(
    'font-semibold',
    selected ? titleStyles.selected[badgeVariant] : titleStyles.unselected
  )

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={buttonClassName}
    >
      {selected && (
        <span className={cn('absolute -top-2 -right-2 text-xs font-medium px-2 py-0.5 rounded-full', selectedBadgeStyles[badgeVariant])}>
          Selecionado
        </span>
      )}
      <div className="flex items-center gap-2">
        {icon}
        <span className={titleClassName}>{title}</span>
      </div>
      {badge && (
        <Badge variant="outline" className={badgeStyles[badgeVariant]}>
          {badge}
        </Badge>
      )}
      {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
      {children}
    </button>
  )
}
