import z from 'zod'

export const AddToCartBody = z.object({ product_id: z.string(), quantity: z.number().min(1) })
export type AddToCartBodyType = z.TypeOf<typeof AddToCartBody>

export const UpdateCartItemBody = z.object({ quantity: z.number().min(1) })
export type UpdateCartItemBodyType = z.TypeOf<typeof UpdateCartItemBody>

export const CartRes = z.object({ data: z.any(), message: z.string() })
export type CartResType = z.TypeOf<typeof CartRes>
export const CartItemParams = z.object({ itemId: z.string() })
export type CartItemParamsType = z.TypeOf<typeof CartItemParams>
