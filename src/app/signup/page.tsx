
"use client";

import React, { useEffect, useState } from 'react';
import { UserSignUpForm } from '@/components/forms/UserSignUpForm';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { getApprovedPartnerList } from '@/app/actions/adminActions';
import { Skeleton } from '@/components/ui/skeleton';

type Partner = {
  id: string;
  fullName: string;
};

function SignUpPageContent() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const partnerList = await getApprovedPartnerList();
        setPartners(partnerList);
      } catch (error) {
        console.error("Failed to fetch partners for signup form:", error);
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchPartners();
  }, []);

  if (isLoadingData) {
      return (
           <div className="max-w-md mx-auto space-y-6 bg-card p-8 rounded-xl shadow-lg">
                <div className="text-center space-y-4">
                    <Skeleton className="h-12 w-12 mx-auto rounded-full" />
                    <Skeleton className="h-8 w-48 mx-auto" />
                    <Skeleton className="h-5 w-64 mx-auto" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-12 w-full mt-4" />
                </div>
            </div>
      )
  }

  return <UserSignUpForm partners={partners} />;
}

export default function UserSignUpPage() {
  const { isLoading: isAuthLoading } = useAuth();
  
  if (isAuthLoading) {
      return (
         <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
              <section className="bg-secondary py-12 md:py-20 min-h-[calc(100vh-64px)] flex items-center">
                  <div className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-md mx-auto space-y-6 bg-card p-8 rounded-xl shadow-lg">
                        <div className="text-center space-y-4">
                            <Skeleton className="h-12 w-12 mx-auto rounded-full" />
                            <Skeleton className="h-8 w-48 mx-auto" />
                            <Skeleton className="h-5 w-64 mx-auto" />
                        </div>
                        <div className="space-y-6">
                            <Skeleton className="h-14 w-full" />
                            <Skeleton className="h-14 w-full" />
                            <Skeleton className="h-14 w-full" />
                            <Skeleton className="h-14 w-full" />
                            <Skeleton className="h-12 w-full mt-4" />
                        </div>
                    </div>
                  </div>
              </section>
          </main>
      </div>
      );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="bg-secondary py-12 md:py-20 min-h-[calc(100vh-64px)] flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <SignUpPageContent />
          </div>
        </section>
      </main>
    </div>
  );
}
