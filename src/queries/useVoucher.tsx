import voucherApiRequest from '@/apiRequests/voucher'
import {
  CreateVoucherBodyType,
  UpdateVoucherBodyType,
  ValidateVoucherBodyType
} from '@/schemaValidations/voucher.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetVoucherList = () => {
  return useQuery({
    queryKey: ['vouchers'],
    queryFn: voucherApiRequest.list
  })
}

export const useGetVoucherDetail = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['vouchers', id],
    queryFn: () => voucherApiRequest.getVoucher(id),
    enabled
  })
}

export const useAddVoucherMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: voucherApiRequest.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vouchers']
      })
    }
  })
}

export const useUpdateVoucherMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateVoucherBodyType & { id: string }) =>
      voucherApiRequest.updateVoucher(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vouchers']
      })
    }
  })
}

export const useDeleteVoucherMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: voucherApiRequest.deleteVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vouchers']
      })
    }
  })
}

export const useValidateVoucherMutation = () => {
  return useMutation({
    mutationFn: (body: ValidateVoucherBodyType) => voucherApiRequest.validateVoucher(body)
  })
}
