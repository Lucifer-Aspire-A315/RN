
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Target, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AboutUsPage() {
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
              <Users className="w-16 h-16 mx-auto text-primary" />
              <CardTitle className="text-3xl mt-4">About RN FinTech</CardTitle>
              <CardDescription className="text-lg">Empowering Your Financial Aspirations</CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none space-y-8 text-foreground p-8">
              <p className="text-center text-lg">
                RN FinTech is committed to providing transparent, quick, and easy financial solutions. We leverage technology to simplify the loan application process, offer competitive rates, and provide expert guidance for all your financial needs. Our mission is to empower individuals and businesses to achieve their financial aspirations with confidence.
              </p>

              <div className="grid md:grid-cols-2 gap-8 text-center">
                <div className="p-6 bg-background rounded-lg border">
                  <Target className="w-12 h-12 mx-auto text-accent" />
                  <h3 className="text-xl font-semibold mt-4">Our Mission</h3>
                  <p className="mt-2 text-muted-foreground">To make financial services accessible and understandable for everyone, using technology to create a seamless and user-friendly experience.</p>
                </div>
                <div className="p-6 bg-background rounded-lg border">
                  <ShieldCheck className="w-12 h-12 mx-auto text-accent" />
                  <h3 className="text-xl font-semibold mt-4">Our Commitment</h3>
                  <p className="mt-2 text-muted-foreground">We are dedicated to maintaining the highest standards of integrity, transparency, and security, ensuring your data and financial well-being are always protected.</p>
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
