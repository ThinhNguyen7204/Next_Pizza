import { OrderStatusValues, DeliveryTypeValues } from '~/constants/type'
import z from 'zod'

export const OrderItemSchema = z.object({
  product_id: z.string(),
  product_name: z.string(),
  price: z.number(),
  quantity: z.number().min(1)
})

export const CreateOrderBody = z.object({
  customer_id: z.string(),
  delivery_type: z.enum(DeliveryTypeValues),
  address: z.string().optional(),
  items: z.array(OrderItemSchema).min(1),
  voucher_id: z.string().optional(),
  loyalty_program_id: z.string().optional(),
  orderTotal: z.number().optional(),
  discountAmount: z.number().optional(),
  discountLytP: z.number().optional(),
  finalPrice: z.number().optional(),
  paid: z.number().optional()
})
export type CreateOrderBodyType = z.TypeOf<typeof CreateOrderBody>

export const UpdateOrderBody = CreateOrderBody.partial()
export type UpdateOrderBodyType = z.TypeOf<typeof UpdateOrderBody>

export const OrderRes = z.object({ data: z.any(), message: z.string() })
export type OrderResType = z.TypeOf<typeof OrderRes>
export const OrderListRes = z.object({ data: z.array(z.any()), message: z.string() })
export type OrderListResType = z.TypeOf<typeof OrderListRes>
export const OrderParams = z.object({ id: z.string() })
export type OrderParamsType = z.TypeOf<typeof OrderParams>

export const OrderQuery = z.object({
  customer_id: z.string().optional(),
  status: z.string().optional()
})
export type OrderQueryType = z.TypeOf<typeof OrderQuery>
