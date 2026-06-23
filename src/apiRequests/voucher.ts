import http from '@/lib/http'
import {
  CreateVoucherBodyType,
  VoucherListResType,
  VoucherResType,
  UpdateVoucherBodyType,
  ValidateVoucherBodyType
} from '@/schemaValidations/voucher.schema'

const prefix = 'vouchers'
const voucherApiRequest = {
  list: () =>
    http.get<VoucherListResType>(prefix, { next: { tags: ['vouchers'] } }),
  add: (body: CreateVoucherBodyType) => http.post<VoucherResType>(prefix, body),
  getVoucher: (id: string) => http.get<VoucherResType>(`${prefix}/${id}`),
  updateVoucher: (id: string, body: UpdateVoucherBodyType) =>
    http.put<VoucherResType>(`${prefix}/${id}`, body),
  deleteVoucher: (id: string) => http.delete<VoucherResType>(`${prefix}/${id}`),
  validateVoucher: (body: ValidateVoucherBodyType) =>
    http.post<VoucherResType>(`${prefix}/validate`, body)
}

export default voucherApiRequest
