'use client';

import { ReactNode } from 'react';
import { MetaMaskContextProvider } from '@/app/hooks/useMetaMask';
import dynamic from 'next/dynamic';
const Navigation = dynamic(() => import('../components/Navigation/Navigation'), { ssr: false });

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
