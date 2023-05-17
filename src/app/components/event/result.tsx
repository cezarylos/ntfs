'use client'; // this is a client component 👈🏽

import React, { ReactElement, useEffect, useState } from 'react';
import axios from 'axios';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { useRedirectWhenNoProvider } from '@/app/hooks/useRedirectWhenNoProvider';

export default function Result({ eventId }: { eventId: string; }): ReactElement {
  const hasProvider = useRedirectWhenNoProvider();
  const [files, setFiles] = useState<{ url: string }[]>([]);

  useEffect((): void => {
    if (!window?.ethereum) {
      return;
    }
    const init = async (): Promise<void> => {
      try {
        const message = 'Please verify your address ownership';
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];

        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, address]
        });

        const res = await axios.post('/api/' + EndpointsEnum.CHECK_FOR_TICKETS, {
          signature,
          message,
          address,
          eventId
        });
        setFiles(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    init().finally();
  }, [eventId]);

  if (!hasProvider) {
    return <></>;
  }

  return <>
    <h1>Result</h1>
    {files?.map(({ url }, idx) => <div key={idx}>
        <h2>Ticket #{idx + 1}</h2>
        <a href={url} target='_blank'>
          Open ticket
        </a>
      </div>
    )}
    {files?.length === 0 && <h2>No luck</h2>}
  </>;
}
