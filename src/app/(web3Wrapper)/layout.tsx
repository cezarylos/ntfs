'use client';

import { useIsCurrentChainIdSameAsEventChainId } from '@/app/hooks/useIsCurrentChainIdSameAsEventChainId';
import { useSwitchChain } from '@/app/hooks/useSwitchChain';
import { ChainsEnum, ChainsIdsEnum } from '@/app/typings/chains.enum';
import { ReactNode, useEffect } from 'react';
import { useAccount } from 'wagmi';

const eventChainId = ChainsIdsEnum[ChainsEnum.POLYGON].toString();

export default function Web3Wrapper({ children }: { children: ReactNode }) {
  const { isConnected } = useAccount();
  const isCurrentChainIdSameAsEventChainId = useIsCurrentChainIdSameAsEventChainId(eventChainId);
  const switchChain = useSwitchChain(eventChainId);

  useEffect(() => {
    if (!isConnected) {
      return;
    }
    if (!isCurrentChainIdSameAsEventChainId) {
      switchChain().finally();
    }
  }, [isConnected, isCurrentChainIdSameAsEventChainId, switchChain]);

  return <>{children}</>;
}
