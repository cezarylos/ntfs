'use client';

import { useMetaMask } from '../../hooks/useMetaMask';
import { formatAddress } from '../../utils';
import styles from './Navigation.module.css';
import Link from 'next/link';

export const Navigation = () => {

  const { wallet, hasProvider, isConnecting, connectMetaMask } = useMetaMask();

  if (!window) {
    return <></>;
  }

  return (
    <div className={styles.navigation}>
      <div className={styles.flexContainer}>
        <Link className={styles.leftNav} href={'/'}>TOKENY YEYEYEYYEYE</Link>
        <div className={styles.rightNav}>
          {!hasProvider &&
            <a href='https://metamask.io' target='_blank' rel='noreferrer'>
              Install MetaMask
            </a>
          }
          {window.ethereum?.isMetaMask && wallet.accounts.length < 1 &&
            <button disabled={isConnecting} onClick={connectMetaMask}>
              Connect MetaMask
            </button>
          }
          {wallet.accounts.length > 0 &&
            <p>{formatAddress(wallet.accounts[0])}</p>
          }
        </div>
      </div>
    </div>
  );
};
