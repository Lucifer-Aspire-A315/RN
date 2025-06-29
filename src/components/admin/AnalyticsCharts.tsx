
"use client"

import * as React from "react"
import { Pie, PieChart, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
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

const PIE_COLORS: { [key: string]: string } = {
  Submitted: 'hsl(var(--chart-1))',
  'In Review': 'hsl(var(--chart-2))',
  Approved: 'hsl(var(--chart-3))',
  Rejected: 'hsl(var(--chart-4))',
};

const BAR_COLORS: { [key: string]: string } = {
  loan: 'hsl(var(--chart-1))',
  caService: 'hsl(var(--chart-2))',
  governmentScheme: 'hsl(var(--chart-3))',
};

const pieChartConfig = {
    applications: { label: "Applications" },
    Submitted: { label: "Submitted", color: "hsl(var(--chart-1))" },
    "In Review": { label: "In Review", color: "hsl(var(--chart-2))" },
    Approved: { label: "Approved", color: "hsl(var(--chart-3))" },
    Rejected: { label: "Rejected", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig

const barChartConfig = {
    count: { label: "Count" },
    loan: { label: "Loan", color: "hsl(var(--chart-1))" },
    caService: { label: "CA Service", color: "hsl(var(--chart-2))" },
    governmentScheme: { label: "Govt. Scheme", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig


export function AnalyticsCharts({ applications, isLoading }: AnalyticsChartsProps) {
  const statusCounts = React.useMemo(() => {
    const counts: { [key: string]: number } = {
      Submitted: 0, 'In Review': 0, Approved: 0, Rejected: 0,
    };
    applications.forEach(app => {
      if (counts[app.status] !== undefined) counts[app.status]++;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value, fill: PIE_COLORS[name] }))
      .filter(item => item.value > 0);
  }, [applications]);

  const typeCounts = React.useMemo(() => {
     const counts: { [key: string]: number } = { loan: 0, caService: 0, governmentScheme: 0 };
     applications.forEach(app => {
        if (counts[app.serviceCategory] !== undefined) counts[app.serviceCategory]++;
     });
     return Object.entries(counts).map(([name, count]) => ({
        name: barChartConfig[name as keyof typeof barChartConfig]?.label || name,
        count: count,
        fill: BAR_COLORS[name]
     }));
  }, [applications]);


  if (isLoading) {
    return (
        <Card className="h-full">
            <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
            <CardContent className="flex items-center justify-center">
                <Skeleton className="h-[250px] w-full" />
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Platform Analytics</CardTitle>
        <CardDescription>An overview of application statuses and types.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Status Pie Chart */}
            <div className="flex flex-col items-center">
                <h4 className="text-sm font-semibold mb-2">By Status</h4>
                {statusCounts.length > 0 ? (
                <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={statusCounts} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                            {statusCounts.map((entry) => (<Cell key={`cell-${entry.name}`} fill={entry.fill} />))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
                ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">No status data.</div>
                )}
            </div>

            {/* Type Bar Chart */}
            <div className="flex flex-col items-center">
                 <h4 className="text-sm font-semibold mb-2">By Type</h4>
                 {typeCounts.length > 0 ? (
                    <ChartContainer config={barChartConfig} className="w-full h-[250px]">
                        <BarChart data={typeCounts} margin={{ top: 20, right: 20, left: -10, bottom: 5 }} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} />
                            <RechartsTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Bar dataKey="count" radius={4} />
                        </BarChart>
                    </ChartContainer>
                 ) : (
                    <div className="flex items-center justify-center h-[250px] text-muted-foreground">No type data.</div>
                 )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
