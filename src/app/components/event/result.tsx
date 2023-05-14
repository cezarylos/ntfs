'use client'; // this is a client component 👈🏽

import React, { ReactElement, useEffect } from 'react';
import axios from 'axios';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';

export default function Result({ eventId }: { eventId: string; }): ReactElement {

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

        const res = await axios.post('/api/' + EndpointsEnum.VERIFY_ADDRESS_OWNERSHIP, { signature, message, address, eventId });
        console.log(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    init().finally();
  }, [eventId]);

  return <>
    <h1>Result</h1>
  </>;
}
