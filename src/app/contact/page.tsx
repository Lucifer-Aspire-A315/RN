
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Mail, Phone, MapPin, Clock, HelpCircle, FileText, Timer, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const ContactInfoCard = ({
  icon: Icon,
  title,
  description,
  href,
  linkText,
  color,
}: {
  icon: React.ElementType;
  title: string;
  description: React.ReactNode;
  href: string;
  linkText: string;
  color: string;
}) => (
  <Card className="group relative text-center overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-primary hover:shadow-2xl hover:-translate-y-2">
    <div className={cn("absolute top-0 left-0 w-full h-1", color)} />
    <CardHeader className="items-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-8 w-8" />
      </div>
      <CardTitle className="mt-4">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-muted-foreground min-h-[40px]">{description}</div>
      <Button asChild variant="link" className="mt-4 text-primary">
        <a href={href} target="_blank" rel="noopener noreferrer">{linkText}</a>
      </Button>
    </CardContent>
  </Card>
);

const faqs = [
    {
      icon: Clock,
      question: "What are your business hours?",
      answer: "Our team is available from Monday to Saturday, between 10:00 AM and 07:00 PM. We are closed on Sundays and public holidays."
    },
    {
      icon: FileText,
      question: "What documents are generally required for a loan?",
      answer: "Commonly required documents include PAN card, Aadhaar card, bank statements (last 6-12 months), salary slips or ITR (for income proof), and property documents for home loans. The specific list may vary by product."
    },
    {
      icon: Timer,
      question: "How long does the approval process take?",
      answer: "The approval timeline varies depending on the type of loan and the completeness of your documents. Personal loans can be approved within 1-3 days, while home and business loans may take 7-15 days."
    },
    {
      icon: UserCheck,
      question: "Can I apply on behalf of someone else?",
      answer: "Yes, as a registered partner, you can submit applications on behalf of your clients through our Partner Dashboard. If you are not a partner, you must apply for yourself."
    }
];


export default function ContactUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-secondary/20 py-16 text-center">
          <div className="container mx-auto px-4 sm:px-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">Get in Touch</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              We're here to help you with your financial needs. Whether you have a question about our services or need support with your application, our team is ready to assist you.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 py-16">
            <Button asChild variant="ghost" className="mb-8 -ml-4">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          
            {/* Contact Methods Section */}
            <section id="contact-methods" className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ContactInfoCard
                icon={Mail}
                title="Email Us"
                description="For inquiries, support, & feedback."
                href="mailto:contact@rnfintech.com"
                linkText="contact@rnfintech.com"
                color="bg-chart-1"
              />
              <ContactInfoCard
                icon={Phone}
                title="Call Us"
                description="Talk to our experts directly for quick assistance."
                href="tel:+917039501225"
                linkText=" 703-950-1225"
                color="bg-chart-2"
              />
              <ContactInfoCard
                icon={MapPin}
                title="Our Office"
                description={<p>Sunrise Apartment, A-101, Kalyan, <br/> Maharashtra 421301</p>}
                href="https://www.google.com/maps/search/?api=1&query=Sunrise+Apartment,+A-101,+Kalyan,+Maharashtra+421301"
                linkText="Get Directions"
                color="bg-chart-3"
              />
            </section>
          
            {/* FAQ Section */}
            <section id="faq" className="mt-24 max-w-4xl mx-auto">
               <div className="text-center mb-12">
                  <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
                  <p className="mt-2 text-muted-foreground">Find quick answers to common questions.</p>
               </div>
               <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => {
                  const Icon = faq.icon;
                  return (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger className="text-lg hover:no-underline">
                        <div className="flex items-center gap-4">
                          <Icon className="w-5 h-5 text-primary" />
                          <span>{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-muted-foreground pl-11">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
