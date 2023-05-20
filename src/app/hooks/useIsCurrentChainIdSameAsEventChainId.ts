'use client';

import { useMemo } from 'react';

export const useIsCurrentChainIdSameAsEventChainId = (eventChainId: string): boolean => {
  const ethereumChainId = window?.ethereum?.chainId;
  return useMemo((): boolean => {
    if (!window?.ethereum) {
      return false;
    }
    return eventChainId === ethereumChainId;
  }, [ethereumChainId, eventChainId]);
};
