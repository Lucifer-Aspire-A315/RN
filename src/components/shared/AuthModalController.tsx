
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AuthSelectionModal } from '@/components/shared/AuthSelectionModal';

export function AuthModalController() {
  const { isAuthModalOpen, authModalMode, closeAuthModal } = useAuth();

  return (
    <AuthSelectionModal
      open={isAuthModalOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          closeAuthModal();
        }
      }}
      mode={authModalMode}
    />
  );
}
