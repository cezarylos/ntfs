import { useMetaMask } from '@/app/hooks/useMetaMask';
import { ChainsEnum } from '@/app/typings/chains.enum';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import * as React from 'react';
import { ReactElement } from 'react';

export default function ThirdWebProviderLayout({ children }: { children: React.ReactNode }): ReactElement {
  const { wallet } = useMetaMask();

  const activeChain = wallet?.chainId === ChainsEnum.POLYGON ? 'polygon' : 'mumbai';

  return (
    <ThirdwebProvider activeChain={activeChain} clientId={process.env.THIRDWEB_CLIENT_ID}>
      {children}
    </ThirdwebProvider>
  );
}
