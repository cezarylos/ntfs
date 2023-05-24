'use client';

import EventName from '@/app/components/Event/EventName';
import { useHasProvider } from '@/app/hooks/useHasProvider';
import { useMetaMask } from '@/app/hooks/useMetaMask';
import { selectIsLoading, setIsLoading } from '@/app/store/global/global.slice';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { EventInterface } from '@/app/typings/event.interface';
import React, { ReactElement, useEffect, useState } from 'react';

import axios from 'axios';

export default function MyTickets({ id: eventId, name, slug }: Partial<EventInterface>): ReactElement {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const {
    wallet: { accounts }
  } = useMetaMask();
  const hasProvider = useHasProvider();
  const [files, setFiles] = useState<{ url: string; event?: EventInterface }[]>([]);

  useEffect((): void => {
    if (!hasProvider || !accounts?.length) {
      return;
    }
    const init = async (): Promise<void> => {
      try {
        dispatch(setIsLoading(true));
        const message = 'Zweryfikuj swój adres';
        const address = accounts[0];

        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, address]
        });

        const res = await axios.post('/api/' + EndpointsEnum.GET_MY_REWARDS, {
          signature,
          message,
          address,
          eventId
        });
        setFiles(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        dispatch(setIsLoading(false));
      }
    };
    init().finally();
  }, [accounts, dispatch, eventId, hasProvider]);

  if (!hasProvider) {
    return <></>;
  }

  return (
    <>
      {name && <EventName name={name} slug={slug} />}
      <h1>Result</h1>
      {files?.map(({ url, event }, idx) => (
        <div key={idx}>
          <h2>Ticket #{idx + 1}</h2>
          {event && <h2>Event: {event.name}</h2>}
          <a href={url} target="_blank">
            Open ticket
          </a>
        </div>
      ))}
      {!isLoading && files?.length === 0 && <h2>No luck</h2>}
    </>
  );
}
