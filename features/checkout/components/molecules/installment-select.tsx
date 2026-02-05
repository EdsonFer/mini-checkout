import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { generateInstallmentOptions } from '../../domain/fee-calculator'
import { formatCurrency } from '../../domain/formatters'
import { InstallmentSelectProps } from './types'

export function InstallmentSelect({ value, productPrice, onChange }: InstallmentSelectProps) {
  const options = generateInstallmentOptions(12)

  const formatOptionLabel = (installment: number, feePercentage: number) => {
    const installmentValue = productPrice / installment
    const feeFormatted = feePercentage.toFixed(2).replace('.', ',')
    return `${installment}x de ${formatCurrency(installmentValue)} (taxa ${feeFormatted}%)`
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor="installments">Parcelas</Label>
      <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
        <SelectTrigger id="installments" className="h-11">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {formatOptionLabel(option.value, option.feePercentage)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
