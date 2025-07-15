
import { Suspense } from 'react';
import { redirect } from 'next/navigation';

import { checkSessionAction } from '@/app/actions/authActions';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { getUserApplications } from '@/app/actions/dashboardActions';
import { getPartnerAnalytics } from '@/app/actions/partnerActions';

export default async function DashboardPage() {
  const user = await checkSessionAction();

  if (!user) {
    redirect('/login');
  }

  let applications = [];
  if (user.type === 'partner') {
    const analytics = await getPartnerAnalytics();
    applications = analytics.applications;
  } else {
    applications = await getUserApplications();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        <DashboardClient user={user} initialApplications={applications} />
      </main>
    </div>
  );
}
