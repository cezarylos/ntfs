'use client';

import ProgressBar from '@/app/components/ProgressBar/ProgressBar';
import {
  EventTokensSupplyData,
  getEventTokensSupplyData,
  selectEventSupplyData
} from '@/app/store/global/global.slice';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { EventInterface } from '@/app/typings/event.interface';
import { ReactElement, useEffect, useMemo, useState } from 'react';

export default function TokensLeftProgressBar({ id, chainId }: Partial<EventInterface>): ReactElement {
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

  return maxSupply && tokensLeft ? (
    <div>
      <p className="text-white text-2xl">Wymintowano Tokenów :</p>
      <ProgressBar max={maxSupply} current={tokensLeft} isLoading={isLoading} />
    </div>
  ) : (
    <></>
  );
}
