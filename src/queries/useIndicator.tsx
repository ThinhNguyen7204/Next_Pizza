import indicatorApiRequest from '@/apiRequests/indicator'
import { DashboardIndicatorQueryParamsType } from '@/schemaValidations/indicator.schema'
import { useQuery } from '@tanstack/react-query'

export const useGetDashboardIndicators = (params: DashboardIndicatorQueryParamsType) => {
  return useQuery({
    queryKey: ['indicators', params.fromDate.toISOString(), params.toDate.toISOString()],
    queryFn: () => indicatorApiRequest.getDashboardIndicators(params)
  })
}
