
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
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
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
              <CardDescription>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 text-foreground text-base leading-relaxed">
              <section>
                <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using the RN FinTech website and its services (collectively, "the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">2. Description of Service</h2>
                <p>
                  RN FinTech operates as a financial services marketplace. Our Service connects users with various financial products and services offered by third-party banks, Non-Banking Financial Companies (NBFCs), and other financial institutions ("Financial Partners"). RN FinTech is not a direct lender and does not make credit decisions. We facilitate the application process by collecting your information and submitting it to our Financial Partners on your behalf.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">3. User Accounts & Responsibilities</h2>
                <p>
                  To use our Service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during the registration and application processes.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">4. Limitation of Liability</h2>
                <p>
                 You expressly understand and agree that RN FinTech shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages resulting from the use or inability to use the Service. This includes, but is not limited to, the approval or rejection of your application by our Financial Partners, the terms of any loan or service offered, or any actions taken by our Financial Partners. Our liability is strictly limited to the service fees paid by you to us for a specific transaction, if any.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">5. Third-Party Links</h2>
                <p>
                  Our Service may contain links to third-party websites or services that are not owned or controlled by RN FinTech. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">6. Governing Law</h2>
                <p>
                  These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in Kalyan, Maharashtra.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">7. Contact Us</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us at: <a href="mailto:admin@rnfintech.com" className="text-primary hover:underline">admin@rnfintech.com</a>.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
