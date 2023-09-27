'use client';

import GlobalLoader from '@/app/components/GlobalLoader/GlobalLoader';
import ConnectWeb3BlockerModal from '@/app/components/Modals/ConnectWeb3BlockerModal/ConnectWeb3BlockerModal';
import Navbar from '@/app/components/Navigation/Navbar';
import { navigationItems, NavigationRoutes } from '@/app/consts/navigation-items.const';
import { inter, mogra } from '@/app/layout';
import store from '@/app/store/store';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { usePathname } from 'next/navigation';
import { ReactNode, useMemo } from 'react';
import { Provider } from 'react-redux';
import { WagmiConfig } from 'wagmi';
import { polygon, polygonMumbai } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string;

const metadata = {
  name: 'RealBrain',
  url: 'https://realbrain.art',
  icons: ['https://prod-strapi-aws-s3-realbrain.s3.eu-north-1.amazonaws.com/preview_fyrtel_b2b3f3c44c.gif']
};

const chains = [polygon, polygonMumbai];
const wagmiConfig = defaultWagmiConfig({ projectId, chains, metadata });

createWeb3Modal({ wagmiConfig, projectId, chains });

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
        <WagmiConfig config={wagmiConfig}>
          <div className="overflow-auto left-0 right-0 top-0 fixed h-full bg-violet-500">
            <Navbar />
            <GlobalLoader />
            <ConnectWeb3BlockerModal />
            <div className="container max-w-md mx-auto h-[calc(100%-4rem)] p-4 flex flex-col">
              {sectionName && (
                <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:h-[90%] before:bg-pink-500 relative inline-block before:translate-x-[-0.5rem]">
                  <h1 className="text-5xl mb-2 text-white relative">{sectionName}</h1>
                </span>
              )}
              {children}
            </div>
          </div>
        </WagmiConfig>
      </Provider>
    </>
  );
}
