'use client';

import { useIsCurrentChainIdSameAsEventChainId } from '@/app/hooks/useIsCurrentChainIdSameAsEventChainId';
import { useCallback } from 'react';
import { useAccount, useSwitchNetwork } from 'wagmi';

export const useSwitchChain = (eventChainId: string): (() => Promise<void>) => {
  const isCurrentChainIdSameAsEventChainId = useIsCurrentChainIdSameAsEventChainId(eventChainId);
  const { isConnected } = useAccount();
  const { switchNetworkAsync } = useSwitchNetwork();

  return useCallback(async (): Promise<void> => {
    if (!isConnected) {
      return;
    }
    if (isCurrentChainIdSameAsEventChainId) {
      return;
    }
    try {
      await switchNetworkAsync?.(+eventChainId);
    } catch (error) {
      console.log(error);
    }
  }, [eventChainId, isConnected, isCurrentChainIdSameAsEventChainId, switchNetworkAsync]);
};
