'use client'; // this is a client component 👈🏽


import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import Web3 from 'web3';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';

import { EventInterface } from '@/app/typings/event.interface';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { isMobileDevice } from '@/app/utils';

interface HomeInterface {
  events: EventInterface[];
}

export default function Homepage({ events }: HomeInterface): ReactElement {

  const router = useRouter();

  const connectMetamaskMobile = () => {
    const dappUrl = window.location.href.split('//')[1].split('/')[0];
    const metamaskAppDeepLink = 'https://metamask.app.link/dapp/' + dappUrl;
    window.open(metamaskAppDeepLink, '_self');
  };

  const isMobile = isMobileDevice();

  return (
    <>
      {isMobile && <button onClick={connectMetamaskMobile}>ENTER</button>}
      {events.map((event: EventInterface) =>
        <button key={event.id} onClick={() => router.push(`/event/${event.id}`)}>
          <h1>{event.eventName}</h1>
          <h4>{event.eventDescription}</h4>
        </button>
      )}
    </>
  );
}
