import http from '@/lib/http'
import {
  CreateLoyaltyProgramBodyType,
  LoyaltyProgramListResType,
  LoyaltyProgramResType,
  UpdateLoyaltyProgramBodyType
} from '@/schemaValidations/loyaltyProgram.schema'

const prefix = 'loyalty-programs'
const loyaltyProgramApiRequest = {
  list: () =>
    http.get<LoyaltyProgramListResType>(prefix, { next: { tags: ['loyalty-programs'] } }),
  add: (body: CreateLoyaltyProgramBodyType) => http.post<LoyaltyProgramResType>(prefix, body),
  getLoyaltyProgram: (id: string) => http.get<LoyaltyProgramResType>(`${prefix}/${id}`),
  updateLoyaltyProgram: (id: string, body: UpdateLoyaltyProgramBodyType) =>
    http.put<LoyaltyProgramResType>(`${prefix}/${id}`, body),
  deleteLoyaltyProgram: (id: string) => http.delete<LoyaltyProgramResType>(`${prefix}/${id}`)
}

export default loyaltyProgramApiRequest
