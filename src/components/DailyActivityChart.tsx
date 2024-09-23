"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { day: "Mon", problems: 5, time: 60 },
  { day: "Tue", problems: 7, time: 90 },
  { day: "Wed", problems: 3, time: 45 },
  { day: "Thu", problems: 6, time: 75 },
  { day: "Fri", problems: 4, time: 50 },
  { day: "Sat", problems: 8, time: 120 },
  { day: "Sun", problems: 5, time: 70 },
]

const chartConfig = {
  problems: {
    label: "Problems Solved",
    color: "hsl(var(--chart-1))",
  },
  time: {
    label: "Time Spent (min)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function DailyActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Activity</CardTitle>
        <CardDescription>
          Problems solved and time spent this week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -20,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={5}
              yAxisId="left"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={5}
              yAxisId="right"
              orientation="right"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              yAxisId="left"
              dataKey="problems"
              type="monotone"
              fill="var(--color-problems)"
              fillOpacity={0.4}
              stroke="var(--color-problems)"
            />
            <Area
              yAxisId="right"
              dataKey="time"
              type="monotone"
              fill="var(--color-time)"
              fillOpacity={0.4}
              stroke="var(--color-time)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Activity up by 20% this week <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              38 problems solved, 510 minutes spent
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}