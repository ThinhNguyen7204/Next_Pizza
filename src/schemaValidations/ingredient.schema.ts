import z from 'zod'

export const CreateIngredientBody = z.object({
  name: z.string().min(1).max(255),
  quantity: z.number().optional(),
  expiration_date: z.string().optional()
})
export type CreateIngredientBodyType = z.TypeOf<typeof CreateIngredientBody>
export const UpdateIngredientBody = CreateIngredientBody.partial()
export type UpdateIngredientBodyType = z.TypeOf<typeof UpdateIngredientBody>

export const IngredientRes = z.object({ data: z.any(), message: z.string() })
export type IngredientResType = z.TypeOf<typeof IngredientRes>
export const IngredientListRes = z.object({ data: z.array(z.any()), message: z.string() })
export type IngredientListResType = z.TypeOf<typeof IngredientListRes>
export const IngredientParams = z.object({ id: z.string() })
export type IngredientParamsType = z.TypeOf<typeof IngredientParams>
