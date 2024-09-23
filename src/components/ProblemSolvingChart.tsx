"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { difficulty: "Easy", solved: 50, total: 100 },
  { difficulty: "Medium", solved: 30, total: 80 },
  { difficulty: "Hard", solved: 10, total: 40 },
]

const chartConfig = {
  solved: {
    label: "Solved",
    color: "hsl(var(--chart-1))",
  },
  total: {
    label: "Total",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ProblemSolvingChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Problem Solving Progress</CardTitle>
        <CardDescription>By Difficulty Level</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="difficulty"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="solved"
              stackId="a"
              fill="var(--color-solved)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="total"
              stackId="a"
              fill="var(--color-total)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Improvement by 15% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing solved vs total problems by difficulty
        </div>
      </CardFooter>
    </Card>
  )
}