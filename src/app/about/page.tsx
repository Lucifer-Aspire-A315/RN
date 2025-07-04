
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Cpu, Users, ShieldCheck, Network, Smile, Banknote, Building } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const StatCard = ({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) => (
  <div className="flex flex-col items-center text-center p-6 bg-card/50 rounded-2xl border border-primary/10 transition-all duration-300 hover:bg-card hover:shadow-xl hover:-translate-y-2">
    <div className="bg-primary/10 text-primary p-4 rounded-full mb-4">
      {icon}
    </div>
    <p className="text-4xl font-bold text-foreground">{value}</p>
    <p className="text-sm text-muted-foreground mt-1">{label}</p>
  </div>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-card p-8 rounded-2xl shadow-lg border border-transparent hover:border-primary/20 transition-all duration-300">
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-secondary/30 py-20 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/.1),rgba(255,255,255,0))]"></div>
          <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
            <Button asChild variant="ghost" className="absolute top-[-4rem] left-4 mb-4 -ml-4">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight">
              Empowering Your Financial Future
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
              At RN FinTech, we blend technology with financial expertise to create a seamless, transparent, and personalized path to achieving your dreams.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-bold text-primary mb-4">Our Story</h2>
                <div className="prose dark:prose-invert max-w-none space-y-4 text-foreground text-lg">
                  <p>
                    Founded on the principles of trust and innovation, RN FinTech was born from a desire to simplify the often complex world of finance. We saw a need for a partner who could guide individuals and businesses through their financial journey with clarity and confidence.
                  </p>
                  <p>
                    Today, we leverage a powerful digital platform and an extensive network of over 150 financial institutions to offer tailored solutions that truly meet your needs. Our commitment is to make financial services accessible, understandable, and empowering for everyone.
                  </p>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="rounded-2xl shadow-2xl overflow-hidden p-2 bg-gradient-to-br from-primary/20 to-secondary/20">
                    <Image 
                        src="https://placehold.co/600x400.png"
                        alt="A modern office environment showing collaboration"
                        data-ai-hint="team collaboration"
                        width={600}
                        height={400}
                        className="rounded-xl w-full h-auto object-cover"
                    />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Why Choose RN FinTech?</h2>
              <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                We're more than just a service provider; we're your dedicated financial partner.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={<Cpu size={32} />}
                title="Tech-Driven Platform"
                description="Our smart, secure platform simplifies applications and speeds up approvals, saving you time and effort."
              />
              <FeatureCard 
                icon={<Users size={32} />}
                title="Expert Guidance"
                description="Our team of financial experts is always ready to provide personalized advice and support you at every step."
              />
              <FeatureCard 
                icon={<ShieldCheck size={32} />}
                title="Transparent Process"
                description="No hidden fees, no confusing jargon. We believe in a completely transparent process from start to finish."
              />
              <FeatureCard 
                icon={<Network size={32} />}
                title="Vast Network"
                description="With over 150+ partner banks and NBFCs, we find the best rates and terms tailored just for you."
              />
            </div>
          </div>
        </section>
        
        {/* Our Impact Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground">Our Impact in Numbers</h2>
                    <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                        We're proud of the trust we've built and the success we've helped create.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <StatCard icon={<Smile size={32} />} value="10,000+" label="Happy Clients Served" />
                    <StatCard icon={<Banknote size={32} />} value="₹500 Cr+" label="In Loans Disbursed" />
                    <StatCard icon={<Building size={32} />} value="150+" label="Partner Banks & NBFCs" />
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary/5">
            <div className="container mx-auto px-4 sm:px-6 text-center">
                <h2 className="text-3xl font-bold text-foreground">Ready to Take the Next Step?</h2>
                <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
                    Let's work together to turn your financial aspirations into reality. Explore our services or get in touch with our team today.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button asChild size="lg" className="cta-button">
                        <Link href="/#services">Explore Our Services</Link>
                    </Button>
                     <Button asChild size="lg" variant="outline">
                        <Link href="/contact">Contact Us</Link>
                    </Button>
                </div>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
