'use client';

import { MetaMaskContextProvider } from '@/app/hooks/useMetaMask';
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const Navigation = dynamic(() => import('../../components/Navigation/Navigation'), { ssr: false });

export default function DashboardLayout({
  children // will be a page or nested layout
}: {
  children: ReactNode;
}) {
  return (
    <>
      <MetaMaskContextProvider>
        <Navigation />
        {children}
      </MetaMaskContextProvider>
    </>
  );
}
