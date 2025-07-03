
import { GovernmentSchemeLoanApplicationForm } from '@/components/forms/GovernmentSchemeLoanApplicationForm';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { checkSessionAction } from '@/app/actions/authActions';
import { LoginPrompt } from '@/components/shared/LoginPrompt';
import { notFound } from 'next/navigation';

interface ApplyGovernmentSchemePageProps {
    params: {
        scheme: string;
    }
}

const validSchemes: Record<string, string> = {
    'pm-mudra-yojana': 'PM Mudra Yojana',
    'pmegp-khadi-board': 'PMEGP (Khadi Board)',
    'stand-up-india': 'Stand-Up India',
};

export default async function ApplyGovernmentSchemePage({ params }: ApplyGovernmentSchemePageProps) {
  const user = await checkSessionAction();
  const { scheme } = params;

  const schemeDisplayName = validSchemes[scheme];
  if (!schemeDisplayName) {
      notFound();
  }

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
        <GovernmentSchemeLoanApplicationForm selectedScheme={schemeDisplayName} />
      </main>
      <Footer />
    </div>
  );
}
