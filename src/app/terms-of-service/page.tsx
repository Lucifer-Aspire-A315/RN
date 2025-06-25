
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
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
            <CardHeader>
              <CardTitle className="text-3xl">Terms of Service</CardTitle>
              <CardDescription>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none space-y-6 text-foreground">
              <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the FinSol RN website ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this service will constitute acceptance of this agreement.
              </p>

              <h2 className="text-xl font-semibold">2. Description of Service</h2>
              <p>
                Our service provides users with access to financial information, loan application forms, and related services. You are responsible for obtaining access to the Service, and that access may involve third-party fees (such as Internet service provider or airtime charges). You are responsible for those fees.
              </p>

              <h2 className="text-xl font-semibold">3. User Accounts</h2>
              <p>
                To access certain features of the site, you may be required to create an account. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password. We reserve the right to refuse service, terminate accounts, remove or edit content in our sole discretion.
              </p>

              <h2 className="text-xl font-semibold">4. Limitation of Liability</h2>
              <p>
                You expressly understand and agree that FinSol RN (including its subsidiaries, affiliates, directors, officers, employees, representatives and providers) shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages, including but not limited to damages for loss of profits, opportunity, goodwill, use, data or other intangible losses, even if FinSol RN has been advised of the possibility of such damages, resulting from (i) any failure or delay (including without limitation the use of or inability to use any component of the Website), or (ii) any use of the Website or content, or (iii) the performance or non-performance by us or any provider, even if we have been advised of the possibility of damages to such parties or any other party, or (b) any damages to or viruses that may infect your computer equipment or other property as the result of your access to the Website or your downloading of any content from the Website.
              </p>
              <p>
                Notwithstanding the above, if FinSol RN is found liable for any proven and actual loss or damage which arises out of or in any way connected with any of the occurrences described above, then you agree that the liability of FinSol RN shall be restricted to, in the aggregate, any Service/transactional fees paid by you to FinSol RN in connection with such transaction(s)/ Services on this Website, if applicable.
              </p>
              <p>
                FinSol RN has no control over the third party websites which would be provided to you through its Website. You acknowledge and agree that under no circumstance shall FinSol RN be liable for your using the services offered or provided by any third party service provider.
              </p>

              <h2 className="text-xl font-semibold">5. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>

               <h2 className="text-xl font-semibold">Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at: contact@rnfintech.com
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
