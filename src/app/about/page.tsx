
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Award, Scale, Sparkles, HeartHandshake, Glasses, Target, Users as UsersIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const ValueCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: string }) => (
  <div 
    className="opacity-0 animate-fade-in-up group flex flex-col items-center text-center p-6 bg-card rounded-2xl border border-border/10 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
    style={{ animationDelay: delay }}
  >
    <div className="bg-primary/10 text-primary p-4 rounded-full mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground leading-relaxed text-sm flex-grow">{description}</p>
  </div>
);

const TeamMemberCard = ({ name, title, imageUrl, delay }: { name: string, title: string, imageUrl: string, delay: string }) => (
    <div 
        className="opacity-0 animate-fade-in-up group flex flex-col items-center text-center"
        style={{ animationDelay: delay }}
    >
        <div className="relative">
            <Avatar className="w-28 h-28 md:w-32 md:h-32 border-4 border-secondary transition-all duration-300 group-hover:border-primary">
                <AvatarImage src={imageUrl} alt={name} />
                <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
        </div>
        <h3 className="text-lg font-bold text-foreground mt-4">{name}</h3>
        <p className="text-primary font-medium">{title}</p>
    </div>
);


export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-secondary/20 py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.1),rgba(255,255,255,0))]"></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
            <div className="opacity-0 animate-fade-in-up">
              <Button asChild variant="ghost" className="mb-8">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
                Your Financial Goals, <br /> Our <span className="text-primary">Commitment.</span>
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                We are a technology-driven financial services marketplace, dedicated to simplifying the complexities of securing loans and financial instruments for individuals and businesses across India.
              </p>
            </div>
          </div>
        </section>

        {/* Who We Are Section */}
        <section className="py-16 md:py-24 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
                <div className="relative opacity-0 animate-fade-in-up order-1 md:order-1" style={{ animationDelay: '100ms' }}>
                     <div className="group rounded-2xl shadow-2xl overflow-hidden p-2 bg-gradient-to-br from-primary/20 to-accent/20 transition-all duration-500 hover:shadow-primary/30 hover:shadow-2xl">
                        <Image 
                            src="https://placehold.co/600x450.png"
                            alt="A diverse team collaborating in a modern office"
                            data-ai-hint="financial planning consultation"
                            width={600}
                            height={450}
                            className="rounded-xl w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                </div>
                <div className="order-2 md:order-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <h2 className="text-3xl font-bold text-primary mb-6">Who We Are</h2>
                    <div className="space-y-6 text-foreground text-lg">
                        <div>
                            <h3 className="font-semibold text-xl mb-2 flex items-center"><Target className="w-6 h-6 mr-3 text-primary" /> Our Mission</h3>
                            <p className="text-muted-foreground">To democratize access to financial products by leveraging technology, transparency, and a vast network of partners, ensuring every customer finds the best possible solution for their needs.</p>
                        </div>
                         <div>
                            <h3 className="font-semibold text-xl mb-2 flex items-center"><Award className="w-6 h-6 mr-3 text-primary" /> Our Vision</h3>
                            <p className="text-muted-foreground">To be India's most trusted and user-friendly financial marketplace, empowering millions to achieve their dreams with confidence and ease.</p>
                        </div>
                    </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Core Values Section */}
        <section className="py-16 md:py-24 bg-secondary/20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16 opacity-0 animate-fade-in-up">
              <h2 className="text-3xl font-bold text-foreground">Our Core Values</h2>
              <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                The principles that guide every decision we make.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <ValueCard 
                icon={<Scale size={32} />}
                title="Integrity"
                description="We operate with unwavering honesty and ethical standards, building relationships based on trust."
                delay="200ms"
              />
              <ValueCard 
                icon={<HeartHandshake size={32} />}
                title="Customer-Centric"
                description="Our customers are at the heart of everything we do. Your goals are our goals."
                delay="400ms"
              />
              <ValueCard 
                icon={<Sparkles size={32} />}
                title="Innovation"
                description="We continuously innovate our technology and processes to deliver a faster, simpler, and better experience."
                delay="600ms"
              />
              <ValueCard 
                icon={<Glasses size={32} />}
                title="Transparency"
                description="No hidden fees, no confusing jargon. We believe in clear and upfront communication."
                delay="800ms"
              />
            </div>
          </div>
        </section>
        
        {/* Our Impact Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6">
                 <div className="text-center mb-12 opacity-0 animate-fade-in-up">
                    <h2 className="text-3xl font-bold text-foreground">Our Impact in Numbers</h2>
                    <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                        We're proud of the trust we've built and the success we've helped create.
                    </p>
                </div>
                 <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                    <div className="opacity-0 animate-fade-in-up p-8 bg-card border-l-4 border-primary rounded-xl shadow-lg" style={{ animationDelay: '200ms' }}>
                        <p className="text-5xl font-extrabold text-primary">10,000+</p>
                        <p className="text-sm font-semibold text-muted-foreground mt-2">Happy Clients</p>
                    </div>
                    <div className="opacity-0 animate-fade-in-up p-8 bg-card border-l-4 border-accent rounded-xl shadow-lg" style={{ animationDelay: '400ms' }}>
                        <p className="text-5xl font-extrabold text-accent">₹500 Cr+</p>
                        <p className="text-sm font-semibold text-muted-foreground mt-2">Loans Disbursed</p>
                    </div>
                    <div className="opacity-0 animate-fade-in-up p-8 bg-card border-l-4 border-secondary-foreground rounded-xl shadow-lg" style={{ animationDelay: '600ms' }}>
                        <p className="text-5xl font-extrabold text-secondary-foreground">150+</p>
                        <p className="text-sm font-semibold text-muted-foreground mt-2">Bank & NBFC Partners</p>
                    </div>
                </div>
            </div>
        </section>
        
        {/* Meet Our Team Section */}
        <section className="py-16 md:py-24 bg-primary/5">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center mb-16 opacity-0 animate-fade-in-up">
                    <h2 className="text-3xl font-bold text-foreground">Meet Our Team</h2>
                    <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">The passionate minds dedicated to your financial success.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 max-w-6xl mx-auto">
                    <TeamMemberCard name="R. N. Singh" title="Founder & CEO" imageUrl="https://placehold.co/200x200.png" delay="200ms" data-ai-hint="man portrait"/>
                    <TeamMemberCard name="Priya Sharma" title="Head of Operations" imageUrl="https://placehold.co/200x200.png" delay="400ms" data-ai-hint="woman portrait"/>
                    <TeamMemberCard name="Amit Kumar" title="Lead Financial Advisor" imageUrl="https://placehold.co/200x200.png" delay="600ms" data-ai-hint="man portrait"/>
                    <TeamMemberCard name="Sunita Patel" title="Partner Relations" imageUrl="https://placehold.co/200x200.png" delay="800ms" data-ai-hint="woman portrait"/>
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <h2 className="text-3xl font-bold text-foreground">Ready to Take the Next Step?</h2>
                <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
                    Let's work together to turn your financial aspirations into reality. Explore our services or get in touch with our team today.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button asChild size="lg" className="transition-transform hover:scale-105">
                        <Link href="/#services">Explore Our Services</Link>
                    </Button>
                     <Button asChild size="lg" variant="outline" className="transition-transform hover:scale-105 hover:bg-primary/10">
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
