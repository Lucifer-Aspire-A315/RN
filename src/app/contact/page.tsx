import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Building } from 'lucide-react';
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
          <Card className="shadow-lg">
            <CardHeader className="text-center">
                <Mail className="w-16 h-16 mx-auto text-primary" />
                <CardTitle className="text-3xl mt-4">Contact Us</CardTitle>
                <CardDescription className="text-lg">We're here to help. Reach out to us anytime.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-start space-x-4 p-6 rounded-lg bg-background border">
                  <div className="flex-shrink-0 bg-accent/10 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Email Us</h3>
                    <p className="text-muted-foreground">For any inquiries, support, or feedback.</p>
                    <a href="mailto:contact@rnfintech.com" className="text-primary font-medium hover:underline break-all">contact@rnfintech.com</a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 rounded-lg bg-background border">
                  <div className="flex-shrink-0 bg-accent/10 p-3 rounded-full">
                    <Building className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Visit Our Office</h3>
                    <p className="text-muted-foreground">We welcome you to visit our office for a personal consultation.</p>
                    <p className="font-medium mt-1">Sunrise Apartment, A-101, Santoshi Mata Rd, near Yashoda Apartment, near KDMC Commissioners Bunglow, Syndicate, Kalyan, Maharashtra 421301</p>
                  </div>
                </div>
              </div>
               <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden border">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.579603204964!2d73.1415486759083!3d19.21360184650631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be79586145610d7%3A0x63366838a783318f!2sSunrise%20Apartment!5e0!3m2!1sen!2sin!4v1700000000000"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="RN FinTech Office Location"
                    ></iframe>
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
