import z from 'zod'

export const CartItemSchema = z.object({
  product_id: z.string(),
  quatity: z.coerce.number().int().positive(),
  price: z.coerce.number()
})

export const CartSchema = z.object({
  _id: z.string(),
  customer_id: z.string(),
  subTotal: z.coerce.number(),
  discountAmount: z.coerce.number(),
  voucher_id: z.string().optional(),
  discountLytP: z.coerce.number(),
  finalPrice: z.coerce.number(),
  loyalty_program_id: z.string().optional(),
  items: z.array(CartItemSchema),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const CartRes = z.object({
  data: CartSchema,
  message: z.string()
})
export type CartResType = z.TypeOf<typeof CartRes>

export const AddCartItemBody = z.object({
  product_id: z.string(),
  quatity: z.coerce.number().int().positive()
})
export type AddCartItemBodyType = z.TypeOf<typeof AddCartItemBody>

export const UpdateCartItemBody = z.object({
  quantity: z.coerce.number().int().positive()
})
export type UpdateCartItemBodyType = z.TypeOf<typeof UpdateCartItemBody>