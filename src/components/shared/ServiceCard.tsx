
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
    1: { bg: 'bg-chart-1/10', text: 'text-chart-1' },
    2: { bg: 'bg-chart-2/10', text: 'text-chart-2' },
    3: { bg: 'bg-chart-3/10', text: 'text-chart-3' },
    4: { bg: 'bg-chart-4/10', text: 'text-chart-4' },
    5: { bg: 'bg-chart-5/10', text: 'text-chart-5' },
  };

  const colorClasses = colors[colorIndex] || colors[1];
  
  return (
    <div
      className={cn(
        "bg-card p-8 rounded-xl shadow-lg flex flex-col text-center items-center border border-secondary transition-all duration-200 hover:border-primary hover:shadow-xl card-hover-effect"
      )}
    >
      <div className={cn('rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow', colorClasses.bg)}>
        <div className={colorClasses.text}>{icon}</div>
      </div>
      <h3 className={cn("text-xl font-semibold mt-6", colorClasses.text)}>{title}</h3>
      <p className="text-muted-foreground mt-2 flex-grow text-sm">{description}</p>
      <Button
        variant="link"
        className="inline-flex items-center justify-center mt-6 font-semibold text-primary hover:text-accent group p-0"
        onClick={() => setCurrentPage(targetPage)}
        aria-label={`Apply for ${title}`}
      >
        Apply Now
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
