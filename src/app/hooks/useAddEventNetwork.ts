'use client';

import { useIsCurrentChainIdSameAsEventChainId } from '@/app/hooks/useIsCurrentChainIdSameAsEventChainId';
import { ChainsEnum } from '@/app/typings/chains.enum';
import { polygonRPC } from '@/app/utils';
import { useCallback } from 'react';

export const useAddEventNetwork = (eventChainId: string): (() => Promise<void>) => {
  const isCurrentChainIdSameAsEventChainId = useIsCurrentChainIdSameAsEventChainId(eventChainId);

  return useCallback(async (): Promise<void> => {
    if (!window?.ethereum) {
      return;
    }
    try {
      if (isCurrentChainIdSameAsEventChainId || isCurrentChainIdSameAsEventChainId === undefined) {
        return;
      }
      const params =
        eventChainId === ChainsEnum.POLYGON
          ? {
              chainId: eventChainId,
              rpcUrls: [polygonRPC],
              chainName: 'Polygon',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
              },
              blockExplorerUrls: ['https://polygonscan.com/']
            }
          : {
              chainId: eventChainId,
              rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
              chainName: 'Mumbai Testnet',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
              },
              blockExplorerUrls: ['https://polygonscan.com/']
            };
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [params]
      });
    } catch (error) {
      console.error(error);
    }
  }, [eventChainId, isCurrentChainIdSameAsEventChainId]);
};
