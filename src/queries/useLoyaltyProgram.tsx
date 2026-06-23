import loyaltyProgramApiRequest from '@/apiRequests/loyaltyProgram'
import {
  CreateLoyaltyProgramBodyType,
  UpdateLoyaltyProgramBodyType
} from '@/schemaValidations/loyaltyProgram.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetLoyaltyProgramList = () => {
  return useQuery({
    queryKey: ['loyalty-programs'],
    queryFn: loyaltyProgramApiRequest.list
  })
}

export const useGetLoyaltyProgramDetail = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['loyalty-programs', id],
    queryFn: () => loyaltyProgramApiRequest.getLoyaltyProgram(id),
    enabled
  })
}

export const useAddLoyaltyProgramMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: loyaltyProgramApiRequest.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['loyalty-programs']
      })
    }
  })
}

export const useUpdateLoyaltyProgramMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateLoyaltyProgramBodyType & { id: string }) =>
      loyaltyProgramApiRequest.updateLoyaltyProgram(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['loyalty-programs']
      })
    }
  })
}

export const useDeleteLoyaltyProgramMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: loyaltyProgramApiRequest.deleteLoyaltyProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['loyalty-programs']
      })
    }
  })
}
