import z from "zod";

export const DiscountTypeValues = ["Percentage", "FixedAmount"] as const;

export const CreateVoucherBody = z.object({
  code: z.string().min(1).max(50),
  description: z.string().max(10000).optional(),
  discount_type: z.enum(DiscountTypeValues),
  discount_value: z.coerce.number().positive(),
  min_order_value: z.coerce.number().optional(),
  max_discount: z.coerce.number().optional(),
  start_date: z.string(),
  end_date: z.string(),
  usage_limit: z.coerce.number().int().optional(),
  is_active: z.boolean().optional(),
});
export type CreateVoucherBodyType = z.TypeOf<typeof CreateVoucherBody>;

export const UpdateVoucherBody = CreateVoucherBody.partial();
export type UpdateVoucherBodyType = z.TypeOf<typeof UpdateVoucherBody>;

export const VoucherSchema = z.object({
  _id: z.string(),
  code: z.string(),
  description: z.string().nullable().optional(),
  discount_type: z.enum(DiscountTypeValues),
  discount_value: z.coerce.number(),
  min_order_value: z.coerce.number().optional(),
  max_discount: z.coerce.number().optional(),
  start_date: z.string(),
  end_date: z.string(),
  usage_limit: z.coerce.number().optional(),
  used_count: z.coerce.number().optional(),
  is_active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const VoucherRes = z.object({
  data: VoucherSchema,
  message: z.string(),
});
export type VoucherResType = z.TypeOf<typeof VoucherRes>;

export const VoucherListRes = z.object({
  data: z.array(VoucherSchema),
  message: z.string(),
});
export type VoucherListResType = z.TypeOf<typeof VoucherListRes>;

export const ValidateVoucherBody = z.object({
  code: z.string(),
});
export type ValidateVoucherBodyType = z.TypeOf<typeof ValidateVoucherBody>;

export const VoucherParams = z.object({ id: z.string() });
export type VoucherParamsType = z.TypeOf<typeof VoucherParams>;
