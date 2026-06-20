import productApiRequest from '@/apiRequests/product'
import { UpdateProductBodyType } from '@/schemaValidations/product.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useProductListQuery = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productApiRequest.list
  })
}

export const useGetProductQuery = ({
  id,
  enabled
}: {
  id: string
  enabled: boolean
}) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productApiRequest.getProduct(id),
    enabled
  })
}

export const useAddProductMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: productApiRequest.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products']
      })
    }
  })
}

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...body }: UpdateProductBodyType & { id: string }) =>
      productApiRequest.updateProduct(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products'],
        exact: true
      })
    }
  })
}

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productApiRequest.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products']
      })
    }
  })
}
