import z from 'zod'

export const CreateCustomerBody = z.object({
  customer_id: z.string().min(1).max(10),
  account_id: z.string(),
  loyalty_points: z.number().optional()
})
export type CreateCustomerBodyType = z.TypeOf<typeof CreateCustomerBody>
export const UpdateCustomerBody = CreateCustomerBody.partial()
export type UpdateCustomerBodyType = z.TypeOf<typeof UpdateCustomerBody>

export const CustomerRes = z.object({ data: z.any(), message: z.string() })
export type CustomerResType = z.TypeOf<typeof CustomerRes>
export const CustomerListRes = z.object({ data: z.array(z.any()), message: z.string() })
export type CustomerListResType = z.TypeOf<typeof CustomerListRes>
export const CustomerParams = z.object({ id: z.string() })
export type CustomerParamsType = z.TypeOf<typeof CustomerParams>
