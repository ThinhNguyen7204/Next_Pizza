import http from '@/lib/http'
import {
  CreateOrderBodyType,
  OrderListResType,
  OrderResType,
  UpdateOrderBodyType,
  OrderQueryType
} from '@/schemaValidations/order.schema'

const prefix = 'orders'
const orderApiRequest = {
  list: (queryParams?: OrderQueryType) => {
    const query = new URLSearchParams()
    if (queryParams?.customer_id) query.append('customer_id', queryParams.customer_id)
    if (queryParams?.status) query.append('status', queryParams.status)
    const queryString = query.toString()
    return http.get<OrderListResType>(`${prefix}${queryString ? `?${queryString}` : ''}`, {
      next: { tags: ['orders'] }
    })
  },
  add: (body: CreateOrderBodyType) => http.post<OrderResType>(prefix, body),
  getOrder: (id: string) => http.get<OrderResType>(`${prefix}/${id}`),
  updateOrder: (id: string, body: UpdateOrderBodyType) =>
    http.put<OrderResType>(`${prefix}/${id}`, body),
  deleteOrder: (id: string) => http.delete<OrderResType>(`${prefix}/delete/${id}`)
}

export default orderApiRequest
