import http from '@/lib/http'
import {
  CreateMenuBodyType,
  MenuListResType,
  MenuResType,
  UpdateMenuBodyType
} from '@/schemaValidations/menu.schema'

const prefix = 'menus'
const menuApiRequest = {
  list: () =>
    http.get<MenuListResType>(prefix, { next: { tags: ['menus'] } }),
  add: (body: CreateMenuBodyType) => http.post<MenuResType>(prefix, body),
  getMenu: (id: string) => http.get<MenuResType>(`${prefix}/${id}`),
  updateMenu: (id: string, body: UpdateMenuBodyType) =>
    http.put<MenuResType>(`${prefix}/${id}`, body),
  deleteMenu: (id: string) => http.delete<MenuResType>(`${prefix}/${id}`)
}

export default menuApiRequest
