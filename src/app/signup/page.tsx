
import { Header } from '@/components/layout/Header';
import { UserSignUpForm } from '@/components/forms/UserSignUpForm';
import { getApprovedPartnerList } from '@/app/actions/adminActions';
import type { PartnerData } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';


export default async function UserSignUpPage() {
  // This is now a server component, so we fetch data directly.
  const partners = await getApprovedPartnerList();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="bg-secondary py-12 md:py-20 min-h-[calc(100vh-64px)] flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <UserSignUpForm partners={partners} />
          </div>
        </section>
      </main>
    </div>
  );
}
