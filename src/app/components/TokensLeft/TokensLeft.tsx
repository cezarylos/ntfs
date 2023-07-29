'use client';

import { useAddEventNetwork } from '@/app/hooks/useAddEventNetwork';
import { useIsCurrentChainIdSameAsEventChainId } from '@/app/hooks/useIsCurrentChainIdSameAsEventChainId';
import { useSwitchChain } from '@/app/hooks/useSwitchChain';
import {
  EventTokensSupplyData,
  selectEventSupplyData,
  getEventTokensSupplyData
} from '@/app/store/global/global.slice';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { EventInterface } from '@/app/typings/event.interface';
import { getChainIdFromString, getLeftWord, getTokenWord } from '@/app/utils';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';

interface Props extends Partial<EventInterface> {
  hasSuffix?: boolean;
}

export default function TokensLeft({ id, chainId, hasSuffix = false }: Props): ReactElement {
  const dispatch = useAppDispatch();
  const eventSupplyData = useAppSelector(selectEventSupplyData);

  const eventChainId = useMemo((): string => getChainIdFromString(chainId as string), [chainId]);

  const switchChain = useSwitchChain(eventChainId);
  const addEventNetwork = useAddEventNetwork(eventChainId);

  const isCurrentChainIdSameAsEventChainId = useIsCurrentChainIdSameAsEventChainId(eventChainId);

  const { tokensLeft, maxSupply } = useMemo(
    (): EventTokensSupplyData => (eventSupplyData.eventId === id ? eventSupplyData : ({} as EventTokensSupplyData)),
    [eventSupplyData, id]
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const init = async (): Promise<void> => {
      setIsLoading(true);
      try {
        await dispatch(getEventTokensSupplyData({ id } as EventInterface));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    init().finally();
  }, [id, chainId, dispatch, isCurrentChainIdSameAsEventChainId, addEventNetwork, switchChain]);

  if (isLoading) {
    return <span className="animate-pulse">Ładowanie...</span>;
  }

  return (
    <>
      {tokensLeft ? (
        <>
          {getLeftWord(tokensLeft)}: {tokensLeft}/{maxSupply}
          {hasSuffix && <span className="text-yellow-300 ml-1 uppercase">{getTokenWord(tokensLeft)}</span>}
        </>
      ) : (
        !isLoading && 'Sorki, sold out :('
      )}
    </>
  );
}
