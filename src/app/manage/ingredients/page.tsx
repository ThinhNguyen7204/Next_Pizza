import IngredientTable from '@/app/manage/ingredients/ingredient-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'

export default async function IngredientPage() {
  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='space-y-2'>
        <Card>
          <CardHeader>
            <CardTitle>Nguyên liệu</CardTitle>
            <CardDescription>Quản lý nguyên liệu trong kho</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Đang tải bảng nguyên liệu...</div>}>
              <IngredientTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
