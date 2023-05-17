'use client';

import { ReactNode } from 'react';
import { MetaMaskContextProvider } from '@/app/hooks/useMetaMask';
const Navigation = dynamic(() => import('../components/Navigation/Navigation'), { ssr: false });
import dynamic from 'next/dynamic';

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
