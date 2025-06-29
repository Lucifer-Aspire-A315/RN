
"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { UserApplication } from "@/lib/types"
import { Skeleton } from "../ui/skeleton"

interface AnalyticsChartsProps {
  applications: UserApplication[];
  isLoading: boolean;
}

const statusChartConfig = {
  applications: { label: "Applications" },
  Submitted: { label: "Submitted", color: "hsl(var(--chart-1))" },
  "In Review": { label: "In Review", color: "hsl(var(--chart-2))" },
  Approved: { label: "Approved", color: "hsl(var(--chart-3))" },
  Rejected: { label: "Rejected", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig

const typeChartConfig = {
  count: { label: "Count" },
  loan: { label: "Loan", color: "hsl(var(--chart-1))" },
  caService: { label: "CA Service", color: "hsl(var(--chart-2))" },
  governmentScheme: { label: "Govt. Scheme", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig


export function AnalyticsCharts({ applications, isLoading }: AnalyticsChartsProps) {
  const statusCounts = React.useMemo(() => {
    const counts: { [key: string]: number } = { Submitted: 0, 'In Review': 0, Approved: 0, Rejected: 0 };
    applications.forEach(app => {
      if (counts[app.status] !== undefined) counts[app.status]++;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value, fill: statusChartConfig[name as keyof typeof statusChartConfig]?.color }))
      .filter(item => item.value > 0);
  }, [applications]);
  
  const totalApplications = React.useMemo(() => applications.length, [applications]);


  const typeCounts = React.useMemo(() => {
     const counts: { [key: string]: number } = { loan: 0, caService: 0, governmentScheme: 0 };
     applications.forEach(app => {
        if (counts[app.serviceCategory] !== undefined) counts[app.serviceCategory]++;
     });
     return Object.entries(counts).map(([name, count]) => ({
        name: typeChartConfig[name as keyof typeof typeChartConfig]?.label || name,
        count: count,
        fill: typeChartConfig[name as keyof typeof typeChartConfig]?.color
     }));
  }, [applications]);


  if (isLoading) {
    return (
        <>
            <Card><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent className="flex items-center justify-center"><Skeleton className="h-[250px] w-full" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent className="flex items-center justify-center"><Skeleton className="h-[250px] w-full" /></CardContent></Card>
        </>
    )
  }

  return (
    <>
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Applications by Status</CardTitle>
                <CardDescription>A real-time overview of application statuses.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {statusCounts.length > 0 ? (
                    <ChartContainer config={statusChartConfig} className="mx-auto aspect-square h-[250px]">
                        <PieChart>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Pie data={statusCounts} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                                {statusCounts.map((entry) => (<Cell key={`cell-${entry.name}`} fill={entry.fill} />))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                ) : ( <div className="flex items-center justify-center h-[250px] text-muted-foreground">No application data.</div> )}
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm pt-4">
                <div className="flex w-full items-center justify-center gap-2 font-medium leading-none">Total Applications: {totalApplications}</div>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} className="flex justify-center" />
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Applications by Type</CardTitle>
                <CardDescription>A breakdown of submitted application categories.</CardDescription>
            </CardHeader>
            <CardContent>
                {typeCounts.some(t => t.count > 0) ? (
                    <ChartContainer config={typeChartConfig} className="h-[300px] w-full">
                        <BarChart accessibilityLayer data={typeCounts} margin={{ top: 20, left: -10, right: 10 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 10)} />
                            <YAxis />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Bar dataKey="count" radius={4}>
                                {typeCounts.map((entry) => (<Cell key={`cell-${entry.name}`} fill={entry.fill} />))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                ) : (<div className="flex items-center justify-center h-[300px] text-muted-foreground">No type data.</div>)}
            </CardContent>
        </Card>
    </>
  );
}
