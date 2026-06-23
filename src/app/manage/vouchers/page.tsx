import VoucherTable from '@/app/manage/vouchers/voucher-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'

export default async function VoucherPage() {
  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='space-y-2'>
        <Card>
          <CardHeader>
            <CardTitle>Mã giảm giá</CardTitle>
            <CardDescription>Quản lý các chương trình ưu đãi bằng mã giảm giá</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Đang tải danh sách voucher...</div>}>
              <VoucherTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
