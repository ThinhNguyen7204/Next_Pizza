import http from '@/lib/http'
import {
  CreateProductBodyType,
  ProductListResType,
  ProductResType,
  UpdateProductBodyType
} from '@/schemaValidations/product.schema'

const prefix = 'products'
const productApiRequest = {
  list: () =>
    http.get<ProductListResType>(prefix, { next: { tags: ['products'] } }),
  add: (body: CreateProductBodyType) => http.post<ProductResType>(prefix, body),
  getProduct: (id: string) => http.get<ProductResType>(`${prefix}/${id}`),
  updateProduct: (id: string, body: UpdateProductBodyType) =>
    http.put<ProductResType>(`${prefix}/${id}`, body),
  deleteProduct: (id: string) => http.delete<ProductResType>(`${prefix}/${id}`)
}

export default productApiRequest
