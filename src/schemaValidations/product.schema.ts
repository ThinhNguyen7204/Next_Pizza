import { ProductStatusValues } from '~/constants/type'
import z from 'zod'

export const CreateProductBody = z.object({
  product_name: z.string().min(1).max(256),
  price: z.coerce.number().positive(),
  description: z.string().max(10000).optional(),
  image: z.string().nullable().optional(),
  size: z.string().optional(),
  menu_name: z.string().optional(),
  status: z.enum(ProductStatusValues).optional()
})
export type CreateProductBodyType = z.TypeOf<typeof CreateProductBody>

export const UpdateProductBody = CreateProductBody.partial()
export type UpdateProductBodyType = z.TypeOf<typeof UpdateProductBody>

export const ProductRes = z.object({ data: z.any(), message: z.string() })
export type ProductResType = z.TypeOf<typeof ProductRes>

export const ProductListRes = z.object({ data: z.array(z.any()), message: z.string() })
export type ProductListResType = z.TypeOf<typeof ProductListRes>

export const ProductParams = z.object({ id: z.string() })
export type ProductParamsType = z.TypeOf<typeof ProductParams>
