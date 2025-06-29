
"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { UserApplication } from "@/lib/types"

interface AnalyticsChartsProps {
  applications: UserApplication[];
}

const COLORS: { [key: string]: string } = {
  Submitted: 'hsl(var(--chart-1))',
  'In Review': 'hsl(var(--chart-2))',
  Approved: 'hsl(var(--chart-3))',
  Rejected: 'hsl(var(--chart-4))',
};

export function AnalyticsCharts({ applications }: AnalyticsChartsProps) {
  const statusCounts = React.useMemo(() => {
    const counts: { [key: string]: number } = {
      Submitted: 0,
      'In Review': 0,
      Approved: 0,
      Rejected: 0,
    };
    applications.forEach(app => {
      if (counts[app.status] !== undefined) {
        counts[app.status]++;
      }
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value, fill: COLORS[name] }))
      .filter(item => item.value > 0);
  }, [applications]);

  const chartConfig = {
    applications: {
      label: "Applications",
    },
    Submitted: {
      label: "Submitted",
      color: "hsl(var(--chart-1))",
    },
    "In Review": {
      label: "In Review",
      color: "hsl(var(--chart-2))",
    },
    Approved: {
      label: "Approved",
      color: "hsl(var(--chart-3))",
    },
    Rejected: {
      label: "Rejected",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig

  return (
     <Card>
      <CardHeader>
        <CardTitle>Application Status Overview</CardTitle>
        <CardDescription>A breakdown of all application statuses.</CardDescription>
      </CardHeader>
      <CardContent>
        {statusCounts.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={statusCounts}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              >
                 {statusCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
           <div className="flex items-center justify-center h-[250px] text-muted-foreground">
              No application data to display.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
