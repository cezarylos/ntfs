'use client';

import GlobalLoader from '@/app/components/GlobalLoader/GlobalLoader';
import Navbar from '@/app/components/Navigation/Navbar';
import { navigationItems, NavigationRoutes } from '@/app/consts/navigation-items.const';
import { MetaMaskContextProvider } from '@/app/hooks/useMetaMask';
import { inter, mogra } from '@/app/layout';
import store from '@/app/store/store';
import { usePathname } from 'next/navigation';
import { ReactNode, useMemo } from 'react';
import { Provider } from 'react-redux';

export default function AppLayout({
                                    children // will be a page or nested layout
                                  }: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const sectionName = useMemo(
    (): string =>
      navigationItems.find(({ href }) => href === pathname && pathname !== NavigationRoutes.HOME)?.label || '',
    [pathname]
  );

  return (
    <>
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
          --font-mogra: ${mogra.style.fontFamily};
        }
      `}</style>
      <Provider store={store}>
        <MetaMaskContextProvider>
          <GlobalLoader/>
          <Navbar/>
          <div className="overflow-auto pt-[5rem] left-0 right-0 absolute">
            <div className="container max-w-md mx-auto p-4 h-full">
              {sectionName && <h1 className="text-5xl font-bold mb-2 text-pink-400">{sectionName}</h1>}
              {children}
            </div>
          </div>
        </MetaMaskContextProvider>
      </Provider>
    </>
  );
}
