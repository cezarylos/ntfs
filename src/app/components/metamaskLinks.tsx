import { useMetaMask } from '@/app/hooks/useMetaMask';
import { connectMetamaskMobile, isMobileDevice } from '@/app/utils';
import React, { ReactElement } from 'react';

const MetamaskLinks = (): ReactElement => {
  const { hasProvider } = useMetaMask();
  const isMobile = isMobileDevice();

  return (
    <>
      {isMobile && !hasProvider && (
        <>
          <p>MetaMask wallet is required to run this app</p>
          <a onClick={connectMetamaskMobile}>
            <button>Open in MetaMask</button>
          </a>
        </>
      )}
      {!isMobile && !hasProvider && (
        <a href="https://metamask.io" target="_blank" rel="noreferrer">
          <button style={{ height: '100px', width: '100px' }}>Install MetaMask</button>
        </a>
      )}
    </>
  );
};

export default MetamaskLinks;
