'use client';

import { useIsCurrentChainIdSameAsEventChainId } from '@/app/hooks/useIsCurrentChainIdSameAsEventChainId';
import { useCallback } from 'react';
import { toHex } from 'web3-utils';

export const useSwitchChain = (eventChainId: string): (() => Promise<void>) => {
  const isCurrentChainIdSameAsEventChainId = useIsCurrentChainIdSameAsEventChainId(eventChainId);

  return useCallback(async (): Promise<void> => {
    if (!window?.ethereum) {
      return;
    }
    if (isCurrentChainIdSameAsEventChainId) {
      return;
    }
    const chainId = toHex(eventChainId);
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }]
      });
    } catch (error) {
      console.log(error);
    }
  }, [eventChainId, isCurrentChainIdSameAsEventChainId]);
};
