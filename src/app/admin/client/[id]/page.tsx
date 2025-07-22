
import { checkSessionAction } from '@/app/actions/authActions';
import { Header } from '@/components/layout/Header';
import { redirect } from 'next/navigation';
import { ClientDetailsView } from '@/components/dashboard/ClientDetailsView';
import { adminGetClientDetails, adminRemoveClientAction, getApprovedPartnerList } from '@/app/actions/adminActions';

interface AdminClientDetailsPageProps {
  params: { id: string };
}

export default async function AdminClientDetailsPage({ params }: AdminClientDetailsPageProps) {
  const user = await checkSessionAction();
  if (!user?.isAdmin) {
    redirect('/login');
  }

  const { id: clientId } = params;

  // Fetch both client details and the list of partners to reassign to
  const [clientData, partners] = await Promise.all([
    adminGetClientDetails(clientId),
    getApprovedPartnerList()
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        <ClientDetailsView 
          client={clientData?.client || null} 
          applications={clientData?.applications || []}
          onPermanentDelete={async () => {
            'use server';
            return adminRemoveClientAction(clientId);
          }}
          isPartnerView={false}
          partnersForReassignment={partners}
        />
      </main>
    </div>
  );
}
