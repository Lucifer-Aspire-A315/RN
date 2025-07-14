
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PartnerNewApplicationPortal } from '@/components/dashboard/PartnerNewApplicationPortal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewApplicationPage() {
    return (
        <div className="flex flex-col min-h-screen bg-secondary/30">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
                <Button asChild variant="ghost" className="mb-4 -ml-4">
                  <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Link>
                </Button>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>New Application Portal</CardTitle>
                        <CardDescription>
                            Select a service below to start a new application.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PartnerNewApplicationPortal />
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
}
