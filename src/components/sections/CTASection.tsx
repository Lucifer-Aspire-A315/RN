import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CTASection() {
  return (
    <section className="bg-primary text-primary-foreground py-16 md:py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Ready to take the next step?</h2>
        <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
          Don't wait to achieve your dreams. Explore our services and start your application today. Our team is ready to assist you.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90 cta-button text-lg px-10 py-6">
            <Link href="/#services">
              Explore Our Services
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
