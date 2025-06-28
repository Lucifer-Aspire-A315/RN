import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle2, Zap, LayoutGrid } from 'lucide-react';

const steps = [
  {
    icon: <LayoutGrid className="w-10 h-10 text-primary" />,
    title: '1. Choose Your Service',
    description: 'Select from our wide range of loans, CA services, and government schemes tailored to your needs.',
  },
  {
    icon: <FileText className="w-10 h-10 text-accent" />,
    title: '2. Apply Online',
    description: 'Fill out our simple and secure online application form in just a few minutes from anywhere.',
  },
  {
    icon: <Zap className="w-10 h-10 text-yellow-500" />,
    title: '3. Quick Processing',
    description: 'Our expert team and advanced technology work together to review and process your application swiftly.',
  },
  {
    icon: <CheckCircle2 className="w-10 h-10 text-green-500" />,
    title: '4. Get Approved',
    description: 'Receive your loan disbursal, credit card, or service confirmation promptly upon approval.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-foreground">A Simple Path to Your Financial Goals</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          We've streamlined the entire process to be transparent, fast, and hassle-free. Here’s how it works.
        </p>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={step.title} className="bg-card text-center card-hover-effect border-2 border-transparent hover:border-primary">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center">
                  {step.icon}
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
