
"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis, LineChart, Line } from "recharts"
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
import { subDays, format } from 'date-fns'

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

const applicationsByDateChartConfig = {
  applications: {
    label: "Applications",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig


export function AnalyticsCharts({ applications, isLoading }: AnalyticsChartsProps) {
  const statusCounts = React.useMemo(() => {
    const counts: { [key: string]: number } = { Submitted: 0, 'In Review': 0, Approved: 0, Rejected: 0 };
    applications.forEach(app => {
      const normalizedStatus = app.status.charAt(0).toUpperCase() + app.status.slice(1).toLowerCase();
      if (counts[normalizedStatus] !== undefined) {
        counts[normalizedStatus]++;
      } else if (app.status.toLowerCase() === 'in review') {
         counts['In Review']++;
      } else if (counts[app.status] !== undefined) {
        counts[app.status]++;
      }
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

  const applicationsByDate = React.useMemo(() => {
    const today = new Date();
    // Create an array of the last 30 dates, from 29 days ago to today
    const last30Days = Array.from({ length: 30 }, (_, i) => subDays(today, 29 - i));
    
    // Initialize daily counts with all 30 days having 0 applications
    const dailyCounts = last30Days.map(day => ({
      date: format(day, 'MMM dd'),
      total: 0,
    }));

    // Get the date 30 days ago to filter applications
    const thirtyDaysAgo = subDays(today, 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    applications.forEach(app => {
      const appDate = new Date(app.createdAt);
      // Check if the application was created within the last 30 days
      if (appDate >= thirtyDaysAgo) {
        const dateString = format(appDate, 'MMM dd');
        const dayData = dailyCounts.find(d => d.date === dateString);
        if (dayData) {
          dayData.total++;
        }
      }
    });

    return dailyCounts;
  }, [applications]);


  if (isLoading) {
    return (
        <>
            <Card><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent className="flex items-center justify-center"><Skeleton className="h-[250px] w-full" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent className="flex items-center justify-center"><Skeleton className="h-[250px] w-full" /></CardContent></Card>
            <Card className="lg:col-span-2"><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent className="flex items-center justify-center"><Skeleton className="h-[250px] w-full" /></CardContent></Card>
        </>
    )
  }

  return (
    <>
        <Card className="flex flex-col lg:col-span-1">
            <CardHeader>
                <CardTitle>Applications by Status</CardTitle>
                <CardDescription>A real-time overview of application statuses.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {statusCounts.length > 0 ? (
                    <ChartContainer config={statusChartConfig} className="mx-auto aspect-square h-[300px]">
                        <PieChart>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Pie data={statusCounts} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                                {statusCounts.map((entry) => (<Cell key={`cell-${entry.name}`} fill={entry.fill} />))}
                            </Pie>
                             <ChartLegend
                                content={<ChartLegendContent nameKey="name" />}
                                verticalAlign="bottom"
                                align="center"
                                wrapperStyle={{ paddingTop: '20px' }}
                            />
                        </PieChart>
                    </ChartContainer>
                ) : ( <div className="flex items-center justify-center h-[250px] text-muted-foreground">No application data.</div> )}
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm pt-4">
                 <div className="font-medium leading-none text-center">Total Applications: {totalApplications}</div>
            </CardFooter>
        </Card>

        <Card className="lg:col-span-1">
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
                            <YAxis allowDecimals={false} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Bar dataKey="count" radius={4}>
                                {typeCounts.map((entry) => (<Cell key={`cell-${entry.name}`} fill={entry.fill} />))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                ) : (<div className="flex items-center justify-center h-[300px] text-muted-foreground">No type data.</div>)}
            </CardContent>
        </Card>
        
         <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Applications Over Last 30 Days</CardTitle>
                <CardDescription>Daily submission trend for the past month.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={applicationsByDateChartConfig} className="h-[250px] w-full">
                    <LineChart accessibilityLayer data={applicationsByDate} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value, index) => {
                              // Show every 3rd label to prevent crowding
                              if (applicationsByDate.length > 10 && index % 3 !== 0) return "";
                              return value;
                            }}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          allowDecimals={false}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
                        <Line
                            dataKey="total"
                            type="natural"
                            stroke="var(--color-applications)"
                            strokeWidth={2}
                            dot={false}
                            name="Applications"
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    </>
  );
}
