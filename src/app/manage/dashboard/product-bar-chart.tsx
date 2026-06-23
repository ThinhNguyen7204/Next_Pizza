"use client"

import { useMemo } from "react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  successOrders: {
    label: "Số lượng bán",
  }
} satisfies ChartConfig

interface Props {
  chartData: { product_name: string; successOrders: number }[]
}

export function ProductBarChart({ chartData }: Props) {
  const formattedData = useMemo(() => {
    return chartData.map((item, index) => ({
      name: item.product_name,
      successOrders: item.successOrders,
      fill: `var(--chart-${(index % 5) + 1})`
    }))
  }, [chartData])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Món ăn bán chạy</CardTitle>
        <CardDescription>Top các món được đặt nhiều nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={formattedData}
            layout="vertical"
            margin={{
              left: 10,
            }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 15) + (value.length > 15 ? '...' : '')}
            />
            <XAxis dataKey="successOrders" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="successOrders" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Thống kê dựa trên các đơn hàng đã thanh toán thành công
        </div>
      </CardFooter>
    </Card>
  )
}
