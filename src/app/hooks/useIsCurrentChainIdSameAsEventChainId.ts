'use client';

import { useMemo } from 'react';
import { useNetwork } from 'wagmi';

export const useIsCurrentChainIdSameAsEventChainId = (eventChainId: string): boolean | undefined => {
  const { chain } = useNetwork();
  return useMemo(() => chain?.id.toString() === eventChainId, [eventChainId, chain]);
};
