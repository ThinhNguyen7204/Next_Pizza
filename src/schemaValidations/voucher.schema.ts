import { DiscountTypeValues } from '@/constants/type'
import z from 'zod'

export const CreateVoucherBody = z.object({
  code: z.string().min(1).max(50),
  description: z.string().optional(),
  discount_type: z.enum(DiscountTypeValues),
  discount_value: z.number().positive(),
  min_order_value: z.number().optional(),
  max_discount: z.number().optional(),
  start_date: z.string(),
  end_date: z.string(),
  usage_limit: z.number().optional(),
  is_active: z.boolean().optional()
})
export type CreateVoucherBodyType = z.TypeOf<typeof CreateVoucherBody>
export const UpdateVoucherBody = CreateVoucherBody.partial()
export type UpdateVoucherBodyType = z.TypeOf<typeof UpdateVoucherBody>

export const VoucherRes = z.object({ data: z.any(), message: z.string() })
export type VoucherResType = z.TypeOf<typeof VoucherRes>
export const VoucherListRes = z.object({ data: z.array(z.any()), message: z.string() })
export type VoucherListResType = z.TypeOf<typeof VoucherListRes>
export const VoucherParams = z.object({ id: z.string() })
export type VoucherParamsType = z.TypeOf<typeof VoucherParams>

export const ValidateVoucherBody = z.object({ code: z.string().min(1) })
export type ValidateVoucherBodyType = z.TypeOf<typeof ValidateVoucherBody>
