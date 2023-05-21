'use client';

import { useMetaMask } from '@/app/hooks/useMetaMask';
import { useMemo } from 'react';

export const useIsCurrentChainIdSameAsEventChainId = (eventChainId: string): boolean => {
  const {
    wallet: { chainId: currentChainId }
  } = useMetaMask();
  return useMemo(() => eventChainId === currentChainId, [eventChainId, currentChainId]);
};
