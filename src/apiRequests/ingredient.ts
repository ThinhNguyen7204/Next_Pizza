import http from '@/lib/http'
import {
  CreateIngredientBodyType,
  IngredientListResType,
  IngredientResType,
  UpdateIngredientBodyType
} from '@/schemaValidations/ingredient.schema'

const prefix = 'ingredients'
const ingredientApiRequest = {
  list: () =>
    http.get<IngredientListResType>(prefix, { next: { tags: ['ingredients'] } }),
  add: (body: CreateIngredientBodyType) => http.post<IngredientResType>(prefix, body),
  getIngredient: (id: string) => http.get<IngredientResType>(`${prefix}/${id}`),
  updateIngredient: (id: string, body: UpdateIngredientBodyType) =>
    http.put<IngredientResType>(`${prefix}/${id}`, body),
  deleteIngredient: (id: string) => http.delete<IngredientResType>(`${prefix}/${id}`)
}

export default ingredientApiRequest
