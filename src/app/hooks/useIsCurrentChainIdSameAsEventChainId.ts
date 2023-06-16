'use client';

import { useMetaMask } from '@/app/hooks/useMetaMask';
import { useMemo } from 'react';

export const useIsCurrentChainIdSameAsEventChainId = (eventChainId: string): boolean | undefined => {
  const {
    wallet: { chainId: currentChainId }
  } = useMetaMask();
  return useMemo(() => {
    if (!currentChainId) {
      return undefined;
    }
    return eventChainId === currentChainId;
  }, [eventChainId, currentChainId]);
};
