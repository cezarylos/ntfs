'use client';

import { useCallback } from 'react';
import { useIsCurrentChainIdSameAsEventChainId } from '@/app/hooks/useIsCurrentChainIdSameAsEventChainId';

export const useSwitchChain = (eventChainId: string): () => Promise<void> => {
  const isCurrentChainIdSameAsEventChainId = useIsCurrentChainIdSameAsEventChainId(eventChainId);

  return useCallback(async (): Promise<void> => {
    if (!window?.ethereum) {
      return;
    }
    if (isCurrentChainIdSameAsEventChainId) {
      return;
    }
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: eventChainId }]
      });
    } catch (error) {
      console.log(error);
    }
  }, [eventChainId, isCurrentChainIdSameAsEventChainId]);
};
