
import { checkSessionAction } from '@/app/actions/authActions';
import { Header } from '@/components/layout/Header';
import { redirect } from 'next/navigation';
import { PartnerDetailsView } from '@/components/admin/PartnerDetailsView';

interface AdminPartnerDetailsPageProps {
  params: { id: string };
}

export default async function AdminPartnerDetailsPage({ params }: AdminPartnerDetailsPageProps) {
  const user = await checkSessionAction();
  if (!user?.isAdmin) {
    redirect('/login');
  }

  const { id: partnerId } = params;

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        <PartnerDetailsView partnerId={partnerId} />
      </main>
    </div>
  );
}
