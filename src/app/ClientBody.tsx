'use client';

import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Preloader } from '@/components/shared/Preloader';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth/AuthContext';

interface ClientBodyProps {
  children: React.ReactNode;
}

export function ClientBody({ children }: ClientBodyProps) {
  return (
    <AuthProvider>
      <Preloader finishDelay={1500} />
      <Layout>{children}</Layout>
      <Toaster />
    </AuthProvider>
  );
}
