'use client';

import Link from 'next/link';
import React, { ReactElement } from 'react';

import { useMetaMask } from '../../hooks/useMetaMask';
import { formatAddress, isMobileDevice } from '../../utils';

const Navigation = (): ReactElement => {
  const isMobile = isMobileDevice();
  const { wallet, hasProvider, isConnecting, connectMetaMask } = useMetaMask();

  return (
    <div>
      <div>
        <Link className="text-3xl font-bold underline" href={'/'}>
          TOKENY YEYEYEYYEYE
        </Link>
        <div>
          {!hasProvider && !isMobile && (
            <a href="https://metamask.io" target="_blank" rel="noreferrer">
              Install MetaMask
            </a>
          )}
          {window.ethereum?.isMetaMask && wallet.accounts.length < 1 && (
            <button disabled={isConnecting} onClick={connectMetaMask}>
              Connect MetaMask
            </button>
          )}
          {wallet.accounts.length > 0 && <p>{formatAddress(wallet.accounts[0])}</p>}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
