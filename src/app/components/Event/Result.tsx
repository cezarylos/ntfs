'use client';

import { useHasProvider } from '@/app/hooks/useHasProvider';
import { setIsLoading } from '@/app/store/global/global.slice';
import { useAppDispatch } from '@/app/store/store';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import React, { ReactElement, useEffect, useState } from 'react';

import axios from 'axios';

export default function Result({ eventId }: { eventId: string }): ReactElement {
  const dispatch = useAppDispatch();
  const hasProvider = useHasProvider();
  const [files, setFiles] = useState<{ url: string }[]>([]);

  useEffect((): void => {
    if (!window?.ethereum) {
      return;
    }
    const init = async (): Promise<void> => {
      try {
        dispatch(setIsLoading(true));
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
        dispatch(setIsLoading(false));
      }
    };
    init().finally();
  }, [dispatch, eventId]);

  if (!hasProvider) {
    return <></>;
  }

  return (
    <>
      <h1>Result</h1>
      {files?.map(({ url }, idx) => (
        <div key={idx}>
          <h2>Ticket #{idx + 1}</h2>
          <a href={url} target="_blank">
            Open ticket
          </a>
        </div>
      ))}
      {files?.length === 0 && <h2>No luck</h2>}
    </>
  );
}
