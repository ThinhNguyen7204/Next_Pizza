import http from '@/lib/http'
import {
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  CreateGuestBodyType,
  CreateGuestResType,
  GetGuestListQueryParamsType,
  GetListGuestsResType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType
} from '@/schemaValidations/account.schema'

const prefix = '/accounts'
const accountApiRequest = {
  me: () => http.get<AccountResType>(`${prefix}/me`),
  sMe: (accessToken: string) =>
    http.get<AccountResType>(`${prefix}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>(`${prefix}/me`, body),
  changePassword: (body: ChangePasswordBodyType) =>
    http.put<AccountResType>(`${prefix}/change-password`, body),
  list: () => http.get<AccountListResType>(`${prefix}`),
  addEmployee: (body: CreateEmployeeAccountBodyType) =>
    http.post<AccountResType>(prefix, body),
  updateEmployee: (id: string, body: UpdateEmployeeAccountBodyType) =>
    http.put<AccountResType>(`${prefix}/detail/${id}`, body),
  getEmployee: (id: string) =>
    http.get<AccountResType>(`${prefix}/detail/${id}`),
  deleteEmployee: (id: string) =>
    http.delete<AccountResType>(`${prefix}/detail/${id}`),
  guestList: (queryParams: GetGuestListQueryParamsType) => {
    const params = new URLSearchParams()
    if (queryParams.fromDate) {
      params.append('fromDate', queryParams.fromDate.toISOString())
    }
    if (queryParams.toDate) {
      params.append('toDate', queryParams.toDate.toISOString())
    }
    return http.get<GetListGuestsResType>(`${prefix}/guests?${params.toString()}`)
  },
  createGuest: (body: CreateGuestBodyType) =>
    http.post<CreateGuestResType>(`${prefix}/guests`, body)
}

export default accountApiRequest
