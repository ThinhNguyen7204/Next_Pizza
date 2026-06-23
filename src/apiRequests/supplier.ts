import http from '@/lib/http'
import {
  CreateSupplierBodyType,
  SupplierListResType,
  SupplierResType,
  UpdateSupplierBodyType
} from '@/schemaValidations/supplier.schema'

const prefix = 'suppliers'
const supplierApiRequest = {
  list: () =>
    http.get<SupplierListResType>(prefix, { next: { tags: ['suppliers'] } }),
  add: (body: CreateSupplierBodyType) => http.post<SupplierResType>(prefix, body),
  getSupplier: (id: string) => http.get<SupplierResType>(`${prefix}/${id}`),
  updateSupplier: (id: string, body: UpdateSupplierBodyType) =>
    http.put<SupplierResType>(`${prefix}/${id}`, body),
  deleteSupplier: (id: string) => http.delete<SupplierResType>(`${prefix}/${id}`)
}

export default supplierApiRequest
