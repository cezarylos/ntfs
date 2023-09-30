'use client';

import { useMemo } from 'react';
import { useNetwork } from 'wagmi';

export const useIsCurrentChainIdSameAsEventChainId = (eventChainId: number): boolean | undefined => {
  const { chain } = useNetwork();
  return useMemo(() => chain?.id.toString() === eventChainId.toString(), [eventChainId, chain]);
};
