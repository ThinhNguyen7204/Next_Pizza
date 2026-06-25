import http from '@/lib/http'
import {
  CreateSupportBodyType,
  SupportListResType,
  SupportResType,
  UpdateSupportBodyType
} from '@/schemaValidations/support.schema'

const prefix = 'supports'
const supportApiRequest = {
  list: () => http.get<SupportListResType>(prefix, { next: { tags: ['supports'] } }),
  mySupports: (email: string) =>
    http.get<SupportListResType>(`${prefix}/mine?email=${encodeURIComponent(email)}`, {
      next: { tags: ['supports'] }
    }),
  getSupportDetail: (id: string) => http.get<SupportResType>(`${prefix}/${id}`),
  create: (body: CreateSupportBodyType) => http.post<SupportResType>(prefix, body),
  update: (id: string, body: UpdateSupportBodyType) => http.put<SupportResType>(`${prefix}/${id}`, body)
}

export default supportApiRequest
