import z from "zod";

export const OrderStatusValues = [
  "Pending",
  "Processing",
  "Shipping",
  "Delivered",
  "Cancelled",
  "Paid",
] as const;
export const DeliveryTypeValues = ["Delivery", "Takeaway", "DineIn"] as const;

export const OrderItemSchema = z.object({
  product_id: z.string(),
  product_name: z.string(),
  price: z.coerce.number(),
  quantity: z.coerce.number().positive(),
});

export const OrderSchema = z.object({
  _id: z.string(),
  order_date: z.string(),
  bonus_point: z.coerce.number(),
  paid: z.coerce.number(),
  delivery_type: z.enum(DeliveryTypeValues),
  payment_code: z.string().optional(),
  ship_code: z.string().optional(),
  customer_id: z.string(),
  status: z.enum(OrderStatusValues),
  address: z.string().optional(),
  orderTotal: z.coerce.number(),
  discountAmount: z.coerce.number(),
  discountLytP: z.coerce.number(),
  finalPrice: z.coerce.number(),
  voucher_id: z.string().optional(),
  loyalty_program_id: z.string().optional(),
  items: z.array(OrderItemSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const OrderRes = z.object({ data: OrderSchema, message: z.string() });
export type OrderResType = z.TypeOf<typeof OrderRes>;

export const OrderListRes = z.object({
  data: z.array(OrderSchema),
  message: z.string(),
});
export type OrderListResType = z.TypeOf<typeof OrderListRes>;

export const CreateOrderBody = z.object({
  customer_id: z.string(),
  delivery_type: z.enum(DeliveryTypeValues),
  address: z.string().optional(),
  items: z.array(OrderItemSchema),
  voucher_id: z.string().optional(),
  loyalty_program_id: z.string().optional(),
  orderTotal: z.coerce.number().optional(),
  discountAmount: z.coerce.number().optional(),
  discountLytP: z.coerce.number().optional(),
  finalPrice: z.coerce.number().optional(),
  paid: z.coerce.number().optional(),
});
export type CreateOrderBodyType = z.TypeOf<typeof CreateOrderBody>;

export const UpdateOrderStatusBody = z.object({
  status: z.enum(OrderStatusValues),
});
export type UpdateOrderStatusBodyType = z.TypeOf<typeof UpdateOrderStatusBody>;

export const OrderParams = z.object({ id: z.string() });
export type OrderParamsType = z.TypeOf<typeof OrderParams>;
