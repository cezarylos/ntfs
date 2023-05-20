'use client';

import MetaMaskHowTo from '@/app/components/MetaMaskHowTo/MetaMaskHowTo';
import { useHasProvider } from '@/app/hooks/useHasProvider';
import { MetaMaskContextProvider } from '@/app/hooks/useMetaMask';
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const Navbar = dynamic(() => import('@/app/components/Navigation/Navbar'), { ssr: false });

export default function DashboardLayout({
  children // will be a page or nested layout
}: {
  children: ReactNode;
}) {
  const hasProvider = useHasProvider();

  return (
    <>
      <MetaMaskContextProvider>
        <Navbar />
        {!hasProvider && <MetaMaskHowTo />}
        {children}
      </MetaMaskContextProvider>
    </>
  );
}
