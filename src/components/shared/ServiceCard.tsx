
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { SetPageView, PageView } from '@/app/page';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorIndex: 1 | 2 | 3 | 4 | 5;
  targetPage: PageView;
  setCurrentPage: SetPageView;
}

export function ServiceCard({
  icon,
  title,
  description,
  colorIndex,
  targetPage,
  setCurrentPage,
}: ServiceCardProps) {
  const colors = {
    1: { to: 'to-chart-1/5', border: 'hover:border-chart-1/30', iconBg: 'bg-chart-1/10', iconText: 'text-chart-1' },
    2: { to: 'to-chart-2/5', border: 'hover:border-chart-2/30', iconBg: 'bg-chart-2/10', iconText: 'text-chart-2' },
    3: { to: 'to-chart-3/5', border: 'hover:border-chart-3/30', iconBg: 'bg-chart-3/10', iconText: 'text-chart-3' },
    4: { to: 'to-chart-4/5', border: 'hover:border-chart-4/30', iconBg: 'bg-chart-4/10', iconText: 'text-chart-4' },
    5: { to: 'to-chart-5/5', border: 'hover:border-chart-5/30', iconBg: 'bg-chart-5/10', iconText: 'text-chart-5' },
  };

  const colorClasses = colors[colorIndex] || colors[1];
  
  return (
    <div
      className={cn(
        "group bg-gradient-to-br from-card p-6 rounded-2xl shadow-lg flex flex-col text-center items-center border border-border/10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2",
        colorClasses.to,
        colorClasses.border
      )}
    >
      <div className={cn('relative rounded-full w-16 h-16 flex items-center justify-center mx-auto', colorClasses.iconBg)}>
        <div className={cn('absolute inset-0 rounded-full blur-md opacity-50', colorClasses.iconBg)} />
        <div className={cn("relative z-10", colorClasses.iconText)}>{icon}</div>
      </div>
      <h3 className="text-xl font-bold text-foreground mt-6">{title}</h3>
      <p className="text-muted-foreground mt-2 flex-grow text-sm">{description}</p>
      <Button
        variant="link"
        className="inline-flex items-center justify-center mt-6 font-semibold text-primary group-hover:text-accent group p-0"
        onClick={() => setCurrentPage(targetPage)}
        aria-label={`Apply for ${title}`}
      >
        Apply Now
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
