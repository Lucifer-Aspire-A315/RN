
import { redirect } from 'next/navigation';
import { checkSessionAction } from '@/app/actions/authActions';
import { Header } from '@/components/layout/Header';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';
import { getAllApplications, getPendingPartners, getAllPartners, getAllClientsForAdmin } from '@/app/actions/adminActions';

export default async function AdminDashboardPage() {
  const user = await checkSessionAction();

  if (!user || !user.isAdmin) {
    redirect('/login');
  }

  // Fetch all data on the server
  const [applications, pendingPartners, allPartners, allClients] = await Promise.all([
    getAllApplications(),
    getPendingPartners(),
    getAllPartners(),
    getAllClientsForAdmin()
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user.fullName}. Manage applications and partners here.</p>
        </div>
        
        <AdminDashboardClient 
            initialApplications={applications}
            initialPendingPartners={pendingPartners}
            initialAllPartners={allPartners}
            initialAllClients={allClients}
        />
      </main>
    </div>
  );
}
