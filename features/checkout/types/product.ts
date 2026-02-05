export interface Product {
  id: number
  name: string
  originalPrice: number
  currentPrice: number
  producer: string
  format: 'digital' | 'physical'
  deliveryTime: string
}
