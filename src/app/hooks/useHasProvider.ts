'use client';

import { useAccount } from 'wagmi';

export const useHasProvider = (): boolean => {
  const { isConnected } = useAccount();
  if (typeof window === 'undefined') {
    return false;
  }
  return isConnected;
};
