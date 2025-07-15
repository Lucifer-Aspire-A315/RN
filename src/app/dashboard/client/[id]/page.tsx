
import { checkSessionAction } from '@/app/actions/authActions';
import { Header } from '@/components/layout/Header';
import { redirect } from 'next/navigation';
import { ClientDetailsView } from '@/components/dashboard/ClientDetailsView';
import { getPartnerClientDetails, disassociateClientAction } from '@/app/actions/partnerActions';

interface PartnerClientDetailsPageProps {
  params: { id: string };
}

export default async function PartnerClientDetailsPage({ params }: PartnerClientDetailsPageProps) {
  const user = await checkSessionAction();
  // This page is only for partners
  if (!user || user.type !== 'partner') {
    redirect('/login');
  }

  const { id: clientId } = params;

  try {
    const clientData = await getPartnerClientDetails(clientId);

    return (
      <div className="flex flex-col min-h-screen bg-secondary/50">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
          <ClientDetailsView 
            client={clientData?.client || null} 
            applications={clientData?.applications || []}
            onDisassociate={async () => {
              'use server';
              return disassociateClientAction(clientId);
            }}
            isPartnerView={true}
          />
        </main>
      </div>
    );
  } catch (error: any) {
    if (error.message.includes('Forbidden')) {
      redirect('/dashboard');
    }
    // Handle other potential errors like client not found
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
          <p>Error: Could not load client details.</p>
        </main>
      </div>
    );
  }
}
