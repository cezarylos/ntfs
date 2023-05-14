'use client';

import { ReactNode } from 'react';
import { MetaMaskContextProvider } from '@/app/hooks/useMetaMask';
import { Navigation } from '@/app/components/Navigation';

export default function DashboardLayout({
  children // will be a page or nested layout
}: {
  children: ReactNode;
}) {
  return (
    <>
      <MetaMaskContextProvider>
        <Navigation />
      </MetaMaskContextProvider>
      {children}
    </>
  );
}
