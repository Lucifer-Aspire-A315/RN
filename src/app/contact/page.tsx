
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Building, Phone, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ContactUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
           <Button asChild variant="ghost" className="mb-4 -ml-4">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          <Card className="shadow-lg overflow-hidden">
            <CardHeader className="text-center bg-primary/5">
                <Mail className="w-16 h-16 mx-auto text-primary" />
                <CardTitle className="text-3xl mt-4">Contact Us</CardTitle>
                <CardDescription className="text-lg">We're here to help. Reach out to us anytime.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-12 p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
                {/* Email Card */}
                <div className="flex flex-col items-center">
                   <div className="flex-shrink-0 bg-accent/10 p-4 rounded-full">
                    <Mail className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mt-4">Email Us</h3>
                  <p className="text-muted-foreground mt-1">For inquiries, support, & feedback.</p>
                  <a href="mailto:contact@rnfintech.com" className="text-primary font-medium hover:underline break-all mt-2">contact@rnfintech.com</a>
                </div>
                
                {/* Phone Card */}
                 <div className="flex flex-col items-center">
                   <div className="flex-shrink-0 bg-accent/10 p-4 rounded-full">
                    <Phone className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mt-4">Call Us</h3>
                  <p className="text-muted-foreground mt-1">Talk to our experts directly.</p>
                  <a href="tel:+911234567890" className="text-primary font-medium hover:underline mt-2">+91 7219688018</a>
                </div>

                {/* Office Card */}
                 <div className="flex flex-col items-center sm:col-span-2 md:col-span-1">
                   <div className="flex-shrink-0 bg-accent/10 p-4 rounded-full">
                    <Building className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mt-4">Our Office</h3>
                  <p className="text-muted-foreground mt-1">Visit for a personal consultation.</p>
                   <p className="font-medium mt-2 text-foreground">Sunrise Apartment, A-101, Kalyan, Maharashtra 421301</p>
                </div>
              </div>
              
              <div className="bg-background p-8 rounded-2xl border-2 border-dashed">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground">Get In Touch</h3>
                    <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                        Have a question or a proposal? We'd love to hear from you. Drop us a line and we'll get back to you as soon as possible.
                    </p>
                     <div className="mt-6 inline-flex items-center justify-center p-4 rounded-lg bg-primary/10">
                        <Clock className="w-6 h-6 text-primary mr-3" />
                        <div>
                            <p className="font-semibold text-primary">Business Hours</p>
                            <p className="text-sm text-foreground">Monday - Saturday: 10:00 AM - 07:00 PM</p>
                        </div>
                    </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
