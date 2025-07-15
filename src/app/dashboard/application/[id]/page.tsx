
import { Header } from '@/components/layout/Header';
import { ApplicationDetailsView } from '@/components/application/ApplicationDetailsView';
import type { UserApplication } from '@/lib/types';
import { redirect } from 'next/navigation';
import { checkSessionAction } from '@/app/actions/authActions';
import { getApplicationDetails } from '@/app/actions/applicationActions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';


interface ApplicationDetailsPageProps {
  params: { id: string };
  searchParams: { category?: UserApplication['serviceCategory'] };
}

export default async function ApplicationDetailsPage({ params, searchParams }: ApplicationDetailsPageProps) {
  const user = await checkSessionAction();
  if (!user) {
    redirect('/login');
  }

  const { id } = params;
  const { category } = searchParams;

  if (!category) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                    <CardDescription>Service category not specified.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => redirect('/dashboard')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </CardContent>
            </Card>
        </main>
      </div>
    );
  }

  const applicationData = await getApplicationDetails(id, category);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        <ApplicationDetailsView
          applicationId={id}
          serviceCategory={category}
          initialApplicationData={applicationData}
          isAdmin={false}
        />
      </main>
    </div>
  );
}
