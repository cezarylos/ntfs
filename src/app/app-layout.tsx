'use client';

import GlobalLoader from '@/app/components/GlobalLoader/GlobalLoader';
import ConnectWeb3BlockerModal from '@/app/components/Modals/ConnectWeb3BlockerModal/ConnectWeb3BlockerModal';
import Navbar from '@/app/components/Navigation/Navbar';
import { navigationItems, NavigationRoutes } from '@/app/consts/navigation-items.const';
import { MetaMaskContextProvider } from '@/app/hooks/useMetaMask';
import { bangers, inter, mogra } from '@/app/layout';
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
          --font-bangers: ${bangers.style.fontFamily};
        }
      `}</style>
      <Provider store={store}>
        <MetaMaskContextProvider>
          <div className="overflow-auto left-0 right-0 top-0 fixed h-full bg-violet-500">
            <Navbar />
            <GlobalLoader />
            <ConnectWeb3BlockerModal />
            <div className="container max-w-md mx-auto h-[calc(100%-4rem)] p-4">
              {sectionName && (
                <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:h-[90%] before:bg-pink-500 relative inline-block before:translate-x-[-0.5rem]">
                  <h1 className="text-5xl mb-2 text-white relative">{sectionName}</h1>
                </span>
              )}
              {children}
            </div>
          </div>
        </MetaMaskContextProvider>
      </Provider>
    </>
  );
}
