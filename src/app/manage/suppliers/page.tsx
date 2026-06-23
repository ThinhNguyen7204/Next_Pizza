import SupplierTable from '@/app/manage/suppliers/supplier-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'

export default async function SupplierPage() {
  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='space-y-2'>
        <Card>
          <CardHeader>
            <CardTitle>Nhà cung cấp</CardTitle>
            <CardDescription>Quản lý danh sách nhà cung cấp nguyên liệu</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Đang tải bảng nhà cung cấp...</div>}>
              <SupplierTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
