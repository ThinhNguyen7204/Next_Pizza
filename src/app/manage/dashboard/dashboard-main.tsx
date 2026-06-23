'use client'

import { useState, useMemo } from "react"
import { ProductBarChart } from "@/app/manage/dashboard/product-bar-chart"
import { RevenueLineChart } from "@/app/manage/dashboard/revenue-line-chart"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useGetDashboardIndicators } from "@/queries/useIndicator"
import { formatCurrency } from "@/lib/utils"

const formatDateTimeLocal = (date: Date) => {
  const tzoffset = date.getTimezoneOffset() * 60000
  const localISOTime = new Date(date.getTime() - tzoffset).toISOString().slice(0, 16)
  return localISOTime
}

export default function DashBoardMain() {
  const initFromDate = useMemo(() => {
    const date = new Date()
    date.setDate(date.getDate() - 30)
    // Set to start of day
    date.setHours(0, 0, 0, 0)
    return date
  }, [])

  const initToDate = useMemo(() => {
    const date = new Date()
    // Set to end of day
    date.setHours(23, 59, 59, 999)
    return date
  }, [])

  const [fromDate, setFromDate] = useState<string>(formatDateTimeLocal(initFromDate))
  const [toDate, setToDate] = useState<string>(formatDateTimeLocal(initToDate))

  const { data: indicatorRes, isLoading } = useGetDashboardIndicators({
    fromDate: new Date(fromDate),
    toDate: new Date(toDate)
  })

  const stats = indicatorRes?.payload?.data

  const resetDateFilter = () => {
    setFromDate(formatDateTimeLocal(initFromDate))
    setToDate(formatDateTimeLocal(initToDate))
  }

  return (
    <div className="space-y-4">
      <div className='flex flex-wrap gap-2 items-center'>
        <div className='flex items-center'>
          <span className='mr-2 text-sm text-charcoal/70'>Từ</span>
          <Input
            type='datetime-local'
            placeholder='Từ ngày'
            className='text-sm text-black'
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className='flex items-center'>
          <span className='mr-2 text-sm text-charcoal/70'>Đến</span>
          <Input
            type='datetime-local'
            placeholder='Đến ngày'
            className='text-sm text-black'
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <Button className='cursor-pointer' variant={'outline'} onClick={resetDateFilter}>
          Reset
        </Button>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-charcoal/50">
          Đang tải dữ liệu báo cáo...
        </div>
      ) : (
        <>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-black'>Tổng doanh thu</CardTitle>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  className='h-4 w-4 text-muted-foreground'
                >
                  <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                </svg>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-black'>
                  {stats ? formatCurrency(stats.revenue) : '0đ'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-black'>Khách hàng</CardTitle>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  className='h-4 w-4 text-muted-foreground'
                >
                  <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                  <circle cx='9' cy='7' r='4' />
                  <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                </svg>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-black'>{stats?.guestCount || 0}</div>
                <p className='text-xs text-muted-foreground'>Khách hàng thành công</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-black'>Đơn hàng</CardTitle>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  className='h-4 w-4 text-muted-foreground'
                >
                  <rect width='20' height='14' x='2' y='5' rx='2' />
                  <path d='M2 10h20' />
                </svg>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-black'>{stats?.orderCount || 0}</div>
                <p className='text-xs text-muted-foreground'>Đã hoàn thành/thanh toán</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-black'>Bàn đang phục vụ</CardTitle>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  className='h-4 w-4 text-muted-foreground'
                >
                  <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                </svg>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-black'>{stats?.servingTableCount || 0}</div>
                <p className='text-xs text-muted-foreground'>Đơn đang chế biến/giao hàng</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className='lg:col-span-4'>
              <RevenueLineChart chartData={stats?.revenueByDate || []} />
            </div>
            <div className='lg:col-span-3'>
              <ProductBarChart chartData={stats?.dishIndicator || []} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}