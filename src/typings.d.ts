import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  // eslint-disable-next-line
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}
