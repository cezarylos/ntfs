'use client';

import { useIsCurrentChainIdSameAsEventChainId } from '@/app/hooks/useIsCurrentChainIdSameAsEventChainId';
import { useCallback } from 'react';
import { useAccount, useSwitchNetwork } from 'wagmi';

export const useSwitchChain = (eventChainId: string): (() => void) => {
  const isCurrentChainIdSameAsEventChainId = useIsCurrentChainIdSameAsEventChainId(eventChainId);
  const { isConnected } = useAccount();
  const { switchNetwork } = useSwitchNetwork();

  return useCallback((): void => {
    if (!isConnected) {
      return;
    }
    if (isCurrentChainIdSameAsEventChainId) {
      return;
    }
    try {
      switchNetwork?.(+eventChainId);
    } catch (error) {
      console.log(error);
    }
  }, [eventChainId, isConnected, isCurrentChainIdSameAsEventChainId, switchNetwork]);
};
