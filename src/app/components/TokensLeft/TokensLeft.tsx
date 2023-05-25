'use client';

import {
  EventTokensSupplyData,
  selectEventSupplyData,
  getEventTokensSupplyData
} from '@/app/store/global/global.slice';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { EventInterface } from '@/app/typings/event.interface';
import { ReactElement, useEffect, useMemo, useState } from 'react';

export default function TokensLeft({ id, chainId }: Partial<EventInterface>): ReactElement {
  const dispatch = useAppDispatch();
  const eventSupplyData = useAppSelector(selectEventSupplyData);

  const { tokensLeft, maxSupply } = useMemo(
    (): EventTokensSupplyData => (eventSupplyData.eventId === id ? eventSupplyData : ({} as EventTokensSupplyData)),
    [eventSupplyData, id]
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const init = async (): Promise<void> => {
      setIsLoading(true);
      try {
        await dispatch(getEventTokensSupplyData({ id, chainId } as EventInterface));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    init().finally();
  }, [id, chainId, dispatch]);

  if (isLoading) {
    return <span className="animate-pulse">Ładowanie...</span>;
  }

  return (
    <>
      {tokensLeft ? (
        <>
          Pozostało: {tokensLeft}/{maxSupply}
        </>
      ) : (
        !isLoading && 'Sorki, brak dostępnych tokenów'
      )}
    </>
  );
}
