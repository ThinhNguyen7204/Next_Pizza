import MenuTable from '@/app/manage/menus/menu-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'

export default async function MenuPage() {
  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='space-y-2'>
        <Card x-chunk='dashboard-06-chunk-0'>
          <CardHeader>
            <CardTitle>Danh mục</CardTitle>
            <CardDescription>Quản lý phân loại món ăn (Pizza, Đồ uống, Món phụ...)</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Đang tải danh sách danh mục...</div>}>
              <MenuTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
