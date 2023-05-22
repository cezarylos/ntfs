'use client';

import { useIsCurrentChainIdSameAsEventChainId } from '@/app/hooks/useIsCurrentChainIdSameAsEventChainId';
import { useCallback } from 'react';

export const useAddEventNetwork = (eventChainId: string): (() => Promise<void>) => {
  const isCurrentChainIdSameAsEventChainId = useIsCurrentChainIdSameAsEventChainId(eventChainId);

  return useCallback(async (): Promise<void> => {
    if (!window?.ethereum) {
      return;
    }
    try {
      if (isCurrentChainIdSameAsEventChainId) {
        return;
      }
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: eventChainId,
            rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
            chainName: 'Mumbai Testnet',
            nativeCurrency: {
              name: 'MATIC',
              symbol: 'MATIC',
              decimals: 18
            },
            blockExplorerUrls: ['https://polygonscan.com/']
          }
        ]
      });
    } catch (error) {
      console.log(error);
    }
  }, [eventChainId, isCurrentChainIdSameAsEventChainId]);
};
