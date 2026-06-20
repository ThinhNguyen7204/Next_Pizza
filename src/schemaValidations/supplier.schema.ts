import z from 'zod'

export const CreateSupplierBody = z.object({
  supplier_name: z.string().min(1).max(255),
  phone: z.string().optional(),
  rating: z.number().optional(),
  supplier_address: z.string().optional(),
  email: z.string().email().optional(),
  description: z.string().optional()
})
export type CreateSupplierBodyType = z.TypeOf<typeof CreateSupplierBody>
export const UpdateSupplierBody = CreateSupplierBody.partial()
export type UpdateSupplierBodyType = z.TypeOf<typeof UpdateSupplierBody>

export const SupplierRes = z.object({ data: z.any(), message: z.string() })
export type SupplierResType = z.TypeOf<typeof SupplierRes>
export const SupplierListRes = z.object({ data: z.array(z.any()), message: z.string() })
export type SupplierListResType = z.TypeOf<typeof SupplierListRes>
export const SupplierParams = z.object({ id: z.string() })
export type SupplierParamsType = z.TypeOf<typeof SupplierParams>
