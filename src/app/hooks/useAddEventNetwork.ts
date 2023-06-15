'use client';

import { useIsCurrentChainIdSameAsEventChainId } from '@/app/hooks/useIsCurrentChainIdSameAsEventChainId';
import { useCallback } from 'react';
import { ChainsEnum } from '@/app/typings/chains.enum';

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
      const params = eventChainId === ChainsEnum.POLYGON ? {
        chainId: eventChainId,
        rpcUrls: ['https://rpc-mainnet.maticvigil.com'],
        chainName: 'Matic Mainnet',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18
        },
        blockExplorerUrls: ['https://polygonscan.com/']
      } : {
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
