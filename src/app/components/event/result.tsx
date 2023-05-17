'use client'; // this is a client component 👈🏽

import React, { ReactElement, useEffect, useState } from 'react';
import axios from 'axios';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { TicketInterface } from '@/app/typings/ticket.interface';
import { useRedirectWhenNoProvider } from '@/app/hooks/useRedirectWhenNoProvider';

export default function Result({ eventId }: { eventId: string; }): ReactElement {
  const hasProvider = useRedirectWhenNoProvider();
  const [files, setFiles] = useState<TicketInterface[] | null>(null);

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
        console.log(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    init().finally();
  }, [eventId]);

  const handleDownload = (filename: string, url: string): () => void => (): void => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  if (!hasProvider) {
    return <></>;
  }

  return <>
    <h1>Result</h1>
    {files?.map(({ name, data }, idx) => <div key={idx}>
        <h2>{name}</h2>
        <button onClick={handleDownload(name, data)}>Download</button>
      </div>
    )}
    {files?.length === 0 && <h2>No luck</h2>}
  </>;
}
