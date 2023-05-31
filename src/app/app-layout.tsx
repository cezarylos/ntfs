'use client';

import GlobalLoader from '@/app/components/GlobalLoader/GlobalLoader';
import ConnectWeb3BlockerModal from '@/app/components/Modals/ConnectWeb3BlockerModal/ConnectWeb3BlockerModal';
import Navbar from '@/app/components/Navigation/Navbar';
import { navigationItems, NavigationRoutes } from '@/app/consts/navigation-items.const';
import { MetaMaskContextProvider } from '@/app/hooks/useMetaMask';
import { inter, mogra, rubikDirt } from '@/app/layout';
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
          --font-rubik-dirt: ${rubikDirt.style.fontFamily};
        }
      `}</style>
      <Provider store={store}>
        <MetaMaskContextProvider>
          <div
            className="overflow-auto left-0 right-0 top-0 fixed h-full bg-violet-500 bg-gradient-to-t from-pink-300 to-violet-600">
            <Navbar/>
            <GlobalLoader/>
            <ConnectWeb3BlockerModal/>
            <div className="container max-w-md mx-auto h-[calc(100%-4rem)] p-4">
              <span
                className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:h-[90%] before:bg-pink-500 relative inline-block before:translate-x-[-1rem]">
              {sectionName && <h1 className="text-5xl mb-2 text-lime-300 font-rubik-dirt relative">{sectionName}</h1>}
              </span>
              {children}
            </div>
          </div>
        </MetaMaskContextProvider>
      </Provider>
    </>
  );
}
