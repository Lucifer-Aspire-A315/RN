
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
    1: { shadow: 'group-hover:shadow-[0_0_20px_hsl(var(--chart-1))]', iconBg: 'bg-chart-1/10', iconText: 'text-chart-1', gradientFrom: 'from-chart-1/20' },
    2: { shadow: 'group-hover:shadow-[0_0_20px_hsl(var(--chart-2))]', iconBg: 'bg-chart-2/10', iconText: 'text-chart-2', gradientFrom: 'from-chart-2/20' },
    3: { shadow: 'group-hover:shadow-[0_0_20px_hsl(var(--chart-3))]', iconBg: 'bg-chart-3/10', iconText: 'text-chart-3', gradientFrom: 'from-chart-3/20' },
    4: { shadow: 'group-hover:shadow-[0_0_20px_hsl(var(--chart-4))]', iconBg: 'bg-chart-4/10', iconText: 'text-chart-4', gradientFrom: 'from-chart-4/20' },
    5: { shadow: 'group-hover:shadow-[0_0_20px_hsl(var(--chart-5))]', iconBg: 'bg-chart-5/10', iconText: 'text-chart-5', gradientFrom: 'from-chart-5/20' },
  };

  const colorClasses = colors[colorIndex] || colors[1];
  
  return (
    <div
      onClick={() => setCurrentPage(targetPage)}
      className={cn(
        "group relative cursor-pointer overflow-hidden bg-card p-6 rounded-2xl shadow-lg flex flex-col text-center items-center border border-border/10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
      )}
    >
      {/* New bottom-up gradient effect */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 z-5 h-0 bg-gradient-to-t to-transparent transition-all duration-500 ease-in-out group-hover:h-full",
          colorClasses.gradientFrom
        )}
      />

      {/* Shine Effect */}
      <div className="absolute top-0 left-[-150%] h-full w-[50%] -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-700 ease-in-out group-hover:left-[150%] z-10" />

      {/* Card Content - must be relative z-20 to be above all effects */}
      <div className="relative z-20 flex h-full flex-col items-center">
          <div className={cn(
              'relative rounded-full w-16 h-16 flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110', 
              colorClasses.iconBg, 
              colorClasses.shadow
          )}>
            <div className={cn("relative z-10", colorClasses.iconText)}>{icon}</div>
          </div>
          <h3 className="text-xl font-bold text-foreground mt-6">{title}</h3>
          <p className="text-muted-foreground mt-2 flex-grow text-sm">{description}</p>
          <Button
            variant="link"
            className="inline-flex items-center justify-center mt-6 font-semibold text-primary group-hover:text-accent p-0"
            aria-label={`Apply for ${title}`}
            tabIndex={-1} 
          >
            Apply Now
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
      </div>
    </div>
  );
}
