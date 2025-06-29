
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-full">
            <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            {value === '...' ? (
                <Skeleton className="h-7 w-12 mt-1" />
            ) : (
                <p className="text-2xl font-bold text-foreground">{value}</p>
            )}
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
