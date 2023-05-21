'use client';

// this is a client component 👈🏽
import { useHasProvider } from '@/app/hooks/useHasProvider';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { EventInterface } from '@/app/typings/event.interface';
import React, { ReactElement, useEffect, useState } from 'react';

import axios from 'axios';
import EventName from '@/app/components/Event/EventName';

export default function MyTickets({ id: eventId, name }: Partial<EventInterface>): ReactElement {
  const hasProvider = useHasProvider();
  const [files, setFiles] = useState<{ url: string; event?: EventInterface }[]>([]);
  const [isResultLoading, setIsResultLoading] = useState(false);

  useEffect((): void => {
    if (!window?.ethereum) {
      return;
    }
    const init = async (): Promise<void> => {
      try {
        setIsResultLoading(true);
        const message = 'Please verify your address ownership';
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];

        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, address]
        });

        const res = await axios.post('/api/' + EndpointsEnum.GET_MY_TICKETS, {
          signature,
          message,
          address,
          eventId
        });
        setFiles(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsResultLoading(false);
      }
    };
    init().finally();
  }, []);

  if (!hasProvider) {
    return <></>;
  }

  return (
    <>
      {name && <EventName name={name}/>}
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
      {isResultLoading && <h2>Loading...</h2>}
      {!isResultLoading && files?.length === 0 && <h2>No luck</h2>}
    </>
  );
}
