import supportApiRequest from '@/apiRequests/support'
import { CreateSupportBodyType, UpdateSupportBodyType } from '@/schemaValidations/support.schema'
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'

export const useGetSupportList = () => {
  return useQuery({
    queryKey: ['supports'],
    queryFn: supportApiRequest.list,
    placeholderData: keepPreviousData
  })
}

export const useGetMySupports = (email: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['supports', 'mine', email],
    queryFn: () => supportApiRequest.mySupports(email),
    enabled: enabled && !!email,
    placeholderData: keepPreviousData
  })
}

export const useGetSupportDetail = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['supports', id],
    queryFn: () => supportApiRequest.getSupportDetail(id),
    enabled: enabled && !!id
  })
}

export const useCreateSupportMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: supportApiRequest.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['supports']
      })
    }
  })
}

export const useUpdateSupportMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateSupportBodyType & { id: string }) =>
      supportApiRequest.update(id, body),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['supports']
      })
      queryClient.invalidateQueries({
        queryKey: ['supports', variables.id]
      })
    }
  })
}
