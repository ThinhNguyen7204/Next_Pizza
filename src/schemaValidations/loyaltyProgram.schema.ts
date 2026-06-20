import z from 'zod'
import { DiscountTypeValues } from '~/constants/type'

export const CreateLoyaltyProgramBody = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  points_required: z.number().positive(),
  discount_type: z.enum(DiscountTypeValues),
  discount_value: z.number().positive(),
  is_active: z.boolean().optional()
})
export type CreateLoyaltyProgramBodyType = z.TypeOf<typeof CreateLoyaltyProgramBody>
export const UpdateLoyaltyProgramBody = CreateLoyaltyProgramBody.partial()
export type UpdateLoyaltyProgramBodyType = z.TypeOf<typeof UpdateLoyaltyProgramBody>

export const LoyaltyProgramRes = z.object({ data: z.any(), message: z.string() })
export type LoyaltyProgramResType = z.TypeOf<typeof LoyaltyProgramRes>
export const LoyaltyProgramListRes = z.object({ data: z.array(z.any()), message: z.string() })
export type LoyaltyProgramListResType = z.TypeOf<typeof LoyaltyProgramListRes>
export const LoyaltyProgramParams = z.object({ id: z.string() })
export type LoyaltyProgramParamsType = z.TypeOf<typeof LoyaltyProgramParams>
