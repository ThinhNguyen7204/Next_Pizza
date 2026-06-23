import PromoteTable from '@/app/manage/promotes/promote-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'

export default async function PromotePage() {
  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='space-y-2'>
        <Card>
          <CardHeader>
            <CardTitle>Chương trình ưu đãi</CardTitle>
            <CardDescription>Quản lý các chương trình ưu đãi, tích điểm của khách hàng thân thiết</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Đang tải danh sách ưu đãi...</div>}>
              <PromoteTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
