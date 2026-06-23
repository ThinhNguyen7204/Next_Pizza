import ingredientApiRequest from '@/apiRequests/ingredient'
import {
  CreateIngredientBodyType,
  UpdateIngredientBodyType
} from '@/schemaValidations/ingredient.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetIngredientList = () => {
  return useQuery({
    queryKey: ['ingredients'],
    queryFn: ingredientApiRequest.list
  })
}

export const useGetIngredientDetail = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['ingredients', id],
    queryFn: () => ingredientApiRequest.getIngredient(id),
    enabled
  })
}

export const useAddIngredientMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ingredientApiRequest.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ingredients']
      })
    }
  })
}

export const useUpdateIngredientMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateIngredientBodyType & { id: string }) =>
      ingredientApiRequest.updateIngredient(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ingredients']
      })
    }
  })
}

export const useDeleteIngredientMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ingredientApiRequest.deleteIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ingredients']
      })
    }
  })
}
