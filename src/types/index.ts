import { AccountType } from '@/schemaValidations/account.schema'

export type User = AccountType

export interface CartItem {
  productId: string
  sizeId: string
  sizeLabel: string
  productName: string
  price: number
  quantity: number
  image?: string
}
