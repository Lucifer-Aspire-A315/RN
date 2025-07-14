
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
              <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
              <CardDescription>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 text-foreground text-base leading-relaxed">
              <section>
                <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
                <p>
                  Welcome to RN FinTech ("we", "our", "us"). We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, share, and protect your information when you use our website, apply for financial products, or interact with our services (collectively, the "Services").
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
                <p className="mb-4">To provide you with our Services, we may collect the following types of information:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Personal Identification Information:</strong> Name, email address, phone number, date of birth, mailing address, gender, PAN, and Aadhaar number.</li>
                  <li><strong>Financial Information:</strong> Income details (salary slips, ITR), bank account statements, employment details, existing loan information, credit history, and other data required for processing your applications.</li>
                  <li><strong>Documentary Data:</strong> Digital copies of your KYC documents, photographs, and any other documents you upload to support your application.</li>
                  <li><strong>Technical Information:</strong> IP address, browser type, device information, and usage data collected automatically when you interact with our website.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
                <p className="mb-4">Your information is used for the following primary purposes:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>To Process Your Applications:</strong> The core use of your data is to assess your eligibility for loans, credit cards, or other financial services and to submit your application to our network of partner banks and Non-Banking Financial Companies (NBFCs).</li>
                  <li><strong>To Communicate With You:</strong> To send you updates on your application status, respond to your inquiries, and provide customer support.</li>
                  <li><strong>To Improve Our Services:</strong> To analyze user behavior, improve our website functionality, and develop new products and services.</li>
                  <li><strong>For Legal and Security Purposes:</strong> To comply with legal obligations, prevent fraud, and enforce our terms of service.</li>
                </ul>
              </section>

               <section>
                <h2 className="text-xl font-semibold mb-2">4. Sharing Your Information</h2>
                <p className="mb-4">We do not sell your personal information. We may share your information with the following parties only as necessary to provide our Services:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Financial Institution Partners:</strong> We share your application data with the banks and NBFCs in our network from whom you are seeking a loan or financial product.</li>
                  <li><strong>Service Providers:</strong> We may use third-party companies for services like cloud hosting (e.g., Firebase) and analytics. These providers are contractually obligated to protect your data.</li>
                  <li><strong>Legal Authorities:</strong> We may disclose information if required by law or in response to valid requests by public authorities.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
                <p>
                  We implement robust technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes data encryption, access controls, and secure server infrastructure.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
                <p>
                  You have the right to access and review the information you have provided to us. You can update your profile information and view your application status through your dashboard. For any corrections or deletions, please contact our support team.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">7. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
                <p>
                  If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at: <a href="mailto:admin@rnfintech.com" className="text-primary hover:underline">admin@rnfintech.com</a>
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
