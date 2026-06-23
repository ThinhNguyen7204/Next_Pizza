import http from '@/lib/http'
import {
  DashboardIndicatorQueryParamsType,
  DashboardIndicatorResType
} from '@/schemaValidations/indicator.schema'

const prefix = 'indicators'
const indicatorApiRequest = {
  getDashboardIndicators: (params: DashboardIndicatorQueryParamsType) => {
    const query = new URLSearchParams({
      fromDate: params.fromDate.toISOString(),
      toDate: params.toDate.toISOString()
    })
    return http.get<DashboardIndicatorResType>(`${prefix}/dashboard?${query.toString()}`)
  }
}

export default indicatorApiRequest
