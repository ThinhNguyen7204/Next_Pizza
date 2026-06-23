import supplierApiRequest from '@/apiRequests/supplier'
import {
  CreateSupplierBodyType,
  UpdateSupplierBodyType
} from '@/schemaValidations/supplier.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetSupplierList = () => {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: supplierApiRequest.list
  })
}

export const useGetSupplierDetail = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['suppliers', id],
    queryFn: () => supplierApiRequest.getSupplier(id),
    enabled
  })
}

export const useAddSupplierMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: supplierApiRequest.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['suppliers']
      })
    }
  })
}

export const useUpdateSupplierMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateSupplierBodyType & { id: string }) =>
      supplierApiRequest.updateSupplier(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['suppliers']
      })
    }
  })
}

export const useDeleteSupplierMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: supplierApiRequest.deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['suppliers']
      })
    }
  })
}
