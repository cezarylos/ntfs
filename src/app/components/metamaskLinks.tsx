import React, { ReactElement } from 'react';
import { isMobileDevice } from '@/app/utils';
import { useMetaMask } from '@/app/hooks/useMetaMask';

const MetamaskLinks = (): ReactElement => {
  const { hasProvider } = useMetaMask();
  const isMobile = isMobileDevice();

  const connectMetamaskMobile = (): void => {
    const dappUrl = window.location.href.split('//')[1].split('/')[0];
    const metamaskAppDeepLink = 'https://metamask.app.link/dapp/' + dappUrl;
    window.open(metamaskAppDeepLink, '_self');
  };

  return <>
    {isMobile && !hasProvider &&
        <>
            <p>MetaMask wallet is required to run this app</p>
            <a onClick={connectMetamaskMobile}><button>Open in MetaMask</button></a>
        </>
    }
    {!isMobile && !hasProvider &&
        <a href='https://metamask.io' target='_blank' rel='noreferrer'>
            <button style={{ height: '100px', width: '100px' }}>Install MetaMask</button>
        </a>
    }
    </>
}

export default MetamaskLinks;
