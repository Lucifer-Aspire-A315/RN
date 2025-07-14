
import { AuditAndAssuranceForm } from '@/components/forms/AuditAndAssuranceForm';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { checkSessionAction } from '@/app/actions/authActions';
import { LoginPrompt } from '@/components/shared/LoginPrompt';
import { getUserProfileDetails } from '@/app/actions/profileActions';

export const dynamic = 'force-dynamic';

export default async function ApplyAuditAssurancePage() {
  const user = await checkSessionAction();

  if (!user) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <LoginPrompt />
            </main>
            <Footer />
        </div>
    );
  }
  
  const userProfile = await getUserProfileDetails();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <AuditAndAssuranceForm userProfile={userProfile} />
      </main>
      <Footer />
    </div>
  );
}
