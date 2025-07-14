
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { FileText, CheckCircle2, Clock, XCircle } from 'lucide-react';

export interface Stat {
    label: string;
    value: number | string;
    type: 'total' | 'approved' | 'inReview' | 'rejected';
}

interface StatCardProps {
    stat: Stat;
}

const statConfig = {
    total: {
        icon: FileText,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
    },
    approved: {
        icon: CheckCircle2,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10'
    },
    inReview: {
        icon: Clock,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10'
    },
    rejected: {
        icon: XCircle,
        color: 'text-red-500',
        bg: 'bg-red-500/10'
    }
};

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
    const config = statConfig[stat.type];
    const Icon = config.icon;

    return (
        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <div className={cn(config.color, config.bg, "p-1.5 rounded-md")}>
                    <Icon className="h-5 w-5" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
        </Card>
    );
};

const StatCardSkeleton: React.FC = () => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-8 rounded-md" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-10 w-12" />
            </CardContent>
        </Card>
    );
};


interface DashboardStatsProps {
    stats: Stat[];
    isLoading: boolean;
}

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>
        );
    }
    
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <StatCard key={stat.type} stat={stat} />
            ))}
        </div>
    );
}
