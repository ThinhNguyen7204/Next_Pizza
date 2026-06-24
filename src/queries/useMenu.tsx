import menuApiRequest from '@/apiRequests/menu'
import {
  CreateMenuBodyType,
  UpdateMenuBodyType
} from '@/schemaValidations/menu.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetMenuList = () => {
  return useQuery({
    queryKey: ['menus'],
    queryFn: menuApiRequest.list
  })
}

export const useGetMenuDetail = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['menus', id],
    queryFn: () => menuApiRequest.getMenu(id),
    enabled
  })
}

export const useAddMenuMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: menuApiRequest.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['menus']
      })
    }
  })
}

export const useUpdateMenuMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateMenuBodyType & { id: string }) =>
      menuApiRequest.updateMenu(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['menus']
      })
    }
  })
}

export const useDeleteMenuMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: menuApiRequest.deleteMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['menus']
      })
    }
  })
}
