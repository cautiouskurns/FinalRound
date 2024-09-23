"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

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
  { topic: "Arrays", mastery: 80, average: 70 },
  { topic: "Linked Lists", mastery: 65, average: 60 },
  { topic: "Trees", mastery: 70, average: 55 },
  { topic: "Graphs", mastery: 55, average: 50 },
  { topic: "DP", mastery: 60, average: 45 },
  { topic: "Sorting", mastery: 85, average: 75 },
]

const chartConfig = {
  mastery: {
    label: "Your Mastery",
    color: "hsl(var(--chart-1))",
  },
  average: {
    label: "Average",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function TopicMasteryChart() {
  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Topic Mastery</CardTitle>
        <CardDescription>
          Your performance compared to average
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart
            data={chartData}
            margin={{
              top: -40,
              bottom: -10,
            }}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis dataKey="topic" />
            <PolarGrid />
            <Radar
              dataKey="mastery"
              fill="var(--color-mastery)"
              fillOpacity={0.6}
            />
            <Radar dataKey="average" fill="var(--color-average)" />
            <ChartLegend className="mt-8" content={<ChartLegendContent />} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 pt-4 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Above average in 5 out of 6 topics <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          Based on your recent performance
        </div>
      </CardFooter>
    </Card>
  )
}