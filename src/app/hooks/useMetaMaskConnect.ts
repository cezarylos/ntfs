import { useHasProvider } from '@/app/hooks/useHasProvider';
import { useMetaMask } from '@/app/hooks/useMetaMask';
import { connectMetamaskMobile, isMobileDevice } from '@/app/utils';
import { useCallback } from 'react';

export const useMetaMaskConnect = (): (() => void) => {
  const { connectMetaMask } = useMetaMask();
  const isMobile = isMobileDevice();
  const hasProvider = useHasProvider();

  return useCallback((): void => {
    if (hasProvider) {
      connectMetaMask();
      return;
    }
    if (isMobile) {
      connectMetamaskMobile();
      return;
    }
    window.open('https://metamask.io', '_blank', 'noopener,noreferrer');
  }, [connectMetaMask, hasProvider, isMobile]);
};
