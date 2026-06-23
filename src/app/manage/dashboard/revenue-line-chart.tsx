"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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
import { format, parse } from 'date-fns'

const chartConfig = {
  revenue: {
    label: "Doanh thu",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

interface Props {
  chartData: { date: string; revenue: number }[]
}

export function RevenueLineChart({ chartData }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu theo ngày</CardTitle>
        <CardDescription>Xem biểu đồ diễn biến doanh thu</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                try {
                  const date = parse(value, 'yyyy-MM-dd', new Date())
                  return format(date, 'dd/MM')
                } catch (e) {
                  return value
                }
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="revenue"
              type="linear"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Dữ liệu thống kê doanh số bán hàng trong khoảng thời gian đã chọn
        </div>
      </CardFooter>
    </Card>
  )
}
