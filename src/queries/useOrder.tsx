import orderApiRequest from '@/apiRequests/order'
import {
  CreateOrderBodyType,
  UpdateOrderBodyType,
  OrderQueryType
} from '@/schemaValidations/order.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetOrderList = (queryParams?: OrderQueryType) => {
  return useQuery({
    queryKey: ['orders', queryParams],
    queryFn: () => orderApiRequest.list(queryParams)
  })
}

export const useGetOrderDetail = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => orderApiRequest.getOrder(id),
    enabled
  })
}

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: orderApiRequest.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['orders']
      })
    }
  })
}

export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateOrderBodyType & { id: string }) =>
      orderApiRequest.updateOrder(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['orders']
      })
    }
  })
}

export const useDeleteOrderMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: orderApiRequest.deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['orders']
      })
    }
  })
}
