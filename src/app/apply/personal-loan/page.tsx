
import { PersonalLoanApplicationForm } from '@/components/forms/PersonalLoanApplicationForm';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { checkSessionAction } from '@/app/actions/authActions';
import { LoginPrompt } from '@/components/shared/LoginPrompt';

export const dynamic = 'force-dynamic';

export default async function ApplyPersonalLoanPage() {
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <PersonalLoanApplicationForm />
      </main>
      <Footer />
    </div>
  );
}
