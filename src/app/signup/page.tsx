
import { Header } from '@/components/layout/Header';
import { UserSignUpForm } from '@/components/forms/UserSignUpForm';
import { getApprovedPartnerList } from '@/app/actions/adminActions';

interface UserSignUpPageProps {
  searchParams: {
    ref?: string;
  };
}

export default async function UserSignUpPage({ searchParams }: UserSignUpPageProps) {
  // Fetch all approved partners to populate the optional dropdown
  const partners = await getApprovedPartnerList();
  const referralCode = searchParams.ref;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="bg-secondary py-12 md:py-20 min-h-[calc(100vh-64px)] flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <UserSignUpForm partners={partners} referralCode={referralCode} />
          </div>
        </section>
      </main>
    </div>
  );
}
