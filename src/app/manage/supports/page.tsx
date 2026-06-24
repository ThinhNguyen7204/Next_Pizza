import SupportTable from '@/app/manage/supports/support-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'

export default async function SupportPage() {
  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='space-y-2'>
        <Card x-chunk='dashboard-06-chunk-0'>
          <CardHeader>
            <CardTitle>Hỗ trợ khách hàng</CardTitle>
            <CardDescription>Quản lý các phản hồi, thắc mắc và yêu cầu hỗ trợ từ khách hàng</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Đang tải dữ liệu phản hồi...</div>}>
              <SupportTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
