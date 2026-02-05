export type PaymentMethod = 'pix' | 'card'

export interface CardFormData {
  number: string
  expiry: string
  cvv: string
  holderName: string
}

export interface FeeCalculation {
  buyerTotal: number
  platformFee: number
  platformFeePercentage: number
  producerNetAmount: number
  pixSavings: number
}

export interface InstallmentOption {
  value: number
  label: string
  feePercentage: number
}
